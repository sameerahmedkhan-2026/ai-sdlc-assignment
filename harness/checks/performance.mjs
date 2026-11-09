import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:http";
import { createApp } from "../../backend/src/app.js";

const DATASET_SIZE = 1000;
const THRESHOLD_MS = 500;
const WARMUP_ITERATIONS = 5;
const MEASURED_ITERATIONS = 25;

const document = {
  version: 1,
  nextCreationOrder: DATASET_SIZE + 1,
  tasks: Array.from({ length: DATASET_SIZE }, (_, index) => ({
    id: `task-${String(index).padStart(4, "0")}`,
    title: `Task ${index}`,
    description: "",
    tags: index % 2 === 0 ? ["benchmark", "even"] : ["benchmark", "odd"],
    priority: ["High", "Medium", "Low"][index % 3],
    status: "To Do",
    createdAt: new Date(index * 1000).toISOString(),
    creationOrder: index + 1
  }))
};

const temporaryDirectory = await mkdtemp(join(tmpdir(), "smart-todo-performance-"));
const dataPath = join(temporaryDirectory, "tasks.json");
await writeFile(dataPath, JSON.stringify(document, null, 2), "utf8");

let server;
const originalInfo = console.info;
console.info = () => {};
try {
  const app = createApp(dataPath);
  server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}/api`;
  const existingId = "task-0000";
  const operations = {
    list: () => fetch(`${baseUrl}/tasks`),
    filter: () => fetch(`${baseUrl}/tasks?tags=even`),
    sort: () => fetch(`${baseUrl}/tasks?sort=priority`),
    create: () => fetch(`${baseUrl}/tasks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Benchmark create" }) }),
    retrieve: () => fetch(`${baseUrl}/tasks/${existingId}`),
    update: () => fetch(`${baseUrl}/tasks/${existingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Benchmark update" }) }),
    delete: async () => {
      const created = await fetch(`${baseUrl}/tasks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Benchmark delete" }) });
      const task = await created.json();
      return fetch(`${baseUrl}/tasks/${task.id}`, { method: "DELETE" });
    }
  };
  const results = [];
  for (const [name, operation] of Object.entries(operations)) {
    for (let index = 0; index < WARMUP_ITERATIONS; index += 1) {
      const response = await operation();
      if (!response.ok) throw new Error(`${name} warm-up failed with HTTP ${response.status}`);
      await response.arrayBuffer();
    }
    const samples = [];
    for (let index = 0; index < MEASURED_ITERATIONS; index += 1) {
      const started = performance.now();
      const response = await operation();
      await response.arrayBuffer();
      if (!response.ok) throw new Error(`${name} measurement failed with HTTP ${response.status}`);
      samples.push(performance.now() - started);
    }
    samples.sort((left, right) => left - right);
    const p95 = samples[Math.ceil(samples.length * 0.95) - 1];
    const passed = p95 <= THRESHOLD_MS;
    results.push({ name, samples: samples.length, p95, passed });
  }
  for (const result of results) {
    console.log(`Performance ${result.passed ? "PASS" : "FAIL"}: operation=${result.name}, dataset=${DATASET_SIZE}, samples=${result.samples}, p95=${result.p95.toFixed(2)}ms, threshold=${THRESHOLD_MS}ms`);
  }
  if (results.some((result) => !result.passed)) throw new Error("One or more operation performance thresholds failed");
} finally {
  console.info = originalInfo;
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  await rm(temporaryDirectory, { recursive: true, force: true });
}
