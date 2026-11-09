# Feature Specification: Smart Todo & Task Manager

**Feature Branch**: `001-smart-todo-task-manager`

**Created**: 2026-11-03

**Status**: Draft

**Input**: User description: "Create a specification for Part 1A of my BITS AI-Augmented SDLC assignment: Smart Todo & Task Manager."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and view tasks (Priority: P1)

As a task manager user, I want to create a task and retrieve it later so that
my work is recorded and available for review.

**Why this priority**: Task creation and retrieval are the minimum viable
workflow for a useful task manager.

**Independent Test**: Submit a valid task creation request, verify the successful
response contains a unique identifier and the stored fields, then retrieve that
identifier and compare the returned task with the created task.

**Acceptance Scenarios**:

1. **Given** the task manager is available, **When** a user submits a title and
   valid task attributes, **Then** the system creates one task, assigns a
   unique identifier, and returns the complete task representation.
2. **Given** a task exists, **When** the user requests its identifier, **Then**
   the system returns the task with all stored fields.
3. **Given** a request contains a missing title, empty title, invalid priority,
   invalid status, or malformed field type, **When** the request is submitted,
   **Then** the system rejects it without creating a task and identifies the
   invalid input.

---

### User Story 2 - Manage the task collection (Priority: P1)

As a task manager user, I want to list, update, and delete tasks so that the
collection reflects my current work.

**Why this priority**: Managing existing tasks is essential for maintaining
accurate work information.

**Independent Test**: Create a task, list it, update its details, retrieve the
updated representation, delete it, and verify that a later retrieval reports
that it no longer exists.

**Acceptance Scenarios**:

1. **Given** zero or more tasks exist, **When** the user requests the task
   collection, **Then** the system returns a successful response containing
   every task exactly once.
2. **Given** a task exists, **When** the user submits a valid update for that
   task, **Then** the system persists the changed fields and returns the
   resulting task.
3. **Given** a task exists, **When** the user deletes its identifier, **Then**
   the system removes it and returns a successful deletion response.
4. **Given** an identifier does not identify a stored task, **When** the user
   requests, updates, or deletes it, **Then** the system returns a not-found
   response and leaves all stored tasks unchanged.

---

### User Story 3 - Find and order tasks (Priority: P2)

As a task manager user, I want to filter tasks by tags and sort them by
priority so that I can focus on the most relevant work.

**Why this priority**: Filtering and ordering make a growing task collection
practical to use.

**Independent Test**: Create tasks with overlapping tags and different
priorities, request filtered and sorted collections, and compare the results
with the defined matching and tie-breaking rules.

**Acceptance Scenarios**:

1. **Given** tasks have zero or more tags, **When** the user requests one or
   more tags, **Then** the response contains only tasks containing every
   requested tag.
2. **Given** multiple tasks have priorities, **When** the user requests a
   priority sort, **Then** tasks are returned in the defined priority order,
   with equal-priority tasks ordered deterministically.
3. **Given** no task matches the requested tags, **When** the filtered
   collection is requested, **Then** the system returns a successful empty
   collection rather than an error.

---

### User Story 4 - Use valid task statuses (Priority: P2)

As a task manager user, I want status changes to follow defined transitions so
that task progress remains consistent.

**Why this priority**: Status consistency prevents contradictory or unsupported
task states.

**Independent Test**: Create a task, attempt each allowed and disallowed status
transition, and verify the resulting status and error response.

**Acceptance Scenarios**:

1. **Given** a task is in a valid status, **When** the user requests an allowed
   transition, **Then** the system persists the new status.
2. **Given** a task is in a valid status, **When** the user requests a
   disallowed transition, **Then** the system rejects the request without
   changing the task.
3. **Given** a request contains an unknown status, **When** it is submitted,
   **Then** the system rejects it as invalid input.

### Edge Cases

- A title containing leading or trailing whitespace is normalized before
  validation and storage; a title that is empty after normalization is invalid.
- A description is optional; when omitted it is represented consistently as an
  empty value in responses.
- Tags are optional. Tags are trimmed, case-sensitive, unique within a task,
  and an empty tag is invalid after trimming.
- Duplicate requested filter tags are treated as one tag.
- An empty tag-filter value, unknown query parameter, malformed query value,
  or invalid sort value is rejected as a malformed request.
- IDs with the wrong format and syntactically valid but unknown IDs both return
  differentiated errors: malformed IDs return `400 Bad Request`, while
  syntactically valid but unknown IDs return `404 Not Found` for retrieval,
  update, and deletion.
- A request with malformed JSON, an unsupported content type, or an unexpected
  field is rejected without changing persisted data.
- If the JSON data file is absent at startup, the system starts with an empty
  collection and creates the file before the first successful write.
- If persisted JSON is malformed or cannot be read, the system reports a
  startup or persistence error and MUST NOT silently overwrite the data.
- Restarting the application preserves every successfully persisted task,
  including its identifier, tags, priority, status, and description.
- Concurrent writes MUST NOT produce invalid JSON or lose a previously
  successful task update.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a web interface through which a user can
  create, view, list, update, delete, filter, and sort tasks.
- **FR-002**: The system MUST provide REST operations for creating a task,
  retrieving a task by ID, listing tasks, updating a task, and deleting a task.
- **FR-003**: A task MUST contain a unique ID, a non-empty title, a
  description, zero or more tags, a priority, and a status.
- **FR-004**: The system MUST accept an optional description and MUST reject a
  description whose value is not a string.
