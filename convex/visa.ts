import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByCountry = query({
  args: { country: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("visaTimelines")
      .withIndex("by_country", (q) => q.eq("country", args.country))
      .collect();
  },
});

export const getByVisaType = query({
  args: { visaType: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("visaTimelines")
      .withIndex("by_visa_type", (q) => q.eq("visaType", args.visaType))
      .collect();
  },
});

export const getGlobalStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("visaTimelines").collect();
    if (!all.length) return { avgWait: 0, totalEntries: 0, countries: 0 };

    const avgWait = all.reduce((sum, e) => sum + e.waitDays, 0) / all.length;
    const countries = new Set(all.map((e) => e.country)).size;
    return { avgWait: Math.round(avgWait), totalEntries: all.length, countries };
  },
});

export const getFastestFor = query({
  args: { countries: v.array(v.string()) },
  handler: async (ctx, args) => {
    if (!args.countries.length) return null;
    const map = await ctx.db.query("visaTimelines").collect();
    const inScope = map.filter((e) => args.countries.includes(e.country));
    if (!inScope.length) return null;

    // Consider only each country's most recently recorded value so the
    // "fastest right now" reflects live data, not old history.
    const latestByCountry: Record<string, typeof inScope[number]> = {};
    for (const e of inScope) {
      const cur = latestByCountry[e.country];
      if (!cur || e.dateReported > cur.dateReported) latestByCountry[e.country] = e;
    }
    const latest = Object.values(latestByCountry).sort((a, b) => a.waitDays - b.waitDays);

    const fastest = latest[0];
    return {
      country: fastest.country,
      visaType: fastest.visaType,
      waitDays: fastest.waitDays,
      source: fastest.source,
      dateReported: fastest.dateReported,
    };
  },
});

export const addTimeline = mutation({
  args: {
    country: v.string(),
    visaType: v.string(),
    waitDays: v.number(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("visaTimelines", {
      ...args,
      dateReported: new Date().toISOString(),
    });
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const q = args.query.toLowerCase();
    const all = await ctx.db.query("visaTimelines").collect();
    return all.filter(
      (e) =>
        e.country.toLowerCase().includes(q) ||
        e.visaType.toLowerCase().includes(q),
    );
  },
});

export const compare = query({
  args: { countries: v.array(v.string()), visaType: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("visaTimelines").collect();
    const filtered = all.filter(
      (e) =>
        args.countries.includes(e.country) &&
        (!args.visaType || e.visaType === args.visaType),
    );

    const grouped: Record<string, { country: string; avgWait: number; min: number; max: number; count: number; entries: typeof filtered }> = {};
    for (const entry of filtered) {
      if (!grouped[entry.country]) {
        grouped[entry.country] = { country: entry.country, avgWait: 0, min: entry.waitDays, max: entry.waitDays, count: 0, entries: [] };
      }
      const g = grouped[entry.country];
      g.entries.push(entry);
      g.count++;
      g.min = Math.min(g.min, entry.waitDays);
      g.max = Math.max(g.max, entry.waitDays);
    }

    for (const g of Object.values(grouped)) {
      g.avgWait = Math.round(g.entries.reduce((s, e) => s + e.waitDays, 0) / g.count);
    }

    return Object.values(grouped)
      .filter((g) => g.count > 0)
      .sort((a, b) => a.avgWait - b.avgWait);
  },
});

export const getPopularCountries = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("visaTimelines").collect();
    const counts: Record<string, number> = {};
    for (const e of all) {
      counts[e.country] = (counts[e.country] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([country, count]) => ({ country, count }));
  },
});

export const getTrends = query({
  args: { country: v.string() },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("visaTimelines")
      .withIndex("by_country", (q) => q.eq("country", args.country))
      .collect();

    const byType: Record<string, typeof entries> = {};
    for (const e of entries) {
      if (!byType[e.visaType]) byType[e.visaType] = [];
      byType[e.visaType].push(e);
    }

    return Object.entries(byType).map(([visaType, items]) => {
      items.sort((a, b) => a.dateReported.localeCompare(b.dateReported));
      const latest = items[items.length - 1]?.waitDays ?? 0;
      const oldest = items[0]?.waitDays ?? 0;
      const trend = latest - oldest;
      return { visaType, latest, oldest, trend, dataPoints: items.length };
    });
  },
});

