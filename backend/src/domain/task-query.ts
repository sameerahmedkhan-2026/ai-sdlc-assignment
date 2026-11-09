import type { Priority } from "@smart-todo/contracts";
import type { StoredTask } from "../persistence/persistence-types.js";
const rank: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
export function queryTasks(tasks: StoredTask[], tags: string[] = [], sort = false): StoredTask[] {
  const wanted = new Set(tags);
  const filtered = tasks.filter((task) => [...wanted].every((tag) => task.tags.includes(tag)));
  return filtered.sort((a, b) => sort ? rank[a.priority] - rank[b.priority] || a.creationOrder - b.creationOrder : a.creationOrder - b.creationOrder);
}
