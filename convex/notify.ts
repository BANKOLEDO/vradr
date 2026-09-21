import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";

function agentMailBase() {
  return process.env.AGENTMAIL_API_URL ?? "https://api.agentmail.to";
}

// Fire-and-forget alert email via the app inbox.
async function sendAlert(apiKey: string, inboxId: string, to: string, subject: string, text: string) {
  const res = await fetch(`${agentMailBase()}/v0/inboxes/${encodeURIComponent(inboxId)}/messages/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ to: [to], subject, text }),
  });
  if (!res.ok) throw new Error(`AgentMail ${res.status}`);
  return res.json();
}

function creds(): { apiKey: string; inboxId: string } {
  const apiKey = process.env.AGENTMAIL_API_KEY;
  const inboxId = process.env.AGENTMAIL_INBOX_ID;
  if (!apiKey || !inboxId) throw new Error("AGENTMAIL_API_KEY / AGENTMAIL_INBOX_ID not set");
  return { apiKey, inboxId };
}

export const welcomeUser = internalAction({
  args: { email: v.string(), name: v.optional(v.string()), country: v.optional(v.string()) },
  returns: v.null(),
  handler: async (_ctx, args) => {
    if (!args.email) return null;
    if (!process.env.AGENTMAIL_API_KEY || !process.env.AGENTMAIL_INBOX_ID) return null;
    const { apiKey, inboxId } = creds();
    const first = args.name?.split(" ")[0];
    await sendAlert(
      apiKey,
      inboxId,
      args.email,
      `Welcome to VRADR${args.country ? `, ${first || "traveller"}` : ""} — your visa tracking is set`,
      `Hi${first ? ` ${first}` : ""},\n\nYour account is ready${args.country ? ` and your dashboard is tuned for leaving ${args.country}` : ""}. Three things worth doing today:\n\n1. Track an application — My Apps counts down against live waits for you.\n2. Watch a country — you get an email the moment its wait moves.\n3. Open Prep — draft your SOP, rehearse the interview, check scholarships.\n\nNo embassy site refreshing required anymore.\n\n— The VRADR team`
    );
    return null;
  },
});

export const sendReminder = internalAction({
  args: { email: v.string(), title: v.string(), deadline: v.string() },
  returns: v.null(),
  handler: async (_ctx, args) => {
    if (!args.email) return null;
    if (!process.env.AGENTMAIL_API_KEY || !process.env.AGENTMAIL_INBOX_ID) return null;
    const { apiKey, inboxId } = creds();
    await sendAlert(apiKey, inboxId, args.email, `Reminder: ${args.title} closes ${args.deadline}`,
      `${args.title} closes on ${args.deadline}.\n\nOpen VRADR to review the requirements and get your documents in order before the window shuts.`);
    return null;
  },
});

export const notifyWaitUpdate = internalAction({
  args: { email: v.string(), country: v.string(), visaType: v.string(), oldWait: v.number(), newWait: v.number() },
  returns: v.null(),
  handler: async (_ctx, args) => {
    if (!args.email) return null;
    if (!process.env.AGENTMAIL_API_KEY || !process.env.AGENTMAIL_INBOX_ID) return null;
    const { apiKey, inboxId } = creds();
    const faster = args.newWait < args.oldWait;
    await sendAlert(apiKey, inboxId, args.email,
      `${faster ? "Good news" : "Heads up"}: ${args.country} ${args.visaType} is now ${args.newWait} days (was ${args.oldWait})`,
      `${faster ? "Good news." : "Heads up."} The ${args.visaType} wait for ${args.country} moved from ${args.oldWait} to ${args.newWait} days.\n\n${faster ? "Windows like this close fast. If you were waiting, this is your moment." : "If you have an application in, sit tight and watch your countdown in My Apps."}\n\n— The VRADR team`);
    return null;
  },
});

export const sendVisaAlert = action({
  args: {
    to: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  returns: v.object({ message_id: v.string(), thread_id: v.string() }),
  handler: async (_ctx, args) => {
    const { apiKey, inboxId } = creds();
    return await sendAlert(apiKey, inboxId, args.to, args.subject, args.message);
  },
});

export const sendWaitTimeUpdate = action({
  args: {
    to: v.string(),
    country: v.string(),
    visaType: v.string(),
    oldWait: v.number(),
    newWait: v.number(),
  },
  returns: v.object({ message_id: v.string(), thread_id: v.string() }),
  handler: async (_ctx, args) => {
    const { apiKey, inboxId } = creds();
    const faster = args.newWait < args.oldWait;
    const subject = `${faster ? "Good news" : "Heads up"}: ${args.country} ${args.visaType} is now ${args.newWait} days (was ${args.oldWait})`;
    const text = `${faster ? "Good news." : "Heads up."} The ${args.visaType} wait for ${args.country} moved from ${args.oldWait} to ${args.newWait} days.\n\n${faster ? "Windows like this close fast. If you were waiting, this is your moment." : "If you have an application in, sit tight and watch your countdown in My Apps."}\n\n— The VRADR team`;
    return await sendAlert(apiKey, inboxId, args.to, subject, text);
  },
});
