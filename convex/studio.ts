import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const OPENAI_API = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/+$/, "");

function openAIKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");
  return key;
}

export function cleanAIText(s: string): string {
  return s
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__([^_]+?)__/g, "$1")
    .replace(/(\d)\s*[–—]\s*(\d)/g, "$1-$2")
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/ {2,}/g, " ")
    .trim();
}

async function chat(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(`${OPENAI_API}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.7 }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// Draft an SOP from the applicant's own details and voice.
export const generateSOP = action({
  args: {
    country: v.string(),
    visaType: v.string(),
    school: v.optional(v.string()),
    course: v.optional(v.string()),
    background: v.string(),
    name: v.optional(v.string()),
    tone: v.optional(v.string()),
    traits: v.optional(v.string()),
  },
  returns: v.object({ draft: v.string() }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const draft = await chat(
      openAIKey(),
      `Write a personal Statement of Purpose (700-900 words) for a ${args.visaType} visa to ${args.country}.\n` +
        `Applicant: ${args.name || "the applicant"}\nBackground: ${args.background}\n` +
        (args.school ? `Target school or employer: ${args.school}\n` : "") +
        (args.course ? `Target course or role: ${args.course}\n` : "") +
        (args.tone ? `Voice: write in a ${args.tone} tone.\n` : "") +
        (args.traits ? `Defining traits and wins to weave in: ${args.traits}\n` : "") +
        `Cover: background, why this country and school/employer, funding plan, ties to home country, future plans. ` +
        `Use only concrete details from above. Never invent awards, jobs, or scores. ` +
        `Banned openers and phrases: "since I was a child", "passionate", "dream come true", "ever since I can remember", "prestigious". ` +
        `Sound like this specific person, not a template. Plain paragraphs, no headings.`
    );
    return { draft: cleanAIText(draft) };
  },
});

export const saveSOP = mutation({
  args: {
    country: v.string(),
    visaType: v.string(),
    school: v.optional(v.string()),
    course: v.optional(v.string()),
    background: v.string(),
    draft: v.string(),
  },
  returns: v.id("sops"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("sops", { ...args, userId: userId as string, updatedAt: new Date().toISOString() });
  },
});

export const listSOPs = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("sops"),
      _creationTime: v.number(),
      country: v.string(),
      visaType: v.string(),
      school: v.optional(v.string()),
      course: v.optional(v.string()),
      draft: v.string(),
      updatedAt: v.string(),
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const rows = await ctx.db
      .query("sops")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .order("desc")
      .take(20);
    return rows.map((r) => ({
      _id: r._id,
      _creationTime: r._creationTime,
      country: r.country,
      visaType: r.visaType,
      school: r.school,
      course: r.course,
      draft: r.draft,
      updatedAt: r.updatedAt,
    }));
  },
});

// Score one pasted document 0-100 with prioritised fixes. Nothing is stored.
export const reviewDocument = action({
  args: { document: v.string(), country: v.string(), visaType: v.string() },
  returns: v.object({ score: v.number(), verdict: v.string(), fixes: v.array(v.string()) }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const raw = await chat(
      openAIKey(),
      `You are a strict visa officer reviewing a document for a ${args.visaType} visa to ${args.country}.\n` +
        `Document:\n${args.document.slice(0, 4000)}\n` +
        `Reply in JSON only: { "score": number 0-100, "verdict": "one sentence", "fixes": ["most important fix", "...up to 4"] }`
    );
    try {
      const parsed = JSON.parse(raw);
      return { score: parsed.score ?? 0, verdict: cleanAIText(parsed.verdict ?? ""), fixes: (parsed.fixes ?? []).map(cleanAIText) };
    } catch {
      return { score: 0, verdict: "Could not review. Try again.", fixes: [] };
    }
  },
});

export const deleteSOP = mutation({
  args: { id: v.id("sops") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const row = await ctx.db.get(args.id);
    if (!row || row.userId !== (userId as string)) throw new Error("Unauthorized");
    await ctx.db.delete(args.id);
    return null;
  },
});

// Officer-style interview questions for a country + visa type.
export const getQuestions = action({
  args: { country: v.string(), visaType: v.string(), count: v.number() },
  returns: v.object({ questions: v.array(v.string()) }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const n = Math.min(Math.max(args.count, 1), 8);
    const raw = await chat(
      openAIKey(),
      `List ${n} realistic embassy interview questions for a ${args.visaType} visa to ${args.country}, one per line, numbered. Questions only, no commentary.`
    );
    const questions = raw
      .split("\n")
      .map((l) => cleanAIText(l.replace(/^\s*\d+[.)]\s*/, "").trim()))
      .filter(Boolean)
      .slice(0, n);
    return { questions };
  },
});

// Score one answer 0-100 with a model answer.
export const scoreAnswer = action({
  args: { question: v.string(), answer: v.string(), country: v.string(), visaType: v.string() },
  returns: v.object({ score: v.number(), feedback: v.string(), model: v.string() }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const raw = await chat(
      openAIKey(),
      `You are a strict visa officer scoring a practice answer for a ${args.visaType} visa to ${args.country}.\n` +
        `Question: ${args.question}\nAnswer: ${args.answer}\n` +
        `Reply in JSON only: { "score": number 0-100, "feedback": "one sentence", "model": "strong 2-3 sentence answer" }`
    );
    try {
      const parsed = JSON.parse(raw);
      return { score: parsed.score ?? 0, feedback: cleanAIText(parsed.feedback ?? ""), model: cleanAIText(parsed.model ?? "") };
    } catch {
      return { score: 0, feedback: "Could not score. Try again.", model: "" };
    }
  },
});

export const saveSession = mutation({
  args: {
    country: v.string(),
    visaType: v.string(),
    questions: v.array(v.string()),
    answers: v.array(v.string()),
    scores: v.array(v.number()),
  },
  returns: v.id("interviewSessions"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("interviewSessions", { ...args, userId: userId as string, createdAt: new Date().toISOString() });
  },
});

export const listSessions = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("interviewSessions"),
      _creationTime: v.number(),
      country: v.string(),
      visaType: v.string(),
      questions: v.array(v.string()),
      scores: v.array(v.number()),
      createdAt: v.string(),
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const rows = await ctx.db
      .query("interviewSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId as string))
      .order("desc")
      .take(10);
    return rows.map((r) => ({
      _id: r._id,
      _creationTime: r._creationTime,
      country: r.country,
      visaType: r.visaType,
      questions: r.questions,
      scores: r.scores,
      createdAt: r.createdAt,
    }));
  },
});
