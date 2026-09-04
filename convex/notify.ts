import { action } from "./_generated/server";
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
    const direction = args.newWait > args.oldWait ? "increased" : "decreased";
    const subject = `VRADR Alert: ${args.country} ${args.visaType} wait time ${direction}`;
    const text = `The processing time for ${args.visaType} visas in ${args.country} has ${direction} from ${args.oldWait} to ${args.newWait} days.\n\nTrack your visa at VRADR.`;
    return await sendAlert(apiKey, inboxId, args.to, subject, text);
  },
});
