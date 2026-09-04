import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  visaTimelines: defineTable({
    country: v.string(),
    visaType: v.string(),
    waitDays: v.number(),
    dateReported: v.string(),
    source: v.string(),
  })
    .index("by_country", ["country"])
    .index("by_visa_type", ["visaType"]),

  visaApplications: defineTable({
    country: v.string(),
    visaType: v.string(),
    applicationDate: v.string(),
    status: v.string(),
    estimatedWait: v.number(),
    userId: v.string(),
  }).index("by_user", ["userId"]),

  alerts: defineTable({
    userId: v.string(),
    type: v.string(),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.string(),
  }).index("by_user", ["userId"]),

  users: defineTable({
    userId: v.optional(v.string()),
    email: v.string(),
    country: v.optional(v.string()),
    name: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"]),

  watchlist: defineTable({
    userId: v.string(),
    country: v.string(),
    visaType: v.string(),
  }).index("by_user", ["userId"]),

  feedSources: defineTable({
    url: v.string(),
    label: v.string(),
    country: v.optional(v.string()),
    visaType: v.optional(v.string()),
    active: v.boolean(),
  }).index("by_active", ["active"]),

  scrapedPages: defineTable({
    url: v.string(),
    title: v.optional(v.string()),
    markdown: v.string(),
    source: v.string(),
    scrapedAt: v.string(),
  }).index("by_url", ["url"]),

  emails: defineTable({
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
  })
    .index("by_inbox", ["inboxId"])
    .index("by_thread", ["threadId"])
    .index("by_message", ["messageId"]),
});
