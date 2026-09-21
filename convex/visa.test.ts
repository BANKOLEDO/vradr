/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";
import { describe, it, expect } from "vitest";

const modules = import.meta.glob("./**/*.ts");

describe("visa type stats", () => {
  it("returns live stats with trend for a visa type", async () => {
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      await ctx.db.insert("visaTimelines", { country: "United States", visaType: "H-1B", waitDays: 50, dateReported: "2026-01-01", source: "embassy" });
      await ctx.db.insert("visaTimelines", { country: "United States", visaType: "H-1B", waitDays: 60, dateReported: "2026-02-01", source: "embassy" });
    });
    const stats = await t.query(api.visa.getTypeStats, { type: "H-1B" });
    expect(stats).not.toBeNull();
    expect(stats!.current).toBe(60);
    expect(stats!.delta).toBe(10);
    expect(stats!.countries).toBe(1);
  });

  it("returns null stats for an unknown type", async () => {
    const t = convexTest(schema, modules);
    expect(await t.query(api.visa.getTypeStats, { type: "Z-9" })).toBeNull();
  });

  it("averages only the requested types per country", async () => {
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      await ctx.db.insert("visaTimelines", { country: "Canada", visaType: "F-1", waitDays: 10, dateReported: "2026-02-01", source: "embassy" });
      await ctx.db.insert("visaTimelines", { country: "Canada", visaType: "Tourist", waitDays: 30, dateReported: "2026-02-01", source: "embassy" });
    });
    const avgs = await t.query(api.visa.getTypeAverages, { types: ["F-1"] });
    expect(avgs["Canada"]).toBe(10);
    expect(await t.query(api.visa.getTypeAverages, { types: [] })).toEqual({});
  });

  it("returns one row per visa instead of history rows", async () => {
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      await ctx.db.insert("visaTimelines", { country: "United States", visaType: "B1/B2", waitDays: 30, dateReported: "2026-01-01", source: "embassy" });
      await ctx.db.insert("visaTimelines", { country: "United States", visaType: "B1/B2", waitDays: 28, dateReported: "2026-02-01", source: "embassy" });
    });
    const rows = await t.query(api.visa.search, { query: "b1" });
    expect(rows).toHaveLength(1);
    expect(rows[0].waitDays).toBe(28);
  });
});
