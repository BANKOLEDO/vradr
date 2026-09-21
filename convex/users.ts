import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

type CtxLike = { db: QueryCtx["db"] };

// subject is "userId|sessionId"; the row id is before "|".
function subjectRowId(subject: string): string {
  return subject.split("|")[0];
}

async function resolveProfile(ctx: CtxLike, userId: string, email?: string) {
  const rowId = subjectRowId(userId);
  try {
    const byId = await ctx.db.get(rowId as Id<"users">);
    if (byId) return byId;
  } catch {
    // Fall through to indexes.
  }
  for (const key of [userId, rowId]) {
    const byUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", key))
      .unique();
    if (byUser) return byUser;
  }
  if (email) {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
  }
  return null;
}

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await resolveProfile(ctx, identity.subject, identity.email ?? "");
  },
});

export const getIdentityEmail = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity?.email ?? null;
  },
});

export const createProfile = mutation({
  args: {
    country: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Not authenticated");

    const email = identity?.email ?? "";

    // Upsert; never overwrite email with "".
    const existing = await resolveProfile(ctx, userId, email);
    if (existing) {
      await ctx.db.patch(existing._id, {
        userId: subjectRowId(userId),
        ...(email ? { email } : {}),
        country: args.country,
        ...(args.name ? { name: args.name } : {}),
      });
      return existing._id;
    }

    const id = await ctx.db.insert("users", {
      userId: subjectRowId(userId),
      email,
      country: args.country,
      name: args.name,
      createdAt: new Date().toISOString(),
    });
    if (email) {
      await ctx.scheduler.runAfter(0, internal.notify.welcomeUser, {
        email,
        name: args.name,
        country: args.country,
      });
    }
    return id;
  },
});

export const getMyCountry = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const profile = await resolveProfile(ctx, identity.subject, identity.email ?? "");
    return profile?.country ?? null;
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Not authenticated");

    const profile = await resolveProfile(ctx, userId, identity?.email ?? "");
    if (!profile) {
      // No row yet: create it instead of failing.
      return await ctx.db.insert("users", {
        userId: subjectRowId(userId),
        email: identity?.email ?? "",
        ...(args.name !== undefined ? { name: args.name } : {}),
        ...(args.country !== undefined ? { country: args.country } : {}),
        createdAt: new Date().toISOString(),
      });
    }

    await ctx.db.patch(profile._id, {
      userId: subjectRowId(userId),
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.country !== undefined ? { country: args.country } : {}),
    });
    return profile._id;
  },
});

// Export a portable copy of the user's data.
export const exportMyData = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Not authenticated");

    const profile = await resolveProfile(ctx, userId, identity?.email ?? "");

    const applications = await ctx.db
      .query("visaApplications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const watchlist = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return {
      exportedAt: new Date().toISOString(),
      profile: profile
        ? { email: profile.email, name: profile.name, country: profile.country, createdAt: profile.createdAt }
        : null,
      applications,
      alerts,
      watchlist,
    };
  },
});

// Erase the account and all user data.
export const deleteAllMyData = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Not authenticated");

    const applications = await ctx.db
      .query("visaApplications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const app of applications) await ctx.db.delete(app._id);

    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const alert of alerts) await ctx.db.delete(alert._id);

    const watchlist = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const item of watchlist) await ctx.db.delete(item._id);

    const profile = await resolveProfile(ctx, userId, identity?.email ?? "");
    if (profile) await ctx.db.delete(profile._id);

    return { deleted: { applications: applications.length, alerts: alerts.length, watchlist: watchlist.length, profile: profile ? 1 : 0 } };
  },
});
