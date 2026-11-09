import { useState } from "react";
import type { Priority, Status, Task, TaskUpdate } from "@smart-todo/contracts";
const next: Record<Status, Status[]> = { "To Do": ["In Progress"], "In Progress": ["Done", "Cancelled"], Done: [], Cancelled: [] };
export function TaskRow({ task, onUpdate, onEdit, onDelete }: { task: Task; onUpdate: (status: Status) => Promise<unknown>; onEdit: (input: TaskUpdate) => Promise<unknown>; onDelete: () => Promise<unknown> }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [tags, setTags] = useState(task.tags.join(", "));
  const [priority, setPriority] = useState<Priority>(task.priority);
  const save = async () => {
    await onEdit({ title, description, tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean), priority });
    setEditing(false);
  };
  return <li>
    <span>Task ID: <code>{task.id}</code></span>
    {editing ? <form onSubmit={async (event) => { event.preventDefault(); await save(); }}>
      <input aria-label={`Title for ${task.id}`} value={title} onChange={(event) => setTitle(event.target.value)} />
      <input aria-label={`Description for ${task.id}`} value={description} onChange={(event) => setDescription(event.target.value)} />
      <input aria-label={`Tags for ${task.id}`} value={tags} onChange={(event) => setTags(event.target.value)} />
      <select aria-label={`Priority for ${task.id}`} value={priority} onChange={(event) => setPriority(event.target.value as Priority)}><option>High</option><option>Medium</option><option>Low</option></select>
      <button type="submit">Save changes</button><button type="button" onClick={() => setEditing(false)}>Cancel</button>
    </form> : <>
      <strong>{task.title}</strong> <span>{task.priority}</span> <span>{task.status}</span> <small>{task.tags.join(", ")}</small>
      <p>{task.description}</p>
      <button onClick={() => setEditing(true)}>Edit</button>
    </>}
    {next[task.status].map((status) => <button key={status} onClick={() => onUpdate(status)}>{status}</button>)}
    <button onClick={() => { if (window.confirm("Delete this task?")) void onDelete(); }}>Delete</button>
  </li>;
}
