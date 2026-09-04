import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Each source resolves to a country + visa type we actually display, so the
// scraped value lands on a real country card instead of "Unknown".
const SOURCES: { url: string; country: string; visaType: string }[] = [
  {
    url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/wait-times.html",
    country: "United States",
    visaType: "Tourist",
  },
  {
    url: "https://www.gov.uk/check-uk-visa",
    country: "United Kingdom",
    visaType: "Tourist",
  },
  {
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html",
    country: "Canada",
    visaType: "Tourist",
  },
];

const FIRECRAWL_API = "https://api.firecrawl.dev/v2";

async function scrapePage(url: string, apiKey: string) {
  const res = await fetch(`${FIRECRAWL_API}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
  });
  if (!res.ok) throw new Error(`Firecrawl ${res.status}`);
  return (await res.json()).data?.markdown ?? "";
}

function extractWaitDays(content: string): number | null {
  const patterns = [
    /(\d+)\s*(?:business\s*)?days?\s*(?:to\s*(?:process|receive|get))/i,
    /processing\s*(?:time|takes?)\s*[:\-]?\s*(\d+)\s*days?/i,
    /wait\s*(?:time|period)\s*[:\-]?\s*(\d+)\s*days?/i,
  ];
  for (const p of patterns) {
    const m = content.match(p);
    if (m) return parseInt(m[1]);
  }
  return null;
}

export const runScrape = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) return;

    for (const source of SOURCES) {
      try {
        const content = await scrapePage(source.url, apiKey);
        const waitDays = extractWaitDays(content);
        if (waitDays) {
          await ctx.runMutation(internal.cronActions.insertResult, {
            country: source.country,
            visaType: source.visaType,
            waitDays,
            sourceUrl: source.url,
          });
        }
      } catch {
        // skip failed scrapes silently
      }
    }
  },
});

export const insertResult = internalMutation({
  args: {
    country: v.string(),
    visaType: v.string(),
    waitDays: v.number(),
    sourceUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("visaTimelines", {
      country: args.country,
      visaType: args.visaType,
      waitDays: args.waitDays,
      source: `embassy:${args.sourceUrl}`,
      dateReported: new Date().toISOString(),
    });
  },
});