export const getSparklines = query({
  args: { countries: v.array(v.string()) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("visaTimelines").collect();
    const out: Record<string, number[]> = {};
    for (const country of args.countries) {
      const entries = all
        .filter((e) => e.country === country)
        .sort((a, b) => a.dateReported.localeCompare(b.dateReported));
      if (!entries.length) continue;

      // Fold all of a country's timeline into a daily average series so
      // every recorded day contributes one real point (true chronology).
      const byDay = new Map<string, { sum: number; n: number }>();
      for (const e of entries) {
        const day = e.dateReported.slice(0, 10);
        const cur = byDay.get(day) ?? { sum: 0, n: 0 };
        cur.sum += e.waitDays;
        cur.n++;
        byDay.set(day, cur);
      }
      const series = [...byDay.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([, v]) => Math.round(v.sum / v.n));

      // Only show a line when there is real history; otherwise render a
      // single flat value rather than inventing a fake trend.
      out[country] = series.length >= 2 ? series.slice(-8) : [series[0]];
    }
    return out;
  },
});

export const getTypeAverages = query({
  args: { types: v.array(v.string()) },
  handler: async (ctx, args) => {
    if (!args.types.length) return {};
    const all = await ctx.db.query("visaTimelines").collect();
    const inScope = all.filter((e) => args.types.includes(e.visaType));
    const latest: Record<string, string> = {};
    for (const e of inScope) {
      const day = e.dateReported.slice(0, 10);
      if (latest[e.country] === undefined || day > latest[e.country]) {
        latest[e.country] = day;
      }
    }
    const sums: Record<string, { sum: number; n: number }> = {};
    for (const e of inScope) {
      if (e.dateReported.slice(0, 10) !== latest[e.country]) continue;
      const cur = sums[e.country] ?? { sum: 0, n: 0 };
      cur.sum += e.waitDays;
      cur.n++;
      sums[e.country] = cur;
    }
    const out: Record<string, number> = {};
    for (const [c, s] of Object.entries(sums)) {
      out[c] = Math.round(s.sum / s.n);
    }
    return out;
  },
});

export const getTypeStats = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("visaTimelines")
      .withIndex("by_visa_type", (q) => q.eq("visaType", args.type))
      .collect();
    if (!all.length) return null;
    const latestDay = all.map((e) => e.dateReported.slice(0, 10)).sort().pop() as string;
    const now = all.filter((e) => e.dateReported.slice(0, 10) === latestDay);
    const older = all.filter((e) => e.dateReported.slice(0, 10) !== latestDay);
    const avg = (rows: typeof all) => Math.round(rows.reduce((s, e) => s + e.waitDays, 0) / rows.length);
    const current = avg(now);
    const prev = older.length ? avg(older) : current;
    return {
      current,
      prev,
      delta: current - prev,
      countries: new Set(now.map((e) => e.country)).size,
      records: all.length,
      updatedAt: latestDay,
    };
  },
});

export const getCountryAverages = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("visaTimelines").collect();
    // Latest recorded day per country, averaged across visa types — reflects
    // the current figure rather than history, matching the sparkline endpoint.
    const latest: Record<string, string> = {};
    for (const e of all) {
      const day = e.dateReported.slice(0, 10);
      if (latest[e.country] === undefined || day > latest[e.country]) {
        latest[e.country] = day;
      }
    }
    const sums: Record<string, { sum: number; n: number }> = {};
    for (const e of all) {
      if (e.dateReported.slice(0, 10) !== latest[e.country]) continue;
      const cur = sums[e.country] ?? { sum: 0, n: 0 };
      cur.sum += e.waitDays;
      cur.n++;
      sums[e.country] = cur;
    }
    const out: Record<string, number> = {};
    for (const [c, s] of Object.entries(sums)) {
      out[c] = Math.round(s.sum / s.n);
    }
    return out;
  },
});
