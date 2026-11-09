import { useCallback, useEffect, useState } from "react";
import type { Task, TaskInput, TaskUpdate } from "@smart-todo/contracts";
import { taskApi } from "../services/task-api";
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async (tags = "", sort = false) => { setLoading(true); try { setTasks(await taskApi.list(tags, sort)); setError(""); } catch (e) { setError(e instanceof Error ? e.message : "Request failed"); } finally { setLoading(false); } }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const runMutation = async <T,>(operation: () => Promise<T>): Promise<T | undefined> => {
    try {
      const result = await operation();
      setError("");
      await refresh();
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      return undefined;
    }
  };
  const create = (input: TaskInput) => runMutation(() => taskApi.create(input));
  const get = async (id: string) => {
    try {
      const result = await taskApi.get(id);
      setError("");
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      return undefined;
    }
  };
  const update = (id: string, input: TaskUpdate) => runMutation(() => taskApi.update(id, input));
  const remove = (id: string) => runMutation(() => taskApi.remove(id));
  return { tasks, error, loading, refresh, create, get, update, remove };
}
