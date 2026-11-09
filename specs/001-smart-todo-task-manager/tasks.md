---

description: "Implementation tasks for the Smart Todo & Task Manager"
---

# Tasks: Smart Todo & Task Manager

**Input**: Design documents from
`/specs/001-smart-todo-task-manager/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/`, and `quickstart.md`

**Testing**: Tests are required by the approved specification and constitution.
For each story, tests MUST be written and confirmed failing before the related
implementation task begins.

**Organization**: Tasks are grouped by user story so each story has an
independently verifiable increment after the foundational phase.

## Phase 1: Setup

**Purpose**: Establish the TypeScript web application workspaces, scripts, and
quality tooling without implementing feature behavior.

- [X] T001 Create the `backend/`, `frontend/`, `packages/contracts/`, `packages/contracts/src/`, `harness/`, `backend/src/`, `backend/tests/`, `frontend/src/`, and `frontend/tests/` directories from the plan in `backend/package.json`, `frontend/package.json`, `packages/contracts/package.json`, and `package.json`
- [X] T002 [P] Initialize the backend TypeScript/Node.js/Express workspace and scripts in `backend/package.json`, `backend/tsconfig.json`, and `backend/src/server.ts`
- [X] T003 [P] Initialize the frontend React/Vite/TypeScript workspace and scripts in `frontend/package.json`, `frontend/tsconfig.json`, `frontend/vite.config.ts`, and `frontend/src/main.tsx`
- [X] T004 [P] Configure repository-wide scripts for install, lint, type-check, unit tests, contract tests, integration tests, UI tests, and harness execution in `package.json`
- [X] T005 [P] Configure shared linting, formatting, and TypeScript compiler checks in `eslint.config.*`, `.prettierrc.*`, `backend/tsconfig.json`, and `frontend/tsconfig.json`
- [X] T006 [P] Configure the selected test runner, HTTP test client, UI test runner, and test environment in `backend/vitest.config.ts`, `frontend/vitest.config.ts`, and `playwright.config.ts`
- [X] T007 [P] Create environment configuration examples and local JSON data-file settings without secrets in `.env.example`, `backend/.env.example`, and `frontend/.env.example`
- [X] T008 [P] Create the independent harness entry point, check directories, and evidence directory in `harness/run.sh`, `harness/checks/`, and `harness/evidence/.gitkeep`

## Phase 2: Foundational

**Purpose**: Complete blocking cross-cutting infrastructure before any user
story implementation.

**Checkpoint**: The foundation is ready when the workspaces build, tests can
run, configuration is loaded without secrets, and the harness can execute
placeholder quality commands without disabling required checks.

- [X] T009 Define canonical public task, response, and API error types in `packages/contracts/src/task.ts`, `packages/contracts/src/api-error.ts`, and backend-only persistence types in `backend/src/persistence/persistence-types.ts`; configure backend and frontend imports from `packages/contracts/`
- [X] T010 [P] Define priority/status constants and the public-field allowlists in `backend/src/domain/constants.ts`
- [X] T011 [P] Create typed domain-error classes and stable error-code definitions in `backend/src/domain/errors.ts`
- [X] T012 [P] Create the backend application factory and route registration boundary in `backend/src/app.ts` and `backend/src/api/routes/index.ts`
- [X] T013 [P] Create structured request logging and non-disclosing error middleware in `backend/src/api/middleware/error-handler.ts` and `backend/src/api/middleware/request-logger.ts`
- [X] T014 [P] Configure frontend imports and local view-model extensions from the canonical contract types in `packages/contracts/src/task.ts` and `packages/contracts/src/api-error.ts`, with contract-shape assertions in `frontend/src/types/task.ts` and `frontend/src/types/api-error.ts`
- [X] T015 [P] Create the frontend test utilities and backend test fixtures in `frontend/tests/test-utils.tsx` and `backend/tests/fixtures/tasks.ts`
- [X] T016 Add a harness command dispatcher that invokes linting, type-checking, unit tests, API/contract tests, integration/persistence tests, UI tests, security checks, dependency checks, performance checks, acceptance checks, and executable traceability validation, writing stdout/stderr evidence to `harness/evidence/`
- [X] T017 Verify the setup and foundational checks run successfully with no feature tests removed or quality checks disabled using `package.json`, `harness/run.sh`, and the generated `harness/evidence/setup.log`

