import { act } from "react";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import type { Task } from "@smart-todo/contracts";
import { TaskForm } from "../../src/components/TaskForm";
import { TaskRow } from "../../src/components/TaskRow";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const task: Task = {
  id: "task-1234",
  title: "Review",
  description: "Evidence",
  tags: ["work"],
  priority: "Medium",
  status: "To Do",
  createdAt: "2026-01-01T00:00:00.000Z"
};

function render(element: ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => { createRoot(container).render(element); });
  return container;
}

describe("task UI", () => {
  it("displays the fixed initial status and submits task fields", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const container = render(<TaskForm onSubmit={onSubmit} />);
    expect(container.textContent).toContain("Status: To Do");
    const title = container.querySelector<HTMLInputElement>('input[aria-label="Title"]')!;
    const form = container.querySelector("form")!;
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setter.call(title, "New task");
      title.dispatchEvent(new Event("input", { bubbles: true }));
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(onSubmit).toHaveBeenCalledWith({ title: "New task", description: "", tags: [], priority: "Medium" });
  });
  it("displays the ID and saves editable fields", async () => {
    const onEdit = vi.fn().mockResolvedValue(undefined);
    const container = render(<TaskRow task={task} onUpdate={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />);
    expect(container.textContent).toContain("task-1234");
    act(() => { container.querySelector("button")?.click(); });
    const title = container.querySelector<HTMLInputElement>('input[aria-label="Title for task-1234"]')!;
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setter.call(title, "Updated");
      title.dispatchEvent(new Event("input", { bubbles: true }));
      container.querySelector("form")?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(onEdit).toHaveBeenCalled();
    expect(onEdit.mock.calls[0][0]).toMatchObject({ title: "Updated", description: "Evidence", tags: ["work"], priority: "Medium" });
  });
});
