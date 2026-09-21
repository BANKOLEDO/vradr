import { action, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const oppValidator = v.object({
  _id: v.id("opportunities"),
  _creationTime: v.number(),
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
});

const SEED: {
  title: string; kind: "scholarship" | "job"; country: string; degree?: string;
  funding?: string; deadline?: string; url: string; requirements: string[];
}[] = [
  { title: "Chevening Scholarship", kind: "scholarship", country: "United Kingdom", degree: "Masters", funding: "Fully funded", deadline: "2026-11-07", url: "https://www.chevening.org", requirements: ["Bachelor's degree", "2+ years work experience", "Leadership record"] },
  { title: "Fulbright Foreign Student Program", kind: "scholarship", country: "United States", degree: "Masters", funding: "Fully funded", url: "https://foreign.fulbrightonline.org", requirements: ["Bachelor's degree", "Strong academics", "US embassy application"] },
  { title: "DAAD Scholarship", kind: "scholarship", country: "Germany", degree: "Masters", funding: "Monthly stipend", deadline: "2026-10-15", url: "https://www.daad.de", requirements: ["Bachelor's degree", "2 years experience (most programs)", "German or English proof"] },
  { title: "Erasmus Mundus Joint Masters", kind: "scholarship", country: "Schengen", degree: "Masters", funding: "Fully funded", url: "https://erasmus-plus.ec.europa.eu", requirements: ["Bachelor's degree", "Apply to specific consortium"] },
  { title: "MEXT Scholarship", kind: "scholarship", country: "Japan", degree: "Undergraduate", funding: "Fully funded", url: "https://www.mext.go.jp", requirements: ["Embassy recommendation route", "Age and grades criteria"] },
  { title: "Australia Awards", kind: "scholarship", country: "Australia", degree: "Masters", funding: "Fully funded", url: "https://australiaawards.gov.au", requirements: ["Partner country citizen", "Return-home agreement"] },
  { title: "Vanier Canada Graduate Scholarship", kind: "scholarship", country: "Canada", degree: "PhD", funding: "$50k/year", url: "https://vanier.gc.ca", requirements: ["Nominated by university", "Research excellence"] },
  { title: "Turkiye Burslari", kind: "scholarship", country: "Turkey", degree: "Undergraduate", funding: "Fully funded", url: "https://turkiyeburslari.gov.tr", requirements: ["Age limits per level", "Academic merit"] },
  { title: "UK Skilled Worker route", kind: "job", country: "United Kingdom", funding: "Employer sponsored", url: "https://www.gov.uk/skilled-worker-visa", requirements: ["Licensed sponsor job offer", "Salary threshold", "English B1"] },
  { title: "UK Global Talent route", kind: "job", country: "United Kingdom", funding: "Self sponsored", url: "https://www.gov.uk/global-talent", requirements: ["Endorsement (Tech Nation etc.)", "Exceptional talent or promise"] },
  { title: "US H-1B lottery", kind: "job", country: "United States", funding: "Employer sponsored", deadline: "2027-03-01", url: "https://www.uscis.gov", requirements: ["Specialty occupation offer", "March registration", "Lottery selection"] },
  { title: "Germany Opportunity Card", kind: "job", country: "Germany", funding: "Points based", url: "https://www.make-it-in-germany.com", requirements: ["Points for degree, age, language", "Blocked account funds"] },
  { title: "Registered Nurse (Green List Tier 1)", kind: "job", country: "New Zealand", funding: "Straight to residence", url: "https://www.immigration.govt.nz", requirements: ["NZ nursing registration", "Accredited employer offer", "IELTS 7 per band (typical)"] },
  { title: "ICT Security Specialist (Green List Tier 1)", kind: "job", country: "New Zealand", funding: "Straight to residence", url: "https://www.immigration.govt.nz", requirements: ["Degree + experience", "Accredited employer offer"] },
  { title: "Civil Engineer (Green List Tier 1)", kind: "job", country: "New Zealand", funding: "Straight to residence", url: "https://www.immigration.govt.nz", requirements: ["Washington Accord degree or IQA", "Engineering NZ registration path"] },
  { title: "Secondary Teacher STEM (Green List Tier 1)", kind: "job", country: "New Zealand", funding: "Straight to residence", url: "https://www.immigration.govt.nz", requirements: ["Teaching Council registration", "Accredited employer offer"] },
  { title: "Construction Trades (Green List Tier 2)", kind: "job", country: "New Zealand", funding: "Work to residence", url: "https://www.immigration.govt.nz", requirements: ["24 months NZ work first", "Median wage met"] },
  { title: "Healthcare Assistant (Green List Tier 2)", kind: "job", country: "New Zealand", funding: "Work to residence", url: "https://www.immigration.govt.nz", requirements: ["24 months NZ work first", "Accredited employer offer"] },
  { title: "Express Entry pool", kind: "job", country: "Canada", funding: "Points based", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html", requirements: ["ECA + language test", "Competitive CRS score", "Settlement funds"] },
  { title: "Skills in Demand visa", kind: "job", country: "Australia", funding: "Employer sponsored", url: "https://immi.homeaffairs.gov.au/visas/working-in-australia", requirements: ["Skills assessment", "Sponsor + salary threshold", "English test"] },
];

export const list = query({
  args: { kind: v.optional(v.union(v.literal("scholarship"), v.literal("job"))), country: v.optional(v.string()) },
  returns: v.array(oppValidator),
  handler: async (ctx, args) => {
    let rows;
    if (args.kind) {
      rows = await ctx.db.query("opportunities").withIndex("by_kind", (q) => q.eq("kind", args.kind as "scholarship" | "job")).take(50);
    } else if (args.country) {
      rows = await ctx.db.query("opportunities").withIndex("by_country", (q) => q.eq("country", args.country as string)).take(50);
    } else {
      rows = await ctx.db.query("opportunities").take(50);
    }
    return rows;
  },
});

export const seedOpportunities = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    let added = 0;
    for (const o of SEED) {
      const exists = await ctx.db.query("opportunities").filter((q) => q.eq(q.field("title"), o.title)).first();
      if (!exists) {
        await ctx.db.insert("opportunities", { ...o, source: "curated", lastChecked: new Date().toISOString() });
        added++;
      }
    }
    return `added ${added} opportunities`;
  },
});

// Recheck one listing's page with Firecrawl; stamps lastChecked.
export const refreshOne = action({
  args: { id: v.id("opportunities"), url: v.string() },
  returns: v.object({ ok: v.boolean(), status: v.optional(v.number()) }),
  handler: async (ctx, args) => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY not set");
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ url: args.url, formats: ["markdown"], onlyMainContent: true }),
    });
    await ctx.runMutation(internal.opportunities.stampChecked, { id: args.id });
    return { ok: res.ok, status: res.status };
  },
});

export const stampChecked = internalMutation({
  args: { id: v.id("opportunities") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { lastChecked: new Date().toISOString(), source: "firecrawl" });
    return null;
  },
});

// Deadline reminder: in-app alert plus email when keys are set.
export const remindMe = mutation({
  args: { title: v.string(), deadline: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.insert("alerts", {
      type: "deadline",
      message: `${args.title} deadline: ${args.deadline}`,
      userId: userId as string,
      read: false,
      createdAt: new Date().toISOString(),
    });
    const identity = await ctx.auth.getUserIdentity();
    if (identity?.email) {
      await ctx.scheduler.runAfter(0, internal.notify.sendReminder, {
        email: identity.email,
        title: args.title,
        deadline: args.deadline,
      });
    }
    return null;
  },
});
