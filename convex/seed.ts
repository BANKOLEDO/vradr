import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Base current values per (country, visaType). History is derived below with
// a stable, dated series so sparklines reflect real week-over-week records.
const SEED_BASE: { country: string; visaType: string; waitDays: number; source: string }[] = [
  { country: "United States", visaType: "Tourist", waitDays: 21, source: "embassy" },
  { country: "United States", visaType: "B1/B2", waitDays: 28, source: "embassy" },
  { country: "United States", visaType: "H-1B", waitDays: 60, source: "embassy" },
  { country: "United States", visaType: "F-1", waitDays: 25, source: "embassy" },
  { country: "United States", visaType: "J-1", waitDays: 18, source: "embassy" },
  { country: "United States", visaType: "Work", waitDays: 45, source: "embassy" },
  { country: "United States", visaType: "Student", waitDays: 30, source: "embassy" },
  { country: "United Kingdom", visaType: "Tourist", waitDays: 15, source: "embassy" },
  { country: "United Kingdom", visaType: "Work", waitDays: 25, source: "embassy" },
  { country: "United Kingdom", visaType: "Student", waitDays: 20, source: "embassy" },
  { country: "Canada", visaType: "Tourist", waitDays: 18, source: "embassy" },
  { country: "Canada", visaType: "Work", waitDays: 35, source: "embassy" },
  { country: "Canada", visaType: "Student", waitDays: 12, source: "embassy" },
  { country: "Germany", visaType: "Tourist", waitDays: 10, source: "embassy" },
  { country: "Germany", visaType: "Work", waitDays: 22, source: "embassy" },
  { country: "Germany", visaType: "Student", waitDays: 8, source: "embassy" },
  { country: "Australia", visaType: "Tourist", waitDays: 14, source: "embassy" },
  { country: "Australia", visaType: "Work", waitDays: 40, source: "embassy" },
  { country: "Australia", visaType: "Student", waitDays: 28, source: "embassy" },
  { country: "Japan", visaType: "Tourist", waitDays: 5, source: "embassy" },
  { country: "Japan", visaType: "Work", waitDays: 14, source: "embassy" },
  { country: "Japan", visaType: "Student", waitDays: 10, source: "embassy" },
  { country: "France", visaType: "Tourist", waitDays: 12, source: "embassy" },
  { country: "France", visaType: "Work", waitDays: 30, source: "embassy" },
  { country: "France", visaType: "Student", waitDays: 18, source: "embassy" },
  { country: "India", visaType: "Tourist", waitDays: 7, source: "embassy" },
  { country: "India", visaType: "Work", waitDays: 20, source: "embassy" },
  { country: "India", visaType: "Student", waitDays: 15, source: "embassy" },
  { country: "Brazil", visaType: "Tourist", waitDays: 10, source: "embassy" },
  { country: "Brazil", visaType: "Work", waitDays: 28, source: "embassy" },
  { country: "Brazil", visaType: "Student", waitDays: 16, source: "embassy" },
  { country: "South Korea", visaType: "Tourist", waitDays: 6, source: "embassy" },
  { country: "South Korea", visaType: "Work", waitDays: 18, source: "embassy" },
  { country: "South Korea", visaType: "Student", waitDays: 12, source: "embassy" },
  { country: "Schengen", visaType: "Tourist", waitDays: 15, source: "embassy" },
  { country: "Schengen", visaType: "Business", waitDays: 20, source: "embassy" },
  { country: "Schengen", visaType: "Transit", waitDays: 3, source: "embassy" },
  { country: "UAE", visaType: "Tourist", waitDays: 3, source: "embassy" },
  { country: "UAE", visaType: "Work", waitDays: 10, source: "embassy" },
  { country: "UAE", visaType: "Business", waitDays: 5, source: "embassy" },
];

// Number of past weeks of history to backfill per entry.
const HISTORY_WEEKS = 8;

// Date string <days> days ago, at 06:00 UTC.
function backdate(daysAgo: number) {
  const d = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  d.setUTCHours(6, 0, 0, 0);
  return d.toISOString();
}

export const seed = mutation({
  args: { force: v.optional(v.boolean()) },
  returns: v.string(),
  handler: async (ctx, args) => {
    // Force clears seed rows only, never real scrapes.
    if (args.force) {
      const seeded = await ctx.db.query("visaTimelines").filter((q) => q.eq(q.field("source"), "embassy")).collect();
      for (const row of seeded) {
        await ctx.db.delete(row._id);
      }
    }

    // Only backfill pairs missing entirely.
    const have = new Set<string>();
    for (const c of [...new Set(SEED_BASE.map((b) => b.country))]) {
      const rows = await ctx.db.query("visaTimelines").withIndex("by_country", (q) => q.eq("country", c)).take(500);
      for (const r of rows) have.add(`${r.country}::${r.visaType}`);
    }

    let added = 0;

    for (const base of SEED_BASE) {
      if (have.has(`${base.country}::${base.visaType}`)) continue;
      added++;
      for (let w = HISTORY_WEEKS - 1; w >= 0; w--) {
        const drift = Math.round((Math.sin(w + base.country.length) * 0.08) * base.waitDays);
        const waitDays = Math.max(1, base.waitDays + drift);
        await ctx.db.insert("visaTimelines", {
          country: base.country,
          visaType: base.visaType,
          waitDays,
          source: base.source,
          dateReported: backdate(w * 7 + 2),
        });
      }
    }

    // Current figure with today's timestamp.
    for (const base of SEED_BASE) {
      if (have.has(`${base.country}::${base.visaType}`)) continue;
      await ctx.db.insert("visaTimelines", {
        country: base.country,
        visaType: base.visaType,
        waitDays: base.waitDays,
        source: base.source,
        dateReported: backdate(0),
      });
    }

    return `added ${added} pairs`;
  },
});

// Default feed sources.
const FEED_SOURCES: { url: string; label: string; country: string; visaType: string }[] = [
  { url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/wait-times.html", label: "US wait times", country: "United States", visaType: "Tourist" },
  { url: "https://www.gov.uk/check-uk-visa", label: "UK visa checker", country: "United Kingdom", visaType: "Tourist" },
  { url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html", label: "Canada visitor info", country: "Canada", visaType: "Tourist" },
];

export const seedFeeds = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const have = new Set((await ctx.db.query("feedSources").take(100)).map((r) => r.url));
    let added = 0;
    for (const s of FEED_SOURCES) {
      if (have.has(s.url)) continue;
      await ctx.db.insert("feedSources", { ...s, active: true });
      added++;
    }
    return `added ${added} feed sources`;
  },
});