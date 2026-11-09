import type { Status, Task, TaskUpdate } from "@smart-todo/contracts";
import { TaskRow } from "./TaskRow";
export function TaskList({ tasks, onUpdate, onEdit, onDelete }: { tasks: Task[]; onUpdate: (id: string, status: Status) => Promise<unknown>; onEdit: (id: string, input: TaskUpdate) => Promise<unknown>; onDelete: (id: string) => Promise<unknown> }) {
  if (!tasks.length) return <p>No tasks found.</p>;
  return <ul>{tasks.map((task) => <TaskRow key={task.id} task={task} onUpdate={(status) => onUpdate(task.id, status)} onEdit={(input) => onEdit(task.id, input)} onDelete={() => onDelete(task.id)} />)}</ul>;
}
