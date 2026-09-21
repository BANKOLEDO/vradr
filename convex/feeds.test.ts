/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import schema from "./schema";
import { api, internal } from "./_generated/api";
import { describe, it, expect } from "vitest";
import { extractWaitDays } from "./feeds";

const modules = import.meta.glob("./**/*.ts");

describe("Firecrawl feeds", () => {
  it("extracts wait days from scraped markdown", () => {
    expect(extractWaitDays("Processing time: 21 days for tourist visas")).toBe(21);
    expect(extractWaitDays("Wait period - 15 days")).toBe(15);
    expect(extractWaitDays("Takes 10 to 20 days to process")).toBe(15);
    expect(extractWaitDays("No timing info here at all")).toBeNull();
  });

  it("stores a scraped page and surfaces it in latestPages", async () => {
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      await ctx.db.insert("scrapedPages", {
        url: "https://example.com/visa",
        title: "Visa wait times",
        markdown: "Processing time: 21 days",
        source: "firecrawl",
        scrapedAt: new Date().toISOString(),
      });
    });
    const pages = await t.query(api.feeds.latestPages, { limit: 5 });
    expect(pages).toHaveLength(1);
    expect(pages[0].url).toBe("https://example.com/visa");
  });

  it("skips storing unchanged pages", async () => {
    const t = convexTest(schema, modules);
    const args = { url: "https://example.com/x", markdown: "Same content", country: "Canada", visaType: "Tourist", waitDays: 9 };
    expect(await t.mutation(internal.feeds.storePage, args)).toEqual({ stored: true });
    expect(await t.mutation(internal.feeds.storePage, args)).toEqual({ stored: false });
    expect((await t.query(api.feeds.latestPages, { limit: 5 })).length).toBe(1);
  });

  it("prunes rows older than retention", async () => {
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      await ctx.db.insert("visaTimelines", { country: "X", visaType: "Y", waitDays: 1, dateReported: "2020-01-01", source: "embassy" });
      await ctx.db.insert("visaTimelines", { country: "X", visaType: "Y", waitDays: 2, dateReported: new Date().toISOString(), source: "embassy" });
    });
    const r = await t.mutation(internal.feeds.pruneOld, {});
    expect(r.timelines).toBe(1);
  });
  it("guards discovery behind auth and keys", async () => {
    const t = convexTest(schema, modules);
    await expect(t.action(api.feeds.discover, { query: "visa wait times" })).rejects.toThrow("Not authenticated");
    const asUser = t.withIdentity({ subject: "finder" });
    await expect(asUser.action(api.feeds.discover, { query: "visa wait times" })).rejects.toThrow("not set");
  });

  it("adds a feed source for an authenticated user only", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "feed-user" });
    const id = await asUser.mutation(api.feeds.addSource, { url: "https://example.com", label: "Example" });
    expect(id).toBeDefined();
    const sources = await t.query(api.feeds.listSources, {});
    expect(sources).toHaveLength(1);
    expect(sources[0].active).toBe(true);
  });
});
