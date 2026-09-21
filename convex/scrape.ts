import { action } from "./_generated/server";
import { v } from "convex/values";

const FIRECRAWL_API = "https://api.firecrawl.dev/v2";

// Resolve a scraped URL to a country we display so the value lands on a real card.
const URL_COUNTRY: Record<string, { country: string; visaType: string }> = {
  "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/wait-times.html": { country: "United States", visaType: "Tourist" },
  "https://www.gov.uk/check-uk-visa": { country: "United Kingdom", visaType: "Tourist" },
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html": { country: "Canada", visaType: "Tourist" },
};

// Scrape a single embassy page and extract wait time data
async function scrapeEmbassy(url: string, apiKey: string) {
  const res = await fetch(`${FIRECRAWL_API}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
    }),
  });

  if (!res.ok) throw new Error(`Firecrawl error: ${res.status}`);
  const data = await res.json();
  if (data.success === false) throw new Error(`Firecrawl: ${data.error ?? "scrape failed"}`);
  return typeof data.data?.markdown === "string" ? data.data.markdown : "";
}

// Parse wait time from scraped markdown content
function parseWaitDays(content: string): number | null {
  const patterns = [
    /(\d+)\s*(?:business\s*)?days?\s*(?:to\s*(?:process|receive|get))/i,
    /processing\s*(?:time|takes?)\s*[:\-]?\s*(\d+)\s*days?/i,
    /wait\s*(?:time|period)\s*[:\-]?\s*(\d+)\s*days?/i,
    /approximately\s*(\d+)\s*days?/i,
    /(\d+)\s*(?:to|–|-)\s*(\d+)\s*days?/i,
  ];

  for (const p of patterns) {
    const m = content.match(p);
    if (m) {
      if (m[2]) return Math.round((parseInt(m[1]) + parseInt(m[2])) / 2);
      return parseInt(m[1]);
    }
  }
  return null;
}

export const scrapeVisaTimelines = action({
  args: { urls: v.array(v.string()) },
  handler: async (_ctx, args) => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY not set");

    const results: { url: string; country?: string; visaType?: string; waitDays: number | null; content: string }[] = [];

    for (const url of args.urls) {
      try {
        const content = await scrapeEmbassy(url, apiKey);
        const waitDays = parseWaitDays(content);
        results.push({
          url,
          ...(URL_COUNTRY[url] ?? {}),
          waitDays,
          content: content.slice(0, 500),
        });
      } catch (e) {
        results.push({ url, waitDays: null, content: `Error: ${e}` });
      }
    }

    return results;
  },
});