## Phase 3: User Story 1 - Create and View Tasks (Priority: P1) 🎯 MVP

**Goal**: A user can create a valid task, receive its unique ID and complete
representation, retrieve it, and receive deterministic validation errors for
invalid creation input.

**Independent Test**: Start with an empty JSON store, create a task through
`POST /api/tasks`, retrieve it through `GET /api/tasks/:id`, verify defaults
and persisted fields, then submit missing-title, invalid-enum, malformed-type,
unknown-field, malformed-JSON, and unsupported-content-type requests and verify
that no task is created.

### Tests for User Story 1

- [X] T018 [P] [US1] Write unit tests for title/description/tag normalization, create defaults, required fields, field types, enum values, unexpected fields, and public response shaping in `backend/tests/unit/task-validation.test.ts`
- [X] T019 [P] [US1] Write API contract tests for `POST /api/tasks` success `201`, complete response, generated opaque ID, and `GET /api/tasks/:id` success `200` in `backend/tests/contract/tasks-create-read.test.ts`
- [X] T020 [P] [US1] Write API contract tests for missing title, empty normalized title, invalid priority, invalid status, explicitly supplied creation status, malformed field types, unexpected fields, malformed JSON, unsupported content type, malformed ID `400`, and unchanged storage in `backend/tests/contract/tasks-create-errors.test.ts`
- [X] T021 [P] [US1] Write persistence integration tests for absent-file initialization, durable create, ISO timestamp generation, and restart retrieval in `backend/tests/integration/task-create-persistence.test.ts`
- [X] T022 [P] [US1] Write frontend tests for default form values, create submission, returned ID display, task retrieval/view, and visible field errors in `frontend/tests/components/task-create-view.test.tsx`
- [X] T023 Run the User Story 1 tests and capture the expected pre-implementation failures in `harness/evidence/us1-red.log`

### Implementation for User Story 1

- [X] T024 [US1] Implement task input normalization and creation validation for title, description, tags, priority, and status in `backend/src/domain/validation.ts`
- [X] T025 [US1] Implement version-1 JSON document loading, empty-store initialization, task serialization, and generated ID/timestamp/creation-order handling in `backend/src/persistence/json-task-repository.ts`
- [X] T026 [US1] Implement serialized atomic JSON writes using a temporary file and atomic rename in `backend/src/persistence/json-task-repository.ts`
- [X] T027 [US1] Implement create and retrieve operations with public response shaping in `backend/src/services/task-service.ts`
- [X] T028 [US1] Implement `POST /api/tasks` and `GET /api/tasks/:id` routes with content-type, ID, status, and response mapping in `backend/src/api/routes/tasks.ts`
- [X] T029 [US1] Add application startup and persistence-error handling that refuses to overwrite malformed existing JSON in `backend/src/server.ts` and `backend/src/app.ts`
- [X] T030 [US1] Implement the frontend API client for create and retrieve requests with structured error parsing in `frontend/src/services/task-api.ts`
- [X] T031 [US1] Implement the task form and task-detail/list presentation for create and view flows in `frontend/src/components/TaskForm.tsx`, `frontend/src/components/TaskList.tsx`, `frontend/src/components/TaskRow.tsx`, and `frontend/src/App.tsx`
- [X] T032 Run the User Story 1 contract, integration, unit, and UI tests and record passing evidence in `harness/evidence/us1-green.log`

**Checkpoint**: User Story 1 is independently demonstrable through the REST
API and web interface, with durable create/read behavior and validated errors.

## Phase 4: User Story 2 - Manage the Task Collection (Priority: P1)

**Goal**: A user can list every task, replace or partially update a task, and
delete it, with exact success statuses and not-found behavior.

**Independent Test**: With a created task, list it, replace it through `PUT`,
partially update it through `PATCH`, verify persistence, delete it through
`DELETE`, verify `204` with no body, and verify subsequent retrieval returns
`404`; repeat update/delete with an unknown ID.

### Tests for User Story 2

