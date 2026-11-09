import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JsonTaskRepository } from "../../src/persistence/json-task-repository.js";
import { createApp } from "../../src/app.js";
import request from "supertest";
describe("JSON persistence", () => {
  it("persists tasks across repository instances", async () => {
    const path = join(await mkdtemp(join(tmpdir(), "todo-")), "tasks.json");
    const first = new JsonTaskRepository(path);
    const task = await first.create({ title: "persist", description: "", tags: [], priority: "Medium", status: "To Do" });
    const second = new JsonTaskRepository(path);
    expect((await second.find(task.id))?.title).toBe("persist");
    expect(JSON.parse(await readFile(path, "utf8")).version).toBe(1);
  });
  it("rejects malformed existing data without overwriting it", async () => {
    const path = join(await mkdtemp(join(tmpdir(), "todo-")), "tasks.json");
    await writeFile(path, "{not-json", "utf8");
    const response = await request(createApp(path)).get("/api/tasks");
    expect(response.status).toBe(500);
    expect(response.body.error).toEqual({ code: "PERSISTENCE_ERROR", message: "Task storage is unavailable" });
    expect(await readFile(path, "utf8")).toBe("{not-json");
  });
  it("fails repository initialization for malformed existing data", async () => {
    const path = join(await mkdtemp(join(tmpdir(), "todo-")), "tasks.json");
    await writeFile(path, "{not-json", "utf8");
    await expect(new JsonTaskRepository(path).initialize()).rejects.toMatchObject({ code: "PERSISTENCE_ERROR" });
  });
});
