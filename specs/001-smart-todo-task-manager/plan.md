# Implementation Plan: Smart Todo & Task Manager

**Branch**: `001-smart-todo-task-manager` | **Date**: 2026-11-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-smart-todo-task-manager/spec.md`

## Summary

Build a two-part TypeScript web application for one shared task collection. The
backend exposes the REST contract, applies shared domain validation and status
rules, and persists tasks atomically to a local JSON file. The frontend
provides the specified task-management workflow through React and Vite. Unit,
API/contract, persistence, UI, and independent harness checks provide evidence
for every acceptance criterion.

## Technical Context

**Language/Version**: TypeScript with the repository-supported Node.js runtime

**Primary Dependencies**: React, Vite, Express, a TypeScript runtime/build
  tool, the repository's selected test runner and HTTP test client, and a
  workspace `packages/contracts` package

**Storage**: Versioned local JSON document with atomic replacement and
  serialized writes

**Testing**: Unit tests, API contract/integration tests, persistence restart
  tests, frontend component or browser tests, lint, type-check, and independent
  security/dependency checks

**Target Platform**: Local Node.js process and browser

**Project Type**: Web application with a REST backend and React frontend

**Performance Goals**: At least 95% of standard operations over 1,000 tasks
  complete within 500 ms in the local test environment

**Constraints**: No authentication, notifications, external AI integrations,
  cloud infrastructure, or unapproved functional scope; malformed persistence
  data must not be silently overwritten

**Scale/Scope**: One shared local collection, initially tested at 1,000 tasks;
  CRUD, tag filtering, priority sorting, lifecycle transitions, and one web UI

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Specification-first**: PASS. The plan is derived from the approved
  specification and does not begin implementation.
- **TypeScript and architecture**: PASS. The design separates React UI,
  Express transport, domain services, validation, and persistence.
- **Test-first correctness**: PASS. Every functional area has unit and
  API/contract coverage, including exact status, ordering, and error behavior.
- **Independent harness**: PASS. The quickstart defines lint, type-check,
  security, unit, contract, persistence, and evidence gates.
- **Security and data protection**: PASS. No secrets or authentication are
  introduced; input validation and non-disclosing errors are specified.
- **Maintainability and traceability**: PASS. Plan artifacts link to the spec,
  data model, contracts, tests, and acceptance evidence.
- **Scope**: PASS. No new functional requirements are introduced.

## Architecture and Responsibilities

### Backend

- **Routes/controllers**: Parse HTTP requests, enforce content type and query
  shape, call the task service, and map domain errors to contract responses.
- **Task service**: Normalize and validate task input, enforce status
  transitions, apply filtering and sorting, and coordinate repository writes.
- **Task repository**: Load the versioned JSON document, validate its structure,
  serialize writes, atomically replace the file, and expose explicit
  persistence failures.
- **Domain types/constants**: Define Task, priorities, statuses, transition
  map, validation errors, and public response shapes.
- **Error middleware**: Convert known errors to stable JSON error codes and
  prevent stack traces or internal details from reaching clients.

### Frontend

- **Task state layer**: Fetch and mutate tasks through the REST client; keep
  server state authoritative.
- **Task form**: Collect fields, apply user-facing normalization, display
  field errors, and submit create/update operations.
- **Task list and row**: Render collection, empty/loading/error states, and
  update/delete actions.
- **Filter/sort controls**: Build only the approved tag and priority query
  parameters.
- **API client**: Centralize request serialization, response parsing, and
  structured error handling.

The canonical public task and API error types live in
`packages/contracts/src/`. Backend persistence/domain types may extend those
types, while frontend and backend import the canonical public types rather
than maintaining separate copies. Contract tests verify the serialized shapes.

## API, Data, and Persistence Design

The API uses `/api/tasks` and the operations in
[rest-api.md](./contracts/rest-api.md). The domain data model and state machine
are defined in [data-model.md](./data-model.md). The repository keeps a
versioned document with a monotonic creation sequence. On each successful
mutation it writes a complete next document to a temporary file, flushes and
closes it, then atomically renames it into place while serializing mutation
operations. Startup reads and validates the existing document; malformed or
unreadable data fails explicitly.

## Validation and Error Handling

Validation is centralized so API and UI behavior remain consistent. Title,
description, tags, enums, unknown fields, IDs, JSON bodies, content type, and
query parameters are validated before mutation. The service checks status
transitions against the state machine and returns a conflict for a disallowed
change. Mutations validate the complete proposed task before writing, so
failures leave the in-memory and persisted collection unchanged. Known errors
map to the stable contract codes; unexpected errors are logged for the
operator and returned as generic internal errors without sensitive details.

## Testing Strategy

- **Unit**: Normalization, field validation, unknown-field rejection, ID
  handling, defaults, status transition matrix, tag matching, priority order,
  tie-breaking, and error mapping.
- **API/contract**: Every endpoint's success payload and HTTP status; malformed
  JSON/content type; invalid IDs; missing fields; invalid types and enum
  values; unknown fields; unsupported query parameters; empty filter matches;
  `PUT` replacement; `PATCH` retention; `204` empty deletion; and `409`
  transition conflicts.
- **Persistence/integration**: Missing file initialization, restart recovery,
  atomic write behavior, malformed-file failure, concurrent mutation
  serialization, and preservation of records after failed mutations.
- **Frontend**: Create/view/list/update/delete journey, filter/sort controls,
  loading and empty states, visible validation errors, not-found handling,
  transition conflict handling, and server-error handling.
- **Acceptance/performance**: Run all scenarios from the specification and
  measure the 95th percentile of standard operations over 1,000 tasks against
  the 500 ms target.
- **Independent harness**: Execute lint, type-check, unit tests, API/contract
  tests, integration/persistence tests, UI tests, security/dependency checks,
  performance checks, and acceptance evidence collection without weakening or
  deleting tests. Preserve the initial generated implementation before
  corrections.

## Implementation Sequencing and Dependencies

1. Establish workspace configuration, shared TypeScript types, scripts, and
   test harness entry points.
2. Implement domain constants, validation, normalization, error types, and the
   status transition matrix; add unit tests.
3. Implement the JSON repository and atomic/serialized persistence; add
   persistence and restart tests.
4. Implement the task service for CRUD, filtering, sorting, and transitions;
   add service tests.
5. Implement Express routes, middleware, and error mapping; add API contract
   tests. Steps 2–4 must precede route completion.
6. Implement the frontend API client, state layer, form, list, filters, and
   error states against the stable API contract.
7. Add frontend/component or browser tests for the primary user journeys.
8. Run the independent harness, performance checks, and full acceptance
   scenarios; address genuine failures and preserve evidence.
9. Perform human review and record explicit `ACCEPT` or `REJECT`.

## Technical Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Partial JSON write or concurrent mutation | Corruption or lost tasks | Serialize writes, write a temporary complete document, atomically rename, and test interruption/concurrency paths |
| Frontend and backend validation drift | Inconsistent user behavior | Keep contract-level rules in backend domain validation and test UI against the same outcomes |
| Ambiguous ordering | Flaky tests and confusing UI | Persist `creationOrder` and define priority plus creation-order tie-breaking |
| Invalid persisted data | Silent data loss or startup inconsistency | Validate document shape at startup and fail explicitly without overwrite |
| Status rule bypass through alternate update path | Invalid lifecycle state | Route PUT and PATCH through one service transition check |
| Broad error handling leaks details or hides failures | Security and debugging failures | Use typed known errors, generic unexpected responses, and operator-visible logs |
| Harness is treated as optional | Unverified generated implementation | Make lint, type, security, unit, contract, persistence, and acceptance checks mandatory before human acceptance |

## Project Structure

### Documentation (this feature)

```text
specs/001-smart-todo-task-manager/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── rest-api.md
│   └── ui-contract.md
└── tasks.md              # Created by /speckit-tasks
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── http-types.ts
│   ├── domain/
│   │   ├── task.ts
│   │   ├── validation.ts
│   │   ├── transitions.ts
│   │   └── errors.ts
│   ├── services/
│   │   └── task-service.ts
│   ├── persistence/
│   │   ├── json-task-repository.ts
│   │   └── persistence-types.ts
│   └── server.ts
└── tests/
    ├── unit/
    ├── integration/
    └── contract/

frontend/
├── src/
│   ├── components/
│   │   ├── TaskForm.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskRow.tsx
│   │   └── FilterControls.tsx
│   ├── services/
│   │   └── task-api.ts
│   ├── types/
│   │   └── task.ts
│   ├── App.tsx
│   └── main.tsx
└── tests/
    ├── components/
    └── flows/

packages/
└── contracts/
    └── src/
        ├── task.ts
        └── api-error.ts

harness/
├── run.sh
├── checks/
└── evidence/
```

**Structure Decision**: Use separate `backend/`, `frontend/`, and `harness/`
areas. The backend owns all business and persistence rules; the frontend owns
presentation and interaction; the harness independently validates the generated
implementation. Shared contract concepts are documented under the feature
directory and may be represented in code only where required by the chosen
workspace setup.

## Complexity Tracking

No constitution violations or unjustified architectural complexity were
identified. The separate frontend/backend structure is required by the
approved technology stack, and the repository/service split is the smallest
structure that preserves the required testability and persistence guarantees.
