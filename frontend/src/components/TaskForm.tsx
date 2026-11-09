import { useState } from "react";
import type { Priority, TaskInput } from "@smart-todo/contracts";
export function TaskForm({
  onSubmit,
}: {
  onSubmit: (input: TaskInput) => Promise<unknown>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (!title.trim()) return;
        await onSubmit({
          title,
          description,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          priority,
        });
        setTitle("");
        setDescription("");
        setTags("");
      }}
    >
      <h2>Create task</h2>
      <input
        aria-label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        aria-label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        aria-label="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags, comma separated"
      />
      <select
        aria-label="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <span>Status: To Do</span>
      <button type="submit">Add task</button>
    </form>
  );
}
