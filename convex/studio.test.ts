/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";
import { describe, it, expect } from "vitest";

const modules = import.meta.glob("./**/*.ts");

describe("AI text cleanup", () => {
  it("strips markdown markers and dashes", async () => {
    const { cleanAIText } = await import("./studio");
    expect(cleanAIText("**Bold** move — really")).toBe("Bold move, really");
    expect(cleanAIText("10–20 days")).toBe("10-20 days");
    expect(cleanAIText("Visa approved ***finally***")).toBe("Visa approved finally");
  });
});

describe("SOP studio", () => {
  it("requires auth and keys to generate", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.action(api.studio.generateSOP, { country: "Canada", visaType: "Student", background: "BSc CS" })
    ).rejects.toThrow("Not authenticated");
    const asUser = t.withIdentity({ subject: "sop-user" });
    await expect(
      asUser.action(api.studio.generateSOP, { country: "Canada", visaType: "Student", background: "BSc CS" })
    ).rejects.toThrow("not set");
  });

  it("requires auth and keys for document review", async () => {
    const t = convexTest(schema, modules);
    await expect(t.action(api.studio.reviewDocument, { document: "My SOP", country: "Canada", visaType: "Student" })).rejects.toThrow("Not authenticated");
    const asUser = t.withIdentity({ subject: "rev-user" });
    await expect(asUser.action(api.studio.reviewDocument, { document: "My SOP", country: "Canada", visaType: "Student" })).rejects.toThrow("not set");
  });

  it("saves, lists, and deletes SOPs per user", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "sop-user" });
    const other = t.withIdentity({ subject: "sop-other" });
    const id = await asUser.mutation(api.studio.saveSOP, {
      country: "Canada", visaType: "Student", background: "BSc CS", draft: "My story...",
    });
    expect(id).toBeDefined();
    expect((await asUser.query(api.studio.listSOPs, {})).length).toBe(1);
    expect((await other.query(api.studio.listSOPs, {})).length).toBe(0);
    await expect(other.mutation(api.studio.deleteSOP, { id })).rejects.toThrow("Unauthorized");
    await asUser.mutation(api.studio.deleteSOP, { id });
    expect((await asUser.query(api.studio.listSOPs, {})).length).toBe(0);
  });

  it("requires auth and keys for interview questions and scoring", async () => {
    const t = convexTest(schema, modules);
    await expect(t.action(api.studio.getQuestions, { country: "United States", visaType: "F-1", count: 3 })).rejects.toThrow("Not authenticated");
    const asUser = t.withIdentity({ subject: "iv-user" });
    await expect(asUser.action(api.studio.getQuestions, { country: "United States", visaType: "F-1", count: 3 })).rejects.toThrow("not set");
    await expect(
      asUser.action(api.studio.scoreAnswer, { question: "Why?", answer: "Because.", country: "United States", visaType: "F-1" })
    ).rejects.toThrow("not set");
  });

  it("saves and lists interview sessions", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "iv-user" });
    await asUser.mutation(api.studio.saveSession, {
      country: "United States", visaType: "F-1",
      questions: ["Why this school?"], answers: ["Great labs."], scores: [82],
    });
    const sessions = await asUser.query(api.studio.listSessions, {});
    expect(sessions.length).toBe(1);
    expect(sessions[0].scores).toEqual([82]);
  });
});

describe("opportunity radar", () => {
  it("seeds once and filters by kind", async () => {
    const t = convexTest(schema, modules);
    const first = await t.mutation(api.opportunities.seedOpportunities, {});
    expect(first).toMatch("added");
    expect(await t.mutation(api.opportunities.seedOpportunities, {})).toBe("added 0 opportunities");
    const sch = await t.query(api.opportunities.list, { kind: "scholarship" });
    const jobs = await t.query(api.opportunities.list, { kind: "job" });
    expect(sch.length).toBeGreaterThan(0);
    expect(jobs.length).toBeGreaterThan(0);
    expect(await t.query(api.opportunities.list, { country: "Japan" })).toHaveLength(1);
  });

  it("saves deadline reminders and guards refresh", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.opportunities.seedOpportunities, {});
    await expect(t.mutation(api.opportunities.remindMe, { title: "Chevening", deadline: "2026-11-07" })).rejects.toThrow("Not authenticated");
    const asUser = t.withIdentity({ subject: "opp-user" });
    await asUser.mutation(api.opportunities.remindMe, { title: "Chevening", deadline: "2026-11-07" });
    const alerts = await asUser.query(api.alerts.listByUser, {});
    expect(alerts.some((a: any) => a.type === "deadline")).toBe(true);
    await expect(asUser.action(api.opportunities.refreshOne, { id: (await t.query(api.opportunities.list, {}))[0]._id, url: "https://example.com" })).rejects.toThrow("not set");
  });
});
