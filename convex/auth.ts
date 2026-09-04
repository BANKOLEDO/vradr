import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  callbacks: {
    // Only place that creates users rows.
    createOrUpdateUser: async (ctx: MutationCtx, args) => {
      const email = args.profile.email ?? "";
      let id: Id<"users"> | null = null;
      if (args.existingUserId) {
        const row = await ctx.db.get(args.existingUserId);
        if (row) id = row._id;
      }
      if (!id && email) {
        const byEmail = await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", email))
          .unique();
        if (byEmail) id = byEmail._id;
      }
      if (!id) {
        id = await ctx.db.insert("users", { email, createdAt: new Date().toISOString() });
      }
      const current = await ctx.db.get(id);
      const patch: { userId?: string; email?: string } = {};
      // userId stays the pure row id.
      if (current && current.userId !== id) patch.userId = id;
      if (email && current && current.email !== email) patch.email = email;
      if (Object.keys(patch).length) await ctx.db.patch(id, patch);
      return id;
    },
  },
});
