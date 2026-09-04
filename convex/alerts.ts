import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("alerts")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .order("desc")
      .take(20);
  },
});

export const markRead = mutation({
  args: { id: v.id("alerts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const alert = await ctx.db.get(args.id);
    if (!alert || alert.userId !== userId as string) throw new Error("Unauthorized");
    await ctx.db.patch(args.id, { read: true });
  },
});

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .collect();
    for (const alert of alerts) {
      if (!alert.read) await ctx.db.patch(alert._id, { read: true });
    }
  },
});

export const create = mutation({
  args: {
    type: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("alerts", {
      ...args,
      userId: userId as string,
      read: false,
      createdAt: new Date().toISOString(),
    });
  },
});
