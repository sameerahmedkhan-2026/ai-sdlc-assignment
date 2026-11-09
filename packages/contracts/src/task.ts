export const PRIORITIES = ["High", "Medium", "Low"] as const;
export type Priority = (typeof PRIORITIES)[number];
export const STATUSES = ["To Do", "In Progress", "Done", "Cancelled"] as const;
export type Status = (typeof STATUSES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  priority: Priority;
  status: Status;
  createdAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  tags?: string[];
  priority?: Priority;
}

export type TaskUpdate = Partial<TaskInput> & { status?: Status };
