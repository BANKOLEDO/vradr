/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";
import { describe, it, expect } from "vitest";

const modules = import.meta.glob("./**/*.ts");

describe("concurrent users", () => {
  it("handles many users signing up and tracking at once", async () => {
    const t = convexTest(schema, modules);
    const N = 15;
    await Promise.all(
      Array.from({ length: N }, (_, i) => {
        const asUser = t.withIdentity({ subject: `load-user-${i}` });
        return (async () => {
          await asUser.mutation(api.users.createProfile, { country: "Nigeria" });
          await asUser.mutation(api.applications.track, {
            country: "United States",
            visaType: "Tourist",
            applicationDate: "2026-01-01",
          });
          const apps = await asUser.query(api.applications.listByUser, {});
          expect(apps).toHaveLength(1);
          const profile = await asUser.query(api.users.getProfile, {});
          expect(profile!.country).toBe("Nigeria");
        })();
      })
    );
    const rows = await t.run(async (ctx) => await ctx.db.query("users").collect());
    expect(rows).toHaveLength(N);
  });

  it("keeps repeated same-user profile writes to one row", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "repeat-user" });
    for (let i = 0; i < 5; i++) {
      await asUser.mutation(api.users.createProfile, { country: "Ghana" });
    }
    const rows = await t.run(async (ctx) => await ctx.db.query("users").collect());
    expect(rows).toHaveLength(1);
    expect(rows[0].country).toBe("Ghana");
  });
});