- [X] T033 [P] [US2] Write API contract tests for empty and populated `GET /api/tasks`, `PUT` replacement, `PATCH` retention, and `DELETE` `204` with an empty body in `backend/tests/contract/tasks-manage.test.ts`
- [X] T034 [P] [US2] Write API contract tests for malformed IDs returning `400`, valid-format unknown IDs returning `404` on retrieve/update/delete, including unchanged collection assertions in `backend/tests/contract/tasks-manage-errors.test.ts`
- [X] T035 [P] [US2] Write unit tests for full replacement, partial update field retention, immutable ID/createdAt/creationOrder, and mutation atomicity in `backend/tests/unit/task-service-manage.test.ts`
- [X] T036 [P] [US2] Write persistence integration tests for update/delete durability, restart preservation, failed-mutation rollback, and concurrent mutation serialization in `backend/tests/integration/task-manage-persistence.test.ts`
- [X] T037 [P] [US2] Write frontend tests for list rendering, edit flow, delete confirmation/action, refresh after mutation, loading state, and empty collection state in `frontend/tests/components/task-manage.test.tsx`
- [X] T038 Run the User Story 2 tests and capture the expected pre-implementation failures in `harness/evidence/us2-red.log`

### Implementation for User Story 2

- [X] T039 [US2] Implement task-service list, full replacement, partial update, and delete operations while preserving immutable metadata in `backend/src/services/task-service.ts`
- [X] T040 [US2] Implement `GET /api/tasks`, `PUT /api/tasks/:id`, `PATCH /api/tasks/:id`, and `DELETE /api/tasks/:id` with exact success and not-found responses in `backend/src/api/routes/tasks.ts`
- [X] T041 [P] [US2] Write API contract tests for controlled persistence failures and unexpected internal errors, asserting stable error payloads, correct status codes, and absence of stack traces, filesystem paths, secrets, and raw exception messages in `backend/tests/contract/error-handling.test.ts`
- [X] T042 [US2] Run the new error-handling contract tests before middleware implementation and capture only the genuine pre-implementation results in `harness/evidence/us2-error-red.log`
- [X] T043 [US2] Map validation, malformed-request, not-found, persistence, and internal errors to the REST error contract in `backend/src/api/middleware/error-handler.ts`
- [X] T044 [US2] Extend the frontend API client and task state layer for list, replace, partial update, delete, refresh, and visible error states in `frontend/src/services/task-api.ts` and `frontend/src/hooks/useTasks.ts`
- [X] T045 [US2] Implement editable task rows, update controls, deliberate delete action, and loading/empty/error UI states in `frontend/src/components/TaskRow.tsx`, `frontend/src/components/TaskForm.tsx`, `frontend/src/components/TaskList.tsx`, and `frontend/src/App.tsx`
- [X] T046 Run the User Story 2 contract, integration, unit, and UI tests and record passing evidence in `harness/evidence/us2-green.log`

**Checkpoint**: User Stories 1 and 2 provide independently testable CRUD
management and preserve all existing create/view behavior.

## Phase 5: User Story 3 - Find and Order Tasks (Priority: P2)

**Goal**: A user can filter by all requested tags and sort by High, Medium,
Low priority with creation-order tie-breaking.

**Independent Test**: Create tasks with overlapping tags, duplicate filter
tags, mixed case, and equal/different priorities; verify filtered results,
empty matches, deterministic ordering, and malformed query rejection.

### Tests for User Story 3

- [X] T047 [P] [US3] Write unit tests for case-sensitive all-tag matching, duplicate filter-tag deduplication, empty-tag rejection, priority ordering, and creation-order tie-breaking in `backend/tests/unit/task-collection-query.test.ts`
- [X] T048 [P] [US3] Write API contract tests for `tags`, `sort=priority`, empty matches, duplicate tags, unknown query parameters, identical repeated tags, conflicting repeated tags, identical repeated `sort=priority`, conflicting/repeated unsupported sort values, empty values, and invalid sort values in `backend/tests/contract/tasks-query.test.ts`
- [X] T049 [P] [US3] Write frontend tests for tag filter controls, priority sort control, deterministic displayed order, no-match state, and query error display in `frontend/tests/components/task-query.test.tsx`
- [X] T050 Run the User Story 3 tests and capture the expected pre-implementation failures in `harness/evidence/us3-red.log`

