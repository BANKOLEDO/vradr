import { action, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const emailValidator = v.object({
  _id: v.id("emails"),
  _creationTime: v.number(),
  inboxId: v.string(),
  threadId: v.string(),
  messageId: v.string(),
  direction: v.union(v.literal("in"), v.literal("out")),
  from: v.string(),
  to: v.array(v.string()),
  subject: v.optional(v.string()),
  text: v.optional(v.string()),
  read: v.boolean(),
  receivedAt: v.string(),
});

// Latest messages, optionally one thread.
export const listMessages = query({
  args: { limit: v.number(), threadId: v.optional(v.string()) },
  returns: v.array(emailValidator),
  handler: async (ctx, args) => {
    if (args.threadId) {
      return await ctx.db
        .query("emails")
        .withIndex("by_thread", (q) => q.eq("threadId", args.threadId as string))
        .order("desc")
        .take(Math.min(args.limit, 50));
    }
    return await ctx.db.query("emails").order("desc").take(Math.min(args.limit, 50));
  },
});

// Idempotent on messageId.
export const storeInbound = internalMutation({
  args: {
    inboxId: v.string(),
    threadId: v.string(),
    messageId: v.string(),
    from: v.string(),
    to: v.array(v.string()),
    subject: v.optional(v.string()),
    text: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const dupe = await ctx.db
      .query("emails")
      .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
      .unique();
    if (dupe) return null;
    await ctx.db.insert("emails", { ...args, direction: "in", read: false, receivedAt: new Date().toISOString() });
    return null;
  },
});

export const storeOutbound = internalMutation({
  args: {
    inboxId: v.string(),
    threadId: v.string(),
    messageId: v.string(),
    to: v.array(v.string()),
    subject: v.optional(v.string()),
    text: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("emails", {
      ...args,
      direction: "out",
      from: args.inboxId,
      read: true,
      receivedAt: new Date().toISOString(),
    });
    return null;
  },
});

// Needs AGENTMAIL_API_KEY + AGENTMAIL_INBOX_ID.
export const sendEmail = action({
  args: { to: v.string(), subject: v.string(), text: v.string() },
  returns: v.object({ messageId: v.string(), threadId: v.string() }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const apiKey = process.env.AGENTMAIL_API_KEY;
    const inboxId = process.env.AGENTMAIL_INBOX_ID;
    if (!apiKey || !inboxId) throw new Error("AGENTMAIL_API_KEY / AGENTMAIL_INBOX_ID not set");
    const base = process.env.AGENTMAIL_API_URL ?? "https://api.agentmail.to";

    const res = await fetch(`${base}/v0/inboxes/${encodeURIComponent(inboxId)}/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ to: [args.to], subject: args.subject, text: args.text }),
    });
    if (!res.ok) throw new Error(`AgentMail ${res.status}`);
    const data = await res.json();

    await ctx.runMutation(internal.inbox.storeOutbound, {
      inboxId,
      threadId: data.thread_id,
      messageId: data.message_id,
      to: [args.to],
      subject: args.subject,
      text: args.text,
    });
    return { messageId: data.message_id, threadId: data.thread_id };
  },
});

export const markRead = mutation({
  args: { id: v.id("emails") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    await ctx.db.patch(args.id, { read: true });
    return null;
  },
});

export const markAllRead = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const unread = await ctx.db.query("emails").filter((q) => q.eq(q.field("read"), false)).take(100);
    for (const m of unread) await ctx.db.patch(m._id, { read: true });
    return unread.length;
  },
});
