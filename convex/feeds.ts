import { action, internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { recordTimeline } from "./cronActions";

const FIRECRAWL_API = "https://api.firecrawl.dev/v2";

export function extractWaitDays(content: string): number | null {  const patterns = [
    /(\d+)\s*(?:to|–|-)\s*(\d+)\s*days?/i,
    /(\d+)\s*(?:business\s*)?days?\s*(?:to\s*(?:process|receive|get))/i,
    /processing\s*(?:time|takes?)\s*[:\-]?\s*(\d+)\s*days?/i,
    /wait\s*(?:time|period)\s*[:\-]?\s*(\d+)\s*days?/i,
    /approximately\s*(\d+)\s*days?/i,
  ];
  for (const p of patterns) {
    const m = content.match(p);
    if (m) {
      if (m[2]) return Math.round((parseInt(m[1]) + parseInt(m[2])) / 2);
      return parseInt(m[1]);
    }
  }
  return null;
}

export async function scrapeUrl(url: string, apiKey: string): Promise<{ title?: string; markdown: string }> {
  const res = await fetch(`${FIRECRAWL_API}/scrape`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
  });
  if (!res.ok) throw new Error(`Firecrawl ${res.status}`);
  const data = await res.json();
  if (data.success === false) throw new Error(`Firecrawl: ${data.error ?? "scrape failed"}`);
  const rawTitle = data.data?.metadata?.title;
  const title = Array.isArray(rawTitle) ? rawTitle[0] : rawTitle;
  const markdown = typeof data.data?.markdown === "string" ? data.data.markdown : "";
  return { title: typeof title === "string" ? title : undefined, markdown };
}

// Needs FIRECRAWL_API_KEY.
export const scrapeFeed = action({
  args: { url: v.string() },
  returns: v.object({ title: v.optional(v.string()), markdown: v.string() }),
  handler: async (_ctx, args) => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY not set");
    const page = await scrapeUrl(args.url, apiKey);
    return { title: page.title, markdown: page.markdown.slice(0, 8000) };
  },
});

// Ask Firecrawl search for fresh pages. New URLs land inactive for review.
export const discover = action({
  args: { query: v.string(), limit: v.optional(v.number()) },
  returns: v.array(v.object({ url: v.string(), title: v.optional(v.string()), added: v.boolean() })),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY not set");
    const res = await fetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ query: args.query, limit: Math.min(args.limit ?? 10, 20) }),
    });
    if (!res.ok) throw new Error(`Firecrawl ${res.status}`);
    const data = await res.json();
    const hits = Array.isArray(data.data) ? data.data : [];
    const known = new Set((await ctx.runQuery(internal.feeds.allSourceUrls, {})).map((u) => u.toLowerCase()));
    const out: { url: string; title?: string; added: boolean }[] = [];
    for (const h of hits.slice(0, 20)) {
      if (typeof h?.url !== "string") continue;
      const title = typeof h?.title === "string" ? h.title : undefined;
      if (known.has(h.url.toLowerCase())) {
        out.push({ url: h.url, title, added: false });
        continue;
      }
      await ctx.runMutation(internal.feeds.addDiscovered, { url: h.url, title });
      known.add(h.url.toLowerCase());
      out.push({ url: h.url, title, added: true });
    }
    return out;
  },
});

export const allSourceUrls = internalQuery({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => (await ctx.db.query("feedSources").take(200)).map((r) => r.url),
});

export const addDiscovered = internalMutation({
  args: { url: v.string(), title: v.optional(v.string()) },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("feedSources", {
      url: args.url,
      label: args.title ?? args.url,
      active: false,
      userId: "",
    });
    return null;
  },
});

export const setSourceActive = mutation({
  args: { id: v.id("feedSources"), active: v.boolean() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const row = await ctx.db.get(args.id);
    if (!row) throw new Error("Not found");
    await ctx.db.patch(args.id, { active: args.active });
    return null;
  },
});

export const activeSources = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("feedSources"),
      _creationTime: v.number(),
      url: v.string(),
      label: v.string(),
      country: v.optional(v.string()),
      visaType: v.optional(v.string()),
      active: v.boolean(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("feedSources").withIndex("by_active", (q) => q.eq("active", true)).take(50);
  },
});

export function contentHash(content: string): string {
  let h = 5381;
  for (let i = 0; i < content.length; i++) {
    h = ((h << 5) + h + content.charCodeAt(i)) >>> 0;
  }
  return h.toString(16);
}

