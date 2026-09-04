/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import schema from "./schema";
import { api, internal } from "./_generated/api";
import { describe, it, expect } from "vitest";

const modules = import.meta.glob("./**/*.ts");

describe("AgentMail inbox", () => {
  it("stores inbound mail once even on webhook retry", async () => {
    const t = convexTest(schema, modules);
    const msg = {
      inboxId: "app@agentmail.to",
      threadId: "thread-1",
      messageId: "msg-1",
      from: "user@example.com",
      to: ["app@agentmail.to"],
      subject: "Visa question",
      text: "How long for a US visa?",
    };
    await t.mutation(internal.inbox.storeInbound, msg);
    await t.mutation(internal.inbox.storeInbound, msg);
    const list = await t.query(api.inbox.listMessages, { limit: 10 });
    expect(list).toHaveLength(1);
    expect(list[0].direction).toBe("in");
    expect(list[0].read).toBe(false);
  });

  it("filters messages by thread", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(internal.inbox.storeInbound, {
      inboxId: "app@agentmail.to", threadId: "t1", messageId: "m1",
      from: "a@x.com", to: [], subject: "One", text: "hi",
    });
    await t.mutation(internal.inbox.storeInbound, {
      inboxId: "app@agentmail.to", threadId: "t2", messageId: "m2",
      from: "b@x.com", to: [], subject: "Two", text: "yo",
    });
    const thread = await t.query(api.inbox.listMessages, { limit: 10, threadId: "t1" });
    expect(thread).toHaveLength(1);
    expect(thread[0].subject).toBe("One");
  });

  it("marks all messages read", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "reader" });
    await t.mutation(internal.inbox.storeInbound, {
      inboxId: "app@agentmail.to", threadId: "t9", messageId: "m9",
      from: "a@x.com", to: [], subject: "Hey", text: "hi",
    });
    const n = await asUser.mutation(api.inbox.markAllRead, {});
    expect(n).toBe(1);
    expect((await t.query(api.inbox.listMessages, { limit: 10 }))[0].read).toBe(true);
  });

  it("refuses to send without keys and requires auth", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.action(api.inbox.sendEmail, { to: "a@x.com", subject: "Hi", text: "yo" })
    ).rejects.toThrow("Not authenticated");
    const asUser = t.withIdentity({ subject: "sender" });
    await expect(
      asUser.action(api.inbox.sendEmail, { to: "a@x.com", subject: "Hi", text: "yo" })
    ).rejects.toThrow("not set");
  });
});
