# Quickstart Validation: Smart Todo & Task Manager

This guide validates the approved behavior after implementation. It does not
define implementation details beyond the required commands and observable
outcomes.

## Prerequisites

- Node.js and npm installed.
- Dependencies installed in the backend and frontend workspaces.
- A writable local JSON data-file location.

## Static and unit validation

Run the repository's documented lint, type-check, and unit-test commands.
Expected result: all commands exit successfully with no disabled checks or
deleted failing tests.

## API contract validation

Start the backend and execute the API contract test suite. Verify:

1. `POST /api/tasks` creates a task with defaults and returns `201`.
2. `GET /api/tasks/:id` returns the created task with `200`.
3. `GET /api/tasks` lists all tasks and returns `[]` for an empty collection.
4. `PUT` replaces all editable fields and `PATCH` retains omitted fields.
5. `DELETE` returns `204` with no body and later retrieval returns `404`.
6. Tag filtering requires every requested tag and returns deterministic results.
7. `sort=priority` returns High, Medium, Low, then creation order.
8. Invalid IDs, missing fields, invalid types, invalid enums, malformed JSON,
   unsupported content types, unknown fields, and invalid queries return `400`
   or `404` as specified.
9. Disallowed status changes return `409` and leave the task unchanged.
10. Successful writes remain available after a normal backend restart.
11. Malformed existing JSON produces an explicit persistence/startup failure
    and is not silently replaced.

Refer to [rest-api.md](./contracts/rest-api.md) for exact payloads and status
codes, and [data-model.md](./data-model.md) for state and persistence rules.

## UI validation

Start the frontend and backend, open the web interface, and verify:

1. A user can create a task, see it in the list, and view its ID.
2. The list can be filtered by tags and sorted by priority.
3. A user can update and delete a task.
4. Invalid input, not-found responses, transition conflicts, and server errors
   are shown as visible error states rather than success messages.
5. Refreshing the page and restarting the backend preserve successful writes.

## Independent harness quality gate

Run the independent harness against the generated implementation. The harness
MUST execute linting, type checking, unit tests, API/contract tests, persistence
restart tests, and applicable security/dependency checks. Preserve command
output and failures as evidence. Final acceptance requires all mandatory gates
to pass and a human reviewer to record `ACCEPT`; a passing harness alone is
not sufficient.