### Implementation for User Story 3

- [X] T051 [US3] Implement pure collection filtering, priority sorting, and creation-order tie-breaking in `backend/src/domain/task-query.ts`
- [X] T052 [US3] Implement strict query parsing and validation for `tags` and `sort` in `backend/src/api/middleware/query-validation.ts`
- [X] T053 [US3] Integrate validated filtering and sorting into `GET /api/tasks` in `backend/src/services/task-service.ts` and `backend/src/api/routes/tasks.ts`
- [X] T054 [US3] Implement frontend filter/sort controls and API query serialization using only the approved query parameters in `frontend/src/components/FilterControls.tsx` and `frontend/src/services/task-api.ts`
- [X] T055 [US3] Integrate filtered/sorted results and no-match/error states into the task list in `frontend/src/hooks/useTasks.ts`, `frontend/src/components/TaskList.tsx`, and `frontend/src/App.tsx`
- [X] T056 Run the User Story 3 unit, contract, and UI tests and record passing evidence in `harness/evidence/us3-green.log`

**Checkpoint**: User Stories 1–3 support complete CRUD collection management,
deterministic tag filtering, and priority ordering.

## Phase 6: User Story 4 - Use Valid Task Statuses (Priority: P2)

**Goal**: A user can perform only the approved task lifecycle transitions:
`To Do` → `In Progress` → `Done` or `Cancelled`.

**Independent Test**: Attempt every allowed transition, unchanged-status
update, unknown status, and disallowed transition; verify successful
persistence or `409 INVALID_STATUS_TRANSITION` with unchanged data.

### Tests for User Story 4

- [X] T057 [P] [US4] Write unit tests for creation status rejection, the complete status transition matrix, unchanged-status idempotency, terminal statuses, and invalid status values in `backend/tests/unit/status-transitions.test.ts`
- [X] T058 [P] [US4] Write API contract tests for creation status rejection, allowed transitions, terminal statuses, invalid statuses, and `409` conflict responses with stable error payloads in `backend/tests/contract/tasks-status.test.ts`
- [X] T059 [P] [US4] Write persistence integration tests proving allowed transitions survive restart and rejected transitions do not modify JSON in `backend/tests/integration/task-status-persistence.test.ts`
- [X] T060 [P] [US4] Write frontend tests for status controls, allowed transition updates, terminal-state behavior, and visible transition-conflict messages in `frontend/tests/components/task-status.test.tsx`
- [X] T061 Run the User Story 4 tests and capture the expected pre-implementation failures in `harness/evidence/us4-red.log`

### Implementation for User Story 4

- [X] T062 [US4] Implement the explicit status transition map and idempotent unchanged-status rule in `backend/src/domain/transitions.ts`
- [X] T063 [US4] Integrate transition validation into both PUT and PATCH mutation paths, returning `409 INVALID_STATUS_TRANSITION` without persistence on rejection in `backend/src/services/task-service.ts`
- [X] T064 [US4] Implement status field controls and transition-conflict presentation in `frontend/src/components/TaskForm.tsx`, `frontend/src/components/TaskRow.tsx`, and `frontend/src/App.tsx`
- [X] T065 Run the User Story 4 unit, contract, integration, and UI tests and record passing evidence in `harness/evidence/us4-green.log`

**Checkpoint**: All four user stories are independently verified and the
complete approved lifecycle behavior is available through API and UI.

## Phase 7: Polish, Harness, Evidence, and Acceptance

**Purpose**: Apply cross-cutting quality gates, capture the initial generated
implementation before repairs, repair only genuine failures, and obtain
explicit human acceptance.

