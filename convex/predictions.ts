import { action } from "./_generated/server";
import { v } from "convex/values";
import { cleanAIText } from "./studio";

const OPENAI_API = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

export const predictWaitTime = action({
  args: {
    country: v.string(),
    visaType: v.string(),
    historicalData: v.array(
      v.object({
        waitDays: v.number(),
        dateReported: v.string(),
        source: v.string(),
      }),
    ),
  },
  returns: v.object({
    predictedDays: v.number(),
    confidence: v.string(),
    trend: v.string(),
    reasoning: v.string(),
  }),
  handler: async (_ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not set");

    const dataSummary = args.historicalData
      .map((d) => `${d.dateReported}: ${d.waitDays} days (${d.source})`)
      .join("\n");

    const prompt = `Predict the visa processing wait time for ${args.visaType} visa in ${args.country}.

Historical data points:
${dataSummary || "No historical data available."}

Respond with JSON only: { "predictedDays": number, "confidence": "low"|"medium"|"high", "trend": "increasing"|"decreasing"|"stable", "reasoning": "brief explanation" }`;

    const res = await fetch(`${OPENAI_API}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    if (typeof parsed.reasoning === "string") parsed.reasoning = cleanAIText(parsed.reasoning);
    return parsed;
  },
});
