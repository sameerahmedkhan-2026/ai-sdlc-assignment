import request from "supertest";
import { describe, expect, it } from "vitest";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../../src/app.js";

async function app() { return createApp(join(await mkdtemp(join(tmpdir(), "todo-")), "tasks.json")); }

describe("task API", () => {
  it("creates and retrieves a task with defaults", async () => {
    const api = request(await app());
    const created = await api.post("/api/tasks").send({ title: "  Review  " }).expect(201);
    expect(created.body).toMatchObject({ title: "Review", description: "", tags: [], priority: "Medium", status: "To Do" });
    await api.get(`/api/tasks/${created.body.id}`).expect(200);
  });
  it("rejects invalid create input and client status", async () => {
    const api = request(await app());
    await api.post("/api/tasks").send({ title: "x", status: "Done" }).expect(400);
    await api.post("/api/tasks").send({ title: " " }).expect(400);
    await api.post("/api/tasks").send({ title: "x", priority: "Urgent" }).expect(400);
  });
  it("supports query, update, transition and delete", async () => {
    const api = request(await app());
    const one = (await api.post("/api/tasks").send({ title: "one", tags: ["a"], priority: "Low" })).body;
    const two = (await api.post("/api/tasks").send({ title: "two", tags: ["a", "b"], priority: "High" })).body;
    expect((await api.get("/api/tasks?tags=a&sort=priority")).body.map((task: { id: string }) => task.id)).toEqual([two.id, one.id]);
    await api.patch(`/api/tasks/${one.id}`).send({ status: "In Progress" }).expect(200);
    await api.patch(`/api/tasks/${one.id}`).send({ status: "Done" }).expect(200);
    await api.delete(`/api/tasks/${two.id}`).expect(204);
    await api.get(`/api/tasks/${two.id}`).expect(404);
  });
  it("distinguishes malformed and unknown IDs", async () => {
    const api = request(await app());
    await api.get("/api/tasks/no").expect(400);
    await api.get("/api/tasks/12345678").expect(404);
  });
  it("supports PUT replacement and PATCH retention", async () => {
    const api = request(await app());
    const created = (await api.post("/api/tasks").send({ title: "before", description: "old", tags: ["old"], priority: "Low" })).body;
    const replaced = await api.put(`/api/tasks/${created.id}`).send({
      title: "after",
      description: "new",
      tags: ["new"],
      priority: "High",
      status: "To Do"
    }).expect(200);
    expect(replaced.body).toMatchObject({ title: "after", description: "new", tags: ["new"], priority: "High", status: "To Do" });
    const patched = await api.patch(`/api/tasks/${created.id}`).send({ title: "patched" }).expect(200);
    expect(patched.body).toMatchObject({ title: "patched", description: "new", tags: ["new"], priority: "High" });
  });
  it("rejects malformed bodies, unknown fields, unsupported queries, and invalid content types", async () => {
    const api = request(await app());
    await api.post("/api/tasks").set("Content-Type", "text/plain").send("title=x").expect(400);
    await api.post("/api/tasks").send({ title: "x", unexpected: true }).expect(400);
    await api.post("/api/tasks").set("Content-Type", "application/json").send('{"title":').expect(400);
    await api.get("/api/tasks?unknown=value").expect(400);
    await api.get("/api/tasks?tags=").expect(400);
    await api.get("/api/tasks?sort=createdAt").expect(400);
  });
  it("accepts repeated compatible query parameters and rejects conflicting sort values", async () => {
    const api = request(await app());
    await api.post("/api/tasks").send({ title: "query", tags: ["one", "two"] }).expect(201);
    expect((await api.get("/api/tasks?tags=one&tags=two&tags=one")).body).toHaveLength(1);
    await api.get("/api/tasks?sort=priority&sort=title").expect(400);
  });
  it("allows same-status updates and keeps terminal statuses terminal", async () => {
    const api = request(await app());
    const created = (await api.post("/api/tasks").send({ title: "lifecycle" })).body;
    await api.patch(`/api/tasks/${created.id}`).send({ status: "To Do" }).expect(200);
    await api.patch(`/api/tasks/${created.id}`).send({ status: "In Progress" }).expect(200);
    await api.patch(`/api/tasks/${created.id}`).send({ status: "Done" }).expect(200);
    await api.patch(`/api/tasks/${created.id}`).send({ status: "Done" }).expect(200);
    const rejected = await api.patch(`/api/tasks/${created.id}`).send({ status: "Cancelled" }).expect(409);
    expect(rejected.body.error).toMatchObject({ code: "INVALID_STATUS_TRANSITION" });
  });
});