- [X] T066 [P] Add backend and frontend coverage thresholds and ensure unit, contract, integration, and UI tests map to FR-001–FR-021, NFR-001–NFR-004, and every acceptance scenario in `backend/vitest.config.ts`, `frontend/vitest.config.ts`, and `playwright.config.ts`
- [X] T067 [P] Add static security and dependency checks for secrets, unsafe input handling, vulnerable dependencies, and explicit absence of authentication, notifications, external AI integrations, and cloud infrastructure in `harness/checks/security.sh` and `harness/checks/dependencies.sh`
- [X] T068 [P] Add performance and acceptance runners for 1,000-task operations, 95th-percentile 500 ms validation, restart persistence, and quickstart scenarios in `harness/checks/performance.ts` and `harness/checks/acceptance.ts`
- [X] T069 [P] Add an executable traceability validator that fails when any FR, NFR, acceptance scenario, edge case, or buildable success criterion lacks a test reference, and writes the mapping to `harness/traceability.md` and `harness/checks/traceability.ts`
- [X] T070 Preserve the initial generated implementation snapshot and run the complete independent harness before any correction in `harness/evidence/initial/` and `harness/evidence/initial-run.log`
- [X] T071 Capture the harness's actual failures and actionable feedback without changing approved requirements or weakening tests in `harness/evidence/feedback.md`
- [X] T072 Repair each confirmed implementation or configuration failure using the recorded feedback and document changed paths in `harness/evidence/repairs.md`
- [X] T073 Re-run the same lint, type-check, unit, contract, integration, UI, security, dependency, performance, acceptance, and traceability checks after repairs and capture output in `harness/evidence/revalidation.log`
- [X] T074 Run the complete `quickstart.md` validation guide and record expected outcomes and any known limitations in `harness/evidence/quickstart-validation.md`
- [X] T075 Update setup, run, test, persistence, and harness instructions to match the delivered project in `README.md`
- [ ] T076 Perform final human review against the constitution, specification, plan, contracts, traceability matrix, and evidence; record an explicit `ACCEPT` or `REJECT` decision in `harness/evidence/final-review.md`

## Dependencies and Execution Order

### Phase dependencies

- **Phase 1 Setup**: No prerequisites; T002–T008 can run in parallel after T001
  where they touch different files.
- **Phase 2 Foundational**: Depends on T001–T008; T009–T016 can run in parallel
  when their files are independent. T017 requires all foundational setup.
- **Phase 3 User Story 1**: Depends on T017. Its tests T018–T022 can run in
  parallel, then T023 must precede T024–T031, and T032 follows implementation.
- **Phase 4 User Story 2**: Depends on Phase 2 and the task model/repository
  from US1; tests T033–T037 and T041 can run in parallel, then T038 and T042
  capture genuine red results before T043; T046 follows implementation.
- **Phase 5 User Story 3**: Depends on Phase 2 and the collection service from
  US2; tests T047–T049 can run in parallel, then T050 precedes T051–T055.
- **Phase 6 User Story 4**: Depends on Phase 2 and the update service from US2;
  tests T057–T060 can run in parallel, then T061 precedes T062–T064.
- **Phase 7 Polish**: T066–T069 can run in parallel after the story phases;
  T070 requires the implementation and quality checks, T071 follows T070, T072
  follows T071, and T073–T076 follow T072.
- **Phase 8 Remediation**: T077–T079 depend on the completed story
  implementation; T080 and T081 can run in parallel after the implementation
  and test updates; T082 depends on the persistence tests; T083 follows
  T077–T082 and records the resulting validation evidence.

### User-story completion order

- **US1 (P1)** is the MVP and depends only on the foundational phase.
- **US2 (P1)** depends on the US1 task model and persistence but remains
  independently testable through its complete CRUD journey.
- **US3 (P2)** depends on the collection/list behavior delivered by US2.
- **US4 (P2)** depends on the update path delivered by US2.
- US3 and US4 can proceed in parallel after US2.

### Parallel execution examples

```text
# After T001, setup work can proceed in parallel:
T002, T003, T004, T005, T006, T007, T008

# After T017, prepare US1 tests in parallel, then run T023:
T018, T019, T020, T021, T022

# After T017, US1 implementation can split by file boundary:
T024, T025, T026, T030

# Before US2 implementation, US2 test suites can run in parallel:
T033, T034, T035, T036, T037, T041
# Capture genuine red results before T043:
T038, T042

# After T050 and T061, the independent P2 stories can proceed in parallel:
US3: T051–T056
US4: T062–T065

# Before repairs, quality checks can run in parallel:
T066, T067, T068, T069
```

## Implementation Strategy

### MVP first

