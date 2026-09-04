/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";
import { describe, it, expect } from "vitest";

const modules = import.meta.glob("./**/*.ts");

describe("VRADR auth + personalization flow", () => {
  it("rejects unauthenticated profile access", async () => {
    const t = convexTest(schema, modules);
    expect(await t.query(api.users.getProfile)).toBeNull();
  });

  it("saves country on signup and returns personalized profile", async () => {
    const t = convexTest(schema, modules);
    const userId = "user-nigeria";
    const asUser = t.withIdentity({ subject: userId });

    // Simulates the createProfile call made after password signup
    await asUser.mutation(api.users.createProfile, { country: "Nigeria" });

    // Dashboard (GET profile) reads the origin country
    const profile = await asUser.query(api.users.getProfile);
    expect(profile).not.toBeNull();
    expect(profile!.country).toBe("Nigeria");
    expect(profile!.userId).toBe(userId);
  });

  it("is idempotent — repeated createProfile does not duplicate", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "user-dup" });

    await asUser.mutation(api.users.createProfile, { country: "India" });
    await asUser.mutation(api.users.createProfile, { country: "India" });
    const profile = await asUser.query(api.users.getProfile);
    expect(profile!.country).toBe("India");
  });

  it("returns the real fastest visa among a user's top destinations", async () => {
    const t = convexTest(schema, modules);
    // Seed a dash of visaTimelines
    await t.run(async (ctx) => {
      await ctx.db.insert("visaTimelines", { country: "United States", visaType: "Tourist", waitDays: 21, dateReported: "2026-01-01", source: "embassy" });
      await ctx.db.insert("visaTimelines", { country: "United Kingdom", visaType: "Tourist", waitDays: 15, dateReported: "2026-01-01", source: "embassy" });
      await ctx.db.insert("visaTimelines", { country: "Canada", visaType: "Student", waitDays: 5, dateReported: "2026-01-01", source: "embassy" });
    });

    // Nigeria's top destinations (from DESTINATION_MAP): US, UK, Canada, Germany
    const fastest = await t.query(api.visa.getFastestFor, {
      countries: ["United States", "United Kingdom", "Canada", "Germany"],
    });
    expect(fastest).not.toBeNull();
    expect(fastest!.country).toBe("Canada");
    expect(fastest!.visaType).toBe("Student");
    expect(fastest!.waitDays).toBe(5);
  });

  it("returns null for getFastestFor with no matching countries", async () => {
    const t = convexTest(schema, modules);
    const fastest = await t.query(api.visa.getFastestFor, {
      countries: ["Iceland"],
    });
    expect(fastest).toBeNull();
  });

  it("only tracks applications for an authenticated user", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "user-apps" });

    await asUser.mutation(api.applications.track, {
      country: "United States",
      visaType: "Work",
      applicationDate: "2026-01-01",
    });

    const apps = await asUser.query(api.applications.listByUser);
    expect(apps).toHaveLength(1);
    expect(apps[0].country).toBe("United States");
    expect(apps[0].userId).toBe("user-apps");

    // unauthenticated cannot list (returns empty, not error)
    const anon = await t.query(api.applications.listByUser);
    expect(anon).toEqual([]);
  });

  it("returns getProfile null for an authenticated user without a profile", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "nobody-profile" });
    const profile = await asUser.query(api.users.getProfile);
    expect(profile).toBeNull();
  });

  it("returns live waits for tracked applications", async () => {
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      await ctx.db.insert("visaTimelines", { country: "United States", visaType: "Work", waitDays: 45, dateReported: "2026-02-01", source: "embassy" });
    });
    const waits = await t.query(api.applications.getAppWaits, {
      pairs: [{ country: "United States", visaType: "Work" }, { country: "Iceland", visaType: "Work" }],
    });
    expect(waits).toHaveLength(1);
    expect(waits[0].waitDays).toBe(45);
  });

  it("handles composite subject and never duplicates or clobbers email", async () => {
    const t = convexTest(schema, modules);
    // First session: composite subject, email present (auth row created by callback).
    const s1 = t.withIdentity({ subject: "u1|sess1", email: "a@x.com" });
    await s1.mutation(api.users.createProfile, { country: "Nigeria" });

    // Second session: new session id, identity email empty (the reported bug).
    const s2 = t.withIdentity({ subject: "u1|sess2" });
    await s2.mutation(api.users.createProfile, { country: "Ghana" });

    const rows = await t.run(async (ctx) => await ctx.db.query("users").collect());
    expect(rows).toHaveLength(1);
    expect(rows[0].country).toBe("Ghana");
    expect(rows[0].email).toBe("a@x.com");
    expect(rows[0].userId).toBe("u1");
  });
});
