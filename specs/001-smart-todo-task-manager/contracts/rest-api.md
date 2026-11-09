# REST API Contract: Smart Todo & Task Manager

Base path: `/api`

All JSON request bodies MUST use `Content-Type: application/json`. Successful
task responses use the `Task` shape in [data-model.md](../data-model.md).

## Endpoints

| Method | Path | Success | Purpose |
|---|---|---|---|
| `POST` | `/api/tasks` | `201 Created` | Create a task |
| `GET` | `/api/tasks/:id` | `200 OK` | Retrieve one task |
| `GET` | `/api/tasks` | `200 OK` | List, filter, and sort tasks |
| `PUT` | `/api/tasks/:id` | `200 OK` | Replace editable fields |
| `PATCH` | `/api/tasks/:id` | `200 OK` | Update supplied editable fields |
| `DELETE` | `/api/tasks/:id` | `204 No Content` | Delete one task |

## Create

`POST /api/tasks`

Request fields:

```json
{
  "title": "Prepare review",
  "description": "Check acceptance evidence",
  "tags": ["work", "review"],
  "priority": "High"
}
```

`title` is required. `description`, `tags`, and `priority` are optional and
default to `""`, `[]`, and `Medium`. Every created task starts at `To Do`;
clients MUST NOT supply `status` in this request, and an explicitly supplied
status is rejected as a validation error. IDs and persistence metadata are
server-generated and MUST be rejected if supplied.

## Update

`PUT /api/tasks/:id` requires `title`, `description`, `tags`, `priority`, and
`status`; it replaces all editable fields. `PATCH /api/tasks/:id` accepts one or
more editable fields and retains omitted values. Neither method may alter
`id`, `createdAt`, or creation order.

Both methods apply the same normalization, field validation, and status
transition rules. A request that changes status must be allowed by the state
machine; supplying the task's existing status is accepted idempotently.

## Collection query parameters

`GET /api/tasks`

- `tags`: comma-separated tag values. Every distinct requested tag must be
  present on a returned task. Empty values are invalid.
- `sort`: only `priority` is accepted. It sorts High before Medium before Low,
  then older creation order first.

For repeated parameters, identical `tags` values are combined and
deduplicated, while conflicting `tags` values are combined into one
all-requested-tags filter. Repeated identical `sort=priority` values are
accepted; conflicting or repeated sort values other than `priority` return
`400 Bad Request`. Unknown query parameters, empty tag values, and unsupported
sort values also return `400 Bad Request`.

## Response examples

Successful create, retrieve, and update responses return a task object:

```json
{
  "id": "opaque-id",
  "title": "Prepare review",
  "description": "Check acceptance evidence",
  "tags": ["work", "review"],
  "priority": "High",
  "status": "To Do",
  "createdAt": "2026-11-03T00:00:00.000Z"
}
```

Successful list responses return an array of task objects, including `[]` when
no tasks match. Delete returns an empty body.

Malformed IDs return `400 Bad Request`; valid-format IDs that do not identify
stored tasks return `404 Not Found` for retrieval, update, and deletion.

## Error contract

Errors return a JSON body with this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "title must be a non-empty string",
    "fields": {
      "title": "must not be empty"
    }
  }
}
```

`fields` is optional. The stable codes include:

| Status | Codes | Use |
|---:|---|---|
| `400` | `VALIDATION_ERROR`, `MALFORMED_REQUEST` | Invalid fields, JSON, content type, malformed ID format, or query |
| `404` | `TASK_NOT_FOUND` | Unknown task ID |
| `409` | `INVALID_STATUS_TRANSITION` | Valid status value but disallowed transition |
| `500` | `PERSISTENCE_ERROR`, `INTERNAL_ERROR` | Explicit storage or unexpected server failure |

Error responses MUST NOT include stack traces, filesystem paths, secrets, or
raw internal exception messages.