1. Complete Phase 1 and Phase 2.
2. Write and fail the US1 tests, then implement US1.
3. Stop at T032 and validate the create/view journey independently.
4. Demonstrate the MVP only after its contract, persistence, UI, and validation
   evidence passes.

### Incremental delivery

1. Add US2 for complete task collection management and validate it independently.
2. Add US3 for deterministic tag filtering and priority sorting.
3. Add US4 for lifecycle transition enforcement.
4. Run Phase 7 only after the desired stories are complete.

### Required evidence discipline

The initial generated implementation MUST be preserved and tested before any
repair. Actual failures MUST be captured as feedback to the coding agent.
Repairs MUST be minimal and traceable. The same quality gates MUST be rerun
after repairs, and the final human reviewer MUST record `ACCEPT` or `REJECT`.

## Traceability Summary

- **US1 / FR-001–FR-008, FR-013, FR-018–FR-021**: T018–T032
- **FR-003**: T018–T032
- **FR-005**: T018, T024
- **FR-006**: T018, T024
- **FR-009**: T019, T028
- **FR-010**: T019, T033, T040
- **FR-011**: T033, T040
- **FR-015**: T047, T051–T055
- **FR-020**: T022, T037, T045, T060
- **US2 / FR-002–FR-004, FR-008–FR-013, FR-017–FR-019**: T033–T046
- **US3 / FR-014–FR-016, NFR-003**: T047–T056
- **US4 / FR-007, FR-012–FR-013, FR-017–FR-019**: T057–T065
- **NFR-001**: T068, T070, T073; evidence in
  `harness/evidence/initial-run.log` and `harness/evidence/revalidation.log`
- **NFR-002**: T021, T036, T059, T066, T070, T073; evidence in
  `harness/evidence/quickstart-validation.md`
- **NFR-003**: T047–T049, T056, T066, T070, T073; evidence in
  `harness/evidence/quickstart-validation.md`
- **NFR-004**: T066, T069, T070, T073; executable traceability output in
  `harness/traceability.md`
- **SC-001**: T022, T032, T073; evidence in
  `harness/evidence/quickstart-validation.md`
- **SC-002**: T019, T033, T046, T056, T064, T070, T073; evidence in
  `harness/evidence/revalidation.log`
- **SC-003**: T020, T034, T036, T046, T056, T057–T058, T068, T070, T073; evidence in
  `harness/evidence/revalidation.log`
- **SC-004**: T066, T070, T073; threshold is defined by NFR-001 and evidence
  is stored in `harness/evidence/revalidation.log`
- **SC-005**: T021, T036, T059, T066, T074; evidence in
  `harness/evidence/quickstart-validation.md`
- **SC-006**: T047–T049, T056, T066, T070, T073; evidence in
  `harness/evidence/revalidation.log`
- **Acceptance scenarios**: Covered by each story's independent test criteria
  and the contract, persistence, UI, acceptance, and quickstart tasks.

## Remediation Tasks

- [X] T077 [US1] Implement task-ID display, retrieval by ID, and editing of title, description, tags, and priority in the frontend components and API hook
- [X] T078 [US1] Replace placeholder UI coverage with component tests for fixed initial status, task-ID display, and edit submission in `frontend/tests/components/task.test.tsx`
- [X] T079 [US2] Expand contract and persistence tests for PUT/PATCH behavior, malformed requests, unknown fields, repeated queries, terminal transitions, idempotency, and persistence errors in `backend/tests/contract/tasks.test.ts` and `backend/tests/integration/persistence.test.ts`
- [X] T080 [P] Extend the executable performance check to measure all NFR-001 operations over the isolated 1,000-task dataset in `harness/checks/performance.mjs`
- [X] T081 [P] Extend executable traceability validation to require task mappings and automated test/check references for every FR, NFR, and SC, writing `harness/traceability.md`
- [X] T082 Reconcile persistence durability and startup validation with the approved plan by syncing atomic writes and validating the repository before the server listens in `backend/src/persistence/json-task-repository.ts` and `backend/src/server.ts`
- [X] T083 [P] Run the complete harness, dependency audit, and source test suites; preserve actual output under `harness/evidence/` and update `harness-log.md`
