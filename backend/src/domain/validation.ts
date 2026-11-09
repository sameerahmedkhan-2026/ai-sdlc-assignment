import { PRIORITIES, STATUSES, type Priority, type Status, type TaskInput, type TaskUpdate } from "@smart-todo/contracts";
import { DomainError } from "./errors.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function assertObject(value: unknown): asserts value is Record<string, unknown> {
  if (!isRecord(value)) throw new DomainError("MALFORMED_REQUEST", 400, "Request body must be an object");
}

function validateCommon(body: Record<string, unknown>, partial: boolean): TaskUpdate {
  const allowed = new Set(["title", "description", "tags", "priority", "status"]);
  const unknown = Object.keys(body).find((key) => !allowed.has(key));
  if (unknown) throw new DomainError("VALIDATION_ERROR", 400, `Unexpected field: ${unknown}`, { [unknown]: "is not allowed" });
  if (!partial && !("title" in body)) throw new DomainError("VALIDATION_ERROR", 400, "title is required", { title: "is required" });
  if ("title" in body) {
    if (typeof body.title !== "string" || body.title.trim() === "") throw new DomainError("VALIDATION_ERROR", 400, "title must be a non-empty string", { title: "must not be empty" });
  }
  if ("description" in body && typeof body.description !== "string") throw new DomainError("VALIDATION_ERROR", 400, "description must be a string", { description: "must be a string" });
  if ("tags" in body) {
    if (!Array.isArray(body.tags) || body.tags.some((tag) => typeof tag !== "string" || tag.trim() === "")) {
      throw new DomainError("VALIDATION_ERROR", 400, "tags must be an array of non-empty strings", { tags: "must contain non-empty strings" });
    }
  }
  if ("priority" in body && !PRIORITIES.includes(body.priority as Priority)) throw new DomainError("VALIDATION_ERROR", 400, "priority is invalid", { priority: "must be High, Medium, or Low" });
  if ("status" in body && !STATUSES.includes(body.status as Status)) throw new DomainError("VALIDATION_ERROR", 400, "status is invalid", { status: "must be a supported status" });
  return body as TaskUpdate;
}

export function validateCreate(value: unknown): TaskInput {
  assertObject(value);
  if ("status" in value) throw new DomainError("VALIDATION_ERROR", 400, "status must not be supplied on creation", { status: "is server-assigned" });
  const result = validateCommon(value, false);
  return {
    title: result.title!.trim(),
    description: result.description === undefined ? "" : result.description,
    tags: result.tags ? [...new Set(result.tags.map((tag) => tag.trim()))] : [],
    priority: result.priority ?? "Medium"
  };
}

export function validateUpdate(value: unknown, partial: boolean): TaskUpdate {
  assertObject(value);
  if (Object.keys(value).length === 0) throw new DomainError("VALIDATION_ERROR", 400, "Update body must not be empty");
  if (!partial) {
    for (const field of ["title", "description", "tags", "priority", "status"]) {
      if (!(field in value)) throw new DomainError("VALIDATION_ERROR", 400, `${field} is required`, { [field]: "is required" });
    }
  }
  const result = validateCommon(value, partial);
  return {
    ...(result.title === undefined ? {} : { title: result.title.trim() }),
    ...(result.description === undefined ? {} : { description: result.description }),
    ...(result.tags === undefined ? {} : { tags: [...new Set(result.tags.map((tag) => tag.trim()))] }),
    ...(result.priority === undefined ? {} : { priority: result.priority }),
    ...(result.status === undefined ? {} : { status: result.status })
  };
}

export function validateId(id: string): void {
  if (!/^[A-Za-z0-9_-]{8,128}$/.test(id)) throw new DomainError("MALFORMED_REQUEST", 400, "Task ID has an invalid format");
}
