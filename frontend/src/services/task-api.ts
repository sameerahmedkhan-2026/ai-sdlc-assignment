import type { Task, TaskInput, TaskUpdate } from "@smart-todo/contracts";
const base = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, { headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) }, ...init });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: { message: "Request failed" } }));
    throw new Error(body.error?.message ?? "Request failed");
  }
  return response.status === 204 ? undefined as T : response.json();
}
export const taskApi = {
  get: (id: string) => request<Task>(`/tasks/${encodeURIComponent(id)}`),
  list: (tags = "", sort = false) => request<Task[]>(`/tasks?${tags ? `tags=${encodeURIComponent(tags)}&` : ""}${sort ? "sort=priority" : ""}`),
  create: (input: TaskInput) => request<Task>("/tasks", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: TaskUpdate) => request<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  remove: (id: string) => request<void>(`/tasks/${id}`, { method: "DELETE", headers: {} })
};
