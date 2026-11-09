import { describe, expect, it } from "vitest";
import { canTransition } from "../../src/domain/transitions.js";
import { queryTasks } from "../../src/domain/task-query.js";
describe("domain rules", () => {
  it("allows only approved transitions", () => {
    expect(canTransition("To Do", "In Progress")).toBe(true);
    expect(canTransition("Done", "To Do")).toBe(false);
    expect(canTransition("Done", "Done")).toBe(true);
  });
  it("filters all tags and sorts deterministically", () => {
    const tasks = [
      { id: "a", title: "a", description: "", tags: ["x", "y"], priority: "High" as const, status: "To Do" as const, createdAt: "", creationOrder: 2 },
      { id: "b", title: "b", description: "", tags: ["x"], priority: "High" as const, status: "To Do" as const, createdAt: "", creationOrder: 1 }
    ];
    expect(queryTasks(tasks, ["x", "y"], true).map((task) => task.id)).toEqual(["a"]);
    expect(queryTasks(tasks, [], true).map((task) => task.id)).toEqual(["b", "a"]);
  });
});
