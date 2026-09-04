import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http);

// AgentMail message.received webhook.
http.route({
  path: "/agentmail/webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const secret = process.env.AGENTMAIL_WEBHOOK_SECRET;
    if (secret && req.headers.get("x-webhook-secret") !== secret) {
      return new Response("unauthorized", { status: 401 });
    }
    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return new Response("bad json", { status: 400 });
    }
    if (body?.event_type === "message.received" && body?.message) {
      const m = body.message;
      await ctx.runMutation(internal.inbox.storeInbound, {
        inboxId: body.inbox_id ?? "",
        threadId: body.thread_id ?? m.thread_id ?? m.message_id ?? "",
        messageId: m.message_id ?? body.event_id ?? "",
        from: m.from ?? "",
        to: Array.isArray(m.to) ? m.to : m.to ? [m.to] : [],
        subject: m.subject,
        text: m.text,
      });
    }
    return new Response("ok", { status: 200 });
  }),
});

export default http;
