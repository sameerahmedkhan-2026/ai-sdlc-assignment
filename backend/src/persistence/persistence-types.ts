import type { Task } from "@smart-todo/contracts";
export type StoredTask = Task & { creationOrder: number };
export interface PersistenceDocument { version: 1; nextCreationOrder: number; tasks: StoredTask[]; }
