import { useState } from "react";
import type { Status } from "@smart-todo/contracts";
import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
export default function App() {
  const { tasks, error, loading, refresh, create, get, update, remove } = useTasks();
  const [tags, setTags] = useState("");
  const [sort, setSort] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [retrievedTask, setRetrievedTask] = useState<string>("");
  return (
    <main>
      <h1>Smart Todo</h1>
      <TaskForm onSubmit={create} />
      <section>
        <input aria-label="Task ID" value={taskId} onChange={(event) => setTaskId(event.target.value)} placeholder="Retrieve by task ID" />
        <button onClick={async () => { const task = await get(taskId); setRetrievedTask(task ? `${task.title} (${task.id})` : ""); }}>Retrieve task</button>
        {retrievedTask && <p>Retrieved: {retrievedTask}</p>}
      </section>
      <section>
        <input
          aria-label="Filter tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Filter tags"
        />
        <button onClick={() => refresh(tags, sort)}>Filter</button>
        <button
          onClick={() => {
            setSort(!sort);
            void refresh(tags, !sort);
          }}
        >
          Sort priority
        </button>
      </section>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onUpdate={(id, status: Status) => update(id, { status })}
          onEdit={update}
          onDelete={remove}
        />
      )}
    </main>
  );
}
