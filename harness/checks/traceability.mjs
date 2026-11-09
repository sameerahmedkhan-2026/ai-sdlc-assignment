import { readFile, writeFile } from "node:fs/promises";

const specPath = "specs/001-smart-todo-task-manager/spec.md";
const tasksPath = "specs/001-smart-todo-task-manager/tasks.md";
const [specification, tasks] = await Promise.all([readFile(specPath, "utf8"), readFile(tasksPath, "utf8")]);
const requirements = [...new Set([...specification.matchAll(/\b(?:FR|NFR|SC)-\d{3}\b/g)].map((match) => match[0]))].sort();
const taskLines = tasks.split("\n");
const taskIds = new Set([...tasks.matchAll(/^- \[[Xx ]\] (T\d{3})\b/gm)].map((match) => match[1]));
const mappingSection = tasks.split("## Traceability Summary")[1] ?? "";
const mappingLines = mappingSection.split("\n").filter((line) => line.startsWith("- **"));
const mappings = new Map(requirements.map((id) => [id, new Set()]));
const testMappings = new Map(requirements.map((id) => [id, new Set()]));
const invalidTaskReferences = [];

function expandRange(prefix, first, last) {
  return Array.from({ length: last - first + 1 }, (_, index) => `${prefix}-${String(first + index).padStart(3, "0")}`);
}

for (const line of mappingLines) {
  const referencedRequirements = [...line.matchAll(/\b(FR|NFR|SC)-(\d{3})(?:[–-](\d{3}))?\b/g)].flatMap(([, prefix, first, last]) =>
    last ? expandRange(prefix, Number(first), Number(last)) : [`${prefix}-${first}`]
  );
  const referencedTasks = [...line.matchAll(/\bT(\d{3})(?:[–-](\d{3}))?\b/g)].flatMap(([, first, last]) =>
    last ? Array.from({ length: Number(last) - Number(first) + 1 }, (_, index) => `T${String(Number(first) + index).padStart(3, "0")}`) : [`T${first}`]
  );
  for (const taskId of referencedTasks) {
    if (!taskIds.has(taskId)) invalidTaskReferences.push(`${taskId} in: ${line}`);
  }
  for (const requirement of referencedRequirements) {
    if (!mappings.has(requirement)) continue;
    for (const taskId of referencedTasks) {
      mappings.get(requirement).add(taskId);
      const taskLine = taskLines.find((candidate) => candidate.includes(` ${taskId} `)) ?? "";
      if (/\b(test|tests|harness|check|acceptance|performance|traceability)\b/i.test(taskLine)) testMappings.get(requirement).add(taskId);
    }
  }
}

const missingRequirements = requirements.filter((requirement) => mappings.get(requirement).size === 0);
const missingTestCoverage = requirements.filter((requirement) => testMappings.get(requirement).size === 0);
const report = [
  "# Traceability Report",
  "",
  `Requirements discovered: ${requirements.length}`,
  `Task IDs discovered: ${taskIds.size}`,
  "",
  "| Requirement | Task references | Automated test/check references | Status |",
  "|---|---|---|---|",
  ...requirements.map((requirement) => {
    const taskReferences = [...mappings.get(requirement)].sort().join(", ") || "none";
    const testReferences = [...testMappings.get(requirement)].sort().join(", ") || "none";
    return `| ${requirement} | ${taskReferences} | ${testReferences} | ${testReferences !== "none" ? "PASS" : "FAIL"} |`;
  }),
  "",
  `Invalid task references: ${invalidTaskReferences.length}`,
  ...invalidTaskReferences.map((reference) => `- ${reference}`),
  `Missing requirement mappings: ${missingRequirements.length}`,
  ...missingRequirements.map((requirement) => `- ${requirement}`),
  `Missing automated test/check coverage: ${missingTestCoverage.length}`,
  ...missingTestCoverage.map((requirement) => `- ${requirement}`)
].join("\n");
await writeFile("harness/traceability.md", `${report}\n`, "utf8");
console.log(report);
if (missingRequirements.length || invalidTaskReferences.length || missingTestCoverage.length) process.exitCode = 1;
