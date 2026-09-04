import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const track = mutation({
  args: {
    country: v.string(),
    visaType: v.string(),
    applicationDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("visaApplications", {
      ...args,
      status: "pending",
      estimatedWait: 0,
      userId: userId as string,
    });
  },
});

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("visaApplications")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .collect();
  },
});

export const getAppWaits = query({
  args: { pairs: v.array(v.object({ country: v.string(), visaType: v.string() })) },
  returns: v.array(v.object({ country: v.string(), visaType: v.string(), waitDays: v.number() })),
  handler: async (ctx, args) => {
    const out: { country: string; visaType: string; waitDays: number }[] = [];
    for (const p of args.pairs.slice(0, 20)) {
      const rows = await ctx.db
        .query("visaTimelines")
        .withIndex("by_country", (q) => q.eq("country", p.country))
        .take(50);
      const latest = rows
        .filter((r) => r.visaType === p.visaType)
        .sort((a, b) => b.dateReported.localeCompare(a.dateReported))[0];
      if (latest) out.push({ country: p.country, visaType: p.visaType, waitDays: latest.waitDays });
    }
    return out;
  },
});

export const updateStatus = mutation({
  args: { id: v.id("visaApplications"), status: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const app = await ctx.db.get(args.id);
    if (!app || app.userId !== userId as string) throw new Error("Unauthorized");
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("visaApplications") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const app = await ctx.db.get(args.id);
    if (!app || app.userId !== userId as string) throw new Error("Unauthorized");
    await ctx.db.delete(args.id);
  },
});
