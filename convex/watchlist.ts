import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .collect();
  },
});

export const add = mutation({
  args: { country: v.string(), visaType: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .collect();
    if (existing.some((w) => w.country === args.country && w.visaType === args.visaType)) {
      return existing.find((w) => w.country === args.country && w.visaType === args.visaType)!._id;
    }
    return await ctx.db.insert("watchlist", {
      ...args,
      userId: userId as string,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("watchlist") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId as string) throw new Error("Unauthorized");
    await ctx.db.delete(args.id);
  },
});
