import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:http";
import { createApp } from "../../backend/src/app.js";

const temporaryDirectory = await mkdtemp(join(tmpdir(), "smart-todo-acceptance-"));
const dataPath = join(temporaryDirectory, "tasks.json");
let server;
let baseUrl;

async function startServer() {
  const app = createApp(dataPath);
  server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;
}

async function stopServer() {
  if (!server) return;
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  server = undefined;
}

async function call(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options
  });
  const text = await response.text();
  return { response, body: text ? JSON.parse(text) : undefined };
}

const scenarios = [];
function scenario(name, check) {
  scenarios.push({ name, check });
}

scenario("create assigns To Do and persists fields", async () => {
  const result = await call("/tasks", { method: "POST", body: JSON.stringify({ title: "Acceptance task", tags: ["work"], priority: "Low" }) });
  if (result.response.status !== 201 || result.body.status !== "To Do" || result.body.tags[0] !== "work") throw new Error("creation contract failed");
  return result.body.id;
});

scenario("creation rejects a supplied status", async () => {
  const result = await call("/tasks", { method: "POST", body: JSON.stringify({ title: "Invalid", status: "Done" }) });
  if (result.response.status !== 400) throw new Error(`expected 400, got ${result.response.status}`);
});

scenario("retrieve and list return the created task", async (state) => {
  const retrieved = await call(`/tasks/${state.id}`);
  const listed = await call("/tasks");
  if (retrieved.response.status !== 200 || retrieved.body.id !== state.id || !listed.body.some((task) => task.id === state.id)) throw new Error("retrieve/list contract failed");
});

scenario("filter and priority sort return deterministic results", async (state) => {
  const second = await call("/tasks", { method: "POST", body: JSON.stringify({ title: "Higher priority", tags: ["work", "urgent"], priority: "High" }) });
  const result = await call("/tasks?tags=work&sort=priority");
  if (result.response.status !== 200 || result.body[0].id !== second.body.id || !result.body.some((task) => task.id === state.id)) throw new Error("filter/sort contract failed");
});

scenario("update details and valid status transition", async (state) => {
  const updated = await call(`/tasks/${state.id}`, { method: "PATCH", body: JSON.stringify({ description: "Updated", status: "In Progress" }) });
  if (updated.response.status !== 200 || updated.body.description !== "Updated" || updated.body.status !== "In Progress") throw new Error("update contract failed");
});

scenario("reject invalid status transition without changing data", async (state) => {
  const rejected = await call(`/tasks/${state.id}`, { method: "PATCH", body: JSON.stringify({ status: "To Do" }) });
  const current = await call(`/tasks/${state.id}`);
  if (rejected.response.status !== 409 || current.body.status !== "In Progress") throw new Error("transition rejection contract failed");
});

scenario("delete removes the task", async (state) => {
  const deleted = await call(`/tasks/${state.id}`, { method: "DELETE", headers: {} });
  const retrieved = await call(`/tasks/${state.id}`);
  if (deleted.response.status !== 204 || retrieved.response.status !== 404) throw new Error("delete contract failed");
});

scenario("successful writes survive application restart", async () => {
  const created = await call("/tasks", { method: "POST", body: JSON.stringify({ title: "Restarted task" }) });
  await stopServer();
  await startServer();
  const retrieved = await call(`/tasks/${created.body.id}`);
  if (retrieved.response.status !== 200 || retrieved.body.title !== "Restarted task") throw new Error("restart persistence failed");
});

try {
  await startServer();
  const state = {};
  for (const { name, check } of scenarios) {
    const result = await check(state);
    if (typeof result === "string") state.id = result;
    console.log(`PASS ${name}`);
  }
} catch (error) {
  console.error(`FAIL ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await stopServer();
  await rm(temporaryDirectory, { recursive: true, force: true });
}
