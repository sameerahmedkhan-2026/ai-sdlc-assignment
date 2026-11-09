import type { Task, TaskInput, TaskUpdate } from "@smart-todo/contracts";
import { DomainError } from "../domain/errors.js";
import { canTransition } from "../domain/transitions.js";
import { queryTasks } from "../domain/task-query.js";
import type { StoredTask } from "../persistence/persistence-types.js";
import { JsonTaskRepository } from "../persistence/json-task-repository.js";

const publicTask = (task: StoredTask): Task => {
  const { creationOrder: _, ...result } = task;
  return result;
};

export class TaskService {
  constructor(private readonly repository: JsonTaskRepository) {}
  async create(input: TaskInput): Promise<Task> { return publicTask(await this.repository.create({ ...input, description: input.description ?? "", tags: input.tags ?? [], priority: input.priority ?? "Medium", status: "To Do" })); }
  async get(id: string): Promise<Task> {
    const task = await this.repository.find(id);
    if (!task) throw new DomainError("TASK_NOT_FOUND", 404, "Task was not found");
    return publicTask(task);
  }
  async list(tags: string[] = [], sort = false): Promise<Task[]> { return (await this.repository.list()).filter((task) => queryTasks([task], tags, sort).length).map(publicTask); }
  async query(tags: string[] = [], sort = false): Promise<Task[]> { return queryTasks(await this.repository.list(), tags, sort).map(publicTask); }
  async update(id: string, input: TaskUpdate): Promise<Task> {
    const existing = await this.repository.find(id);
    if (!existing) throw new DomainError("TASK_NOT_FOUND", 404, "Task was not found");
    if (input.status && !canTransition(existing.status, input.status)) throw new DomainError("INVALID_STATUS_TRANSITION", 409, "Requested status transition is not allowed");
    const updated: StoredTask = { ...existing, ...input, title: input.title ?? existing.title, description: input.description ?? existing.description, tags: input.tags ?? existing.tags, priority: input.priority ?? existing.priority, status: input.status ?? existing.status };
    await this.repository.mutate((document) => ({ ...document, tasks: document.tasks.map((task) => task.id === id ? updated : task) }));
    return publicTask(updated);
  }
  async delete(id: string): Promise<void> {
    if (!(await this.repository.find(id))) throw new DomainError("TASK_NOT_FOUND", 404, "Task was not found");
    await this.repository.mutate((document) => ({ ...document, tasks: document.tasks.filter((task) => task.id !== id) }));
  }
}