- **FR-005**: The system MUST accept tags as an array of non-empty strings,
  trim each tag, preserve tag case, and reject non-array or non-string tag
  values.
- **FR-006**: The system MUST accept only the priority values `High`, `Medium`,
  and `Low`, ordered from highest to lowest urgency as High, Medium, Low.
- **FR-007**: The system MUST accept only the statuses `To Do`, `In Progress`,
  `Done`, and `Cancelled`. Every newly created task MUST start in `To Do`.
  Clients MUST NOT supply `status` in a creation request; an explicitly
  supplied creation status MUST be rejected as a validation error. The only
  allowed transitions are `To Do` to `In Progress`, and `In Progress` to
  either `Done` or `Cancelled`. Tasks in `Done` or `Cancelled` MUST NOT
  transition to another status. Updating a task to its existing status MUST
  be accepted idempotently.
- **FR-008**: The system MUST reject missing required fields, invalid field
  types, invalid enum values, unexpected fields, malformed JSON, and invalid
  identifiers without changing stored data.
- **FR-009**: The system MUST return HTTP `201 Created` after successful task
  creation, including the complete created task and its unique ID.
- **FR-010**: The system MUST return HTTP `200 OK` with the requested task for
  successful retrieval, listing, and update operations.
- **FR-011**: The system MUST return HTTP `204 No Content` after successful
  deletion and MUST return no task body in that response.
- **FR-012**: The system MUST return HTTP `400 Bad Request` for malformed
  requests or invalid field values, `404 Not Found` for unknown task IDs, and
  `409 Conflict` when a valid request violates the status-transition rules.
- **FR-013**: The system MUST return structured error responses containing a
  stable error code and a human-readable message, without stack traces or
  sensitive implementation details.
- **FR-014**: The system MUST list every stored task exactly once when no filter
  is supplied.
- **FR-015**: The system MUST filter by one or more tags using an
  all-requested-tags match. Matching MUST be case-sensitive and deterministic.
- **FR-016**: The system MUST sort by priority in descending urgency order
  according to the defined priority ordering. Equal-priority tasks MUST use
  creation order as the tie-breaker, with older tasks first.
- **FR-017**: The system MUST support full replacement through `PUT`, requiring
  every editable task field and replacing the previous values, and partial
  update through `PATCH`, changing only supplied editable fields while
  retaining omitted values. Both operations MUST enforce the same validation
  and status-transition rules.
- **FR-018**: Every successful create, update, and delete MUST be durably
  persisted to the local JSON data store before the success response is sent.
- **FR-019**: The system MUST load persisted tasks on startup and MUST preserve
  them across a normal application restart.
- **FR-020**: The web interface MUST display validation and API errors clearly
  enough for a user to identify the failed operation and corrective input.
- **FR-021**: The system MUST NOT include authentication, notifications,
  external AI integrations, cloud infrastructure, or features outside this
  specification.

### Non-Functional Requirements

- **NFR-001**: For a collection of up to 1,000 tasks, 95% of valid list,
  filter, sort, create, retrieve, update, and delete requests MUST receive a
  response within 500 milliseconds in the local test environment.
- **NFR-002**: The system MUST preserve valid JSON structure after every
  successful write and MUST retain all previously successful records after
  restart.
- **NFR-003**: Repeating the same read request against unchanged data MUST
  produce the same status, record set, and ordering.
- **NFR-004**: Automated unit tests and API contract tests MUST cover every
  functional requirement, all documented HTTP outcomes, and the listed edge
  cases.

### Key Entities

- **Task**: A unit of work identified by a unique ID, with title, optional
  description, tags, priority, status, and creation order metadata used for
  deterministic ordering.
- **Tag**: A case-sensitive, trimmed label associated with a task and used for
  collection filtering.
- **Priority**: A constrained task urgency value with a defined total ordering.
- **Status**: A constrained task lifecycle value with a defined set of
  permitted transitions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a valid task, see its assigned ID, and retrieve
  the same task through the web interface in one completed workflow.
- **SC-002**: 100% of valid create, retrieve, list, update, and delete
  acceptance scenarios pass their automated contract tests.
- **SC-003**: 100% of invalid-ID, missing-field, invalid-priority,
  invalid-status, malformed-request, and disallowed-transition scenarios
  return the specified error class and leave data unchanged.
- **SC-004**: The performance outcome defined by NFR-001 is met: for a dataset
  of 1,000 tasks, at least 95% of measured standard operations complete within
  500 milliseconds in the local test environment.
- **SC-005**: After a normal restart, 100% of tasks that received a successful
  persistence response remain retrievable with identical field values.
- **SC-006**: Repeated filter and priority-sort requests over unchanged data
  return identical task IDs in identical order.

## Assumptions

- The application has one shared local task collection; authentication and
  user-specific ownership are out of scope.
- Unique IDs are generated by the system and are opaque to users.
- The default list operation returns tasks in creation order unless a filter or
  sort is explicitly requested.
- The priority values are `High`, `Medium`, and `Low`, and a newly created task
  defaults to `Medium` if priority is omitted.
- A newly created task defaults to `To Do`; status transitions follow the
  specified forward-only lifecycle.
- `PUT` and `PATCH` are both available for updates, as defined in FR-017.
- The web interface and REST operations represent the same task collection and
  validation rules.
- The local environment provides permission to read and write the configured
  JSON data file.
- A normal restart means the process stops without an active write and starts
  again using the same data-file location.
- No migration of legacy data formats is required for the initial release.