export const storePage = internalMutation({
  args: {
    url: v.string(),
    title: v.optional(v.string()),
    markdown: v.string(),
    country: v.optional(v.string()),
    visaType: v.optional(v.string()),
    waitDays: v.optional(v.number()),
  },
  returns: v.object({ stored: v.boolean() }),
  handler: async (ctx, args) => {
    const hash = contentHash(args.markdown);
    const latest = await ctx.db
      .query("scrapedPages")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .order("desc")
      .take(1);
    if (latest[0]?.hash === hash) return { stored: false };
    await ctx.db.insert("scrapedPages", {
      url: args.url,
      title: args.title,
      markdown: args.markdown.slice(0, 8000),
      hash,
      source: "firecrawl",
      scrapedAt: new Date().toISOString(),
    });
    if (args.country && args.visaType && args.waitDays !== undefined) {
      await recordTimeline(ctx, {
        country: args.country,
        visaType: args.visaType,
        waitDays: args.waitDays,
        source: `firecrawl:${args.url}`,
      });
    }
    return { stored: true };
  },
});

// Drop rows older than the retention window so tables stay small.
export const pruneOld = internalMutation({
  args: {},
  returns: v.object({ timelines: v.number(), pages: v.number() }),
  handler: async (ctx) => {
    const cutoff = new Date(Date.now() - 180 * 86400000).toISOString();
    let timelines = 0;
    let pages = 0;
    for (const row of await ctx.db.query("visaTimelines").order("asc").take(500)) {
      if (row.dateReported >= cutoff) break;
      await ctx.db.delete(row._id);
      timelines++;
    }
    for (const row of await ctx.db.query("scrapedPages").order("asc").take(500)) {
      if (row.scrapedAt >= cutoff) break;
      await ctx.db.delete(row._id);
      pages++;
    }
    return { timelines, pages };
  },
});

// Cron worker.
export const runFeeds = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) return null;
    const sources = await ctx.runQuery(internal.feeds.activeSources, {});
    for (const source of sources) {
      try {
        const page = await scrapeUrl(source.url, apiKey);
        const waitDays = extractWaitDays(page.markdown);
        await ctx.runMutation(internal.feeds.storePage, {
          url: source.url,
          title: page.title,
          markdown: page.markdown,
          country: source.country,
          visaType: source.visaType,
          waitDays: waitDays ?? undefined,
        });
      } catch {
        // Next run retries.
      }
    }
    await ctx.runMutation(internal.feeds.pruneOld, {});
    return null;
  },
});

export const latestPages = query({
  args: { limit: v.number() },
  returns: v.array(
    v.object({
      _id: v.id("scrapedPages"),
      _creationTime: v.number(),
      url: v.string(),
      title: v.optional(v.string()),
      source: v.string(),
      scrapedAt: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const pages = await ctx.db.query("scrapedPages").order("desc").take(Math.min(args.limit, 50));
    return pages.map((p) => ({
      _id: p._id,
      _creationTime: p._creationTime,
      url: p.url,
      title: p.title,
      source: p.source,
      scrapedAt: p.scrapedAt,
    }));
  },
});

export const listSources = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("feedSources"),
      _creationTime: v.number(),
      url: v.string(),
      label: v.string(),
      country: v.optional(v.string()),
      visaType: v.optional(v.string()),
      active: v.boolean(),
      mine: v.boolean(),
    })
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const mine = identity ? await callerKey(ctx, identity) : null;
    const rows = await ctx.db.query("feedSources").take(50);
    return rows.map((r) => ({
      _id: r._id,
      _creationTime: r._creationTime,
      url: r.url,
      label: r.label,
      country: r.country,
      visaType: r.visaType,
      active: r.active,
      mine: !!mine && r.userId === mine,
    }));
  },
});

// Stable per-user key for ownership. Subject is "rowId|sessionId".
async function callerKey(ctx: any, identity: { subject: string }) {
  try {
    const row = await ctx.db.get(identity.subject.split("|")[0]);
    if (row) return row._id as string;
  } catch {
    // Fall through.
  }
  return identity.subject;
}

export const addSource = mutation({
  args: {
    url: v.string(),
    label: v.string(),
    country: v.optional(v.string()),
    visaType: v.optional(v.string()),
  },
  returns: v.id("feedSources"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const mine = await callerKey(ctx, identity);
    const actives = await ctx.db.query("feedSources").withIndex("by_active", (q) => q.eq("active", true)).take(50);
    const mineCount = actives.filter((r) => r.userId === mine).length;
    if (mineCount >= 5) throw new Error("Source limit reached. Remove one to add another.");
    return await ctx.db.insert("feedSources", { ...args, active: true, userId: mine });
  },
});

export const removeSource = mutation({
  args: { id: v.id("feedSources") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const row = await ctx.db.get(args.id);
    if (!row) throw new Error("Not found");
    const mine = await callerKey(ctx, identity);
    if (row.userId && row.userId !== mine) throw new Error("Only the person who added it can remove it.");
    await ctx.db.delete(args.id);
    return null;
  },
});
