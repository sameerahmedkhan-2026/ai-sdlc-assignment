# Data Model: Smart Todo & Task Manager

## Task

Represents one unit of work in the shared task collection.

| Field | Type | Required in response | Rules |
|---|---|---:|---|
| `id` | string | Yes | System-generated, unique, opaque, immutable |
| `title` | string | Yes | Trimmed; must contain at least one non-whitespace character |
| `description` | string | Yes | Optional on create; omitted input is stored and returned as `""` |
| `tags` | string[] | Yes | Optional; each value is trimmed, non-empty, case-sensitive, and unique |
| `priority` | enum | Yes | `High`, `Medium`, or `Low`; defaults to `Medium` |
| `status` | enum | Yes | `To Do`, `In Progress`, `Done`, or `Cancelled`; every new task starts at `To Do` |
| `createdAt` | string | Yes | System-generated ISO 8601 timestamp; immutable |
| `creationOrder` | integer | No | Internal monotonic sequence used for stable ordering |

The public response MUST NOT expose `creationOrder`; it is persistence
metadata. `createdAt` is informational and MUST NOT replace `creationOrder` as
the equal-priority tie-breaker.

## Persistence document

The JSON file contains a single object:

```json
{
  "version": 1,
  "nextCreationOrder": 4,
  "tasks": [
    {
      "id": "opaque-id",
      "title": "Prepare review",
      "description": "",
      "tags": ["work"],
      "priority": "High",
      "status": "To Do",
      "createdAt": "2026-11-03T00:00:00.000Z",
      "creationOrder": 3
    }
  ]
}
```

The repository MUST create an empty version-1 document on the first successful
write when the file is absent. Malformed or unreadable existing data MUST
produce an explicit startup or persistence error and MUST NOT be overwritten
silently.

## Status state machine

| Current status | Allowed next statuses |
|---|---|
| `To Do` | `In Progress` |
| `In Progress` | `Done`, `Cancelled` |
| `Done` | none |
| `Cancelled` | none |

Creation always starts at `To Do`; a client-supplied creation status is invalid.
An unchanged status supplied in an update is accepted as idempotent and does not
count as a transition. A disallowed change returns a conflict and leaves the
task unchanged.

## Derived collection behavior

- Tag filtering matches every distinct requested tag, with case-sensitive
  equality.
- Duplicate requested tags are deduplicated.
- Priority sorting is descending urgency: `High`, `Medium`, `Low`.
- Equal-priority tasks sort by ascending `creationOrder`.
- Without a sort request, tasks retain ascending `creationOrder`.
