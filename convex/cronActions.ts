import { internalAction, internalMutation, MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Each source resolves to a country + visa type we actually display, so the
// scraped value lands on a real country card instead of "Unknown".
const SOURCES: { url: string; country: string; visaType: string }[] = [
  {
    url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/wait-times.html",
    country: "United States",
    visaType: "Tourist",
  },
  {
    url: "https://www.gov.uk/check-uk-visa",
    country: "United Kingdom",
    visaType: "Tourist",
  },
  {
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html",
    country: "Canada",
    visaType: "Tourist",
  },
];

const FIRECRAWL_API = "https://api.firecrawl.dev/v2";

async function scrapePage(url: string, apiKey: string) {
  const res = await fetch(`${FIRECRAWL_API}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
  });
  if (!res.ok) throw new Error(`Firecrawl ${res.status}`);
  const data = await res.json();
  if (data.success === false) throw new Error(`Firecrawl: ${data.error ?? "scrape failed"}`);
  return typeof data.data?.markdown === "string" ? data.data.markdown : "";
}

function extractWaitDays(content: string): number | null {
  const patterns = [
    /(\d+)\s*(?:business\s*)?days?\s*(?:to\s*(?:process|receive|get))/i,
    /processing\s*(?:time|takes?)\s*[:\-]?\s*(\d+)\s*days?/i,
    /wait\s*(?:time|period)\s*[:\-]?\s*(\d+)\s*days?/i,
  ];
  for (const p of patterns) {
    const m = content.match(p);
    if (m) return parseInt(m[1]);
  }
  return null;
}

export const runScrape = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) return;

    for (const source of SOURCES) {
      try {
        const content = await scrapePage(source.url, apiKey);
        const waitDays = extractWaitDays(content);
        if (waitDays) {
          await ctx.runMutation(internal.cronActions.insertResult, {
            country: source.country,
            visaType: source.visaType,
            waitDays,
            sourceUrl: source.url,
          });
        }
      } catch {
        // skip failed scrapes silently
      }
    }
  },
});

export const insertResult = internalMutation({
  args: {
    country: v.string(),
    visaType: v.string(),
    waitDays: v.number(),
    sourceUrl: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await recordTimeline(ctx, {
      country: args.country,
      visaType: args.visaType,
      waitDays: args.waitDays,
      source: `embassy:${args.sourceUrl}`,
    });
    return null;
  },
});

// Shared timeline write: stores, then tells watchers on change.
export async function recordTimeline(
  ctx: MutationCtx,
  args: { country: string; visaType: string; waitDays: number; source: string }
) {
  const prior = await ctx.db
    .query("visaTimelines")
    .withIndex("by_country", (q) => q.eq("country", args.country))
    .order("desc")
    .take(20);
  const prev = prior.filter((r) => r.visaType === args.visaType).sort((a, b) => b.dateReported.localeCompare(a.dateReported))[0];
  await ctx.db.insert("visaTimelines", { ...args, dateReported: new Date().toISOString() });
  if (prev && prev.waitDays !== args.waitDays) {
    await announceChange(ctx, { country: args.country, visaType: args.visaType, oldWait: prev.waitDays, newWait: args.waitDays });
  }
}

// Tell watchers a wait moved, in-app plus email.
export async function announceChange(
  ctx: MutationCtx,
  args: { country: string; visaType: string; oldWait: number; newWait: number }
) {
  const direction = args.newWait > args.oldWait ? "rose" : "fell";
  const watchers = await ctx.db
    .query("watchlist")
    .withIndex("by_place", (q) => q.eq("country", args.country).eq("visaType", args.visaType))
    .take(100);
  for (const w of watchers) {
    await ctx.db.insert("alerts", {
      userId: w.userId,
      type: "wait-change",
      message: `${args.country} ${args.visaType} wait ${direction} from ${args.oldWait} to ${args.newWait} days.`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    const user = await ctx.db.get(w.userId as any).catch(() => null);
    if (user && (user as any).email) {
      await ctx.scheduler.runAfter(0, internal.notify.notifyWaitUpdate, {
        email: (user as any).email,
        country: args.country,
        visaType: args.visaType,
        oldWait: args.oldWait,
        newWait: args.newWait,
      });
    }
  }
  return null;
}
