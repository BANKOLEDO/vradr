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
    welcomed: v.optional(v.boolean()),
    createdAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"]),

  watchlist: defineTable({
    userId: v.string(),
    country: v.string(),
    visaType: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_place", ["country", "visaType"]),

  feedSources: defineTable({
    url: v.string(),
    label: v.string(),
    country: v.optional(v.string()),
    visaType: v.optional(v.string()),
    active: v.boolean(),
    userId: v.optional(v.string()),
  })
    .index("by_active", ["active"])
    .index("by_user", ["userId"]),

  scrapedPages: defineTable({
    url: v.string(),
    title: v.optional(v.string()),
    markdown: v.string(),
    hash: v.optional(v.string()),
    source: v.string(),
    scrapedAt: v.string(),
  }).index("by_url", ["url"]),

  sops: defineTable({
    userId: v.string(),
    country: v.string(),
    visaType: v.string(),
    school: v.optional(v.string()),
    course: v.optional(v.string()),
    background: v.string(),
    draft: v.string(),
    updatedAt: v.string(),
  }).index("by_user", ["userId"]),

  interviewSessions: defineTable({
    userId: v.string(),
    country: v.string(),
    visaType: v.string(),
    questions: v.array(v.string()),
    answers: v.array(v.string()),
    scores: v.array(v.number()),
    createdAt: v.string(),
  }).index("by_user", ["userId"]),

  opportunities: defineTable({
    title: v.string(),
    kind: v.union(v.literal("scholarship"), v.literal("job")),
    country: v.string(),
    degree: v.optional(v.string()),
    funding: v.optional(v.string()),
    deadline: v.optional(v.string()),
    url: v.string(),
    requirements: v.array(v.string()),
    source: v.string(),
    lastChecked: v.string(),
  })
    .index("by_country", ["country"])
    .index("by_kind", ["kind"]),
});
