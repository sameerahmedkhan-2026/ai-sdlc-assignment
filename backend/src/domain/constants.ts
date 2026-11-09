import { PRIORITIES, STATUSES, type Priority, type Status } from "@smart-todo/contracts";

export { PRIORITIES, STATUSES };
export type { Priority, Status };
export const transitions: Record<Status, readonly Status[]> = {
  "To Do": ["In Progress"],
  "In Progress": ["Done", "Cancelled"],
  Done: [],
  Cancelled: []
};
export const editableFields = ["title", "description", "tags", "priority", "status"] as const;
export const createFields = ["title", "description", "tags", "priority"] as const;
