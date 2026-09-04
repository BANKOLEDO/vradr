import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Scrape embassy data daily at 6 AM UTC
crons.interval("scrape-embassies", { hours: 24 }, internal.cronActions.runScrape, {});

// Firecrawl feed sources every 12 hours
crons.interval("firecrawl-feeds", { hours: 12 }, internal.feeds.runFeeds, {});

export default crons;
