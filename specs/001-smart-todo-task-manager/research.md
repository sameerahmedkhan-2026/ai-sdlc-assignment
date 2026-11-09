# Research: Smart Todo & Task Manager

## Decision: Separate frontend and backend applications

**Rationale**: The assignment requires a React/Vite/TypeScript web interface
and a Node.js/Express/TypeScript REST API. Separating them keeps UI concerns,
HTTP concerns, domain logic, and persistence independently testable while
preserving a single task collection.

**Alternatives considered**:

- A single server-rendered application was rejected because it would not meet
  the approved React/Vite frontend requirement.
- A monolithic frontend with browser-only persistence was rejected because the
  approved contract requires a REST API and server-side local JSON persistence.

## Decision: Layered backend with domain service and JSON repository

**Rationale**: Routes/controllers can translate HTTP requests and responses,
while a task service owns validation, transition rules, filtering, sorting, and
use-case behavior. A repository owns file access and atomic persistence. This
separation supports unit tests without requiring HTTP or filesystem setup for
every rule.

**Alternatives considered**:

- Direct file access in route handlers was rejected because it couples
  transport, business rules, and persistence and makes failure handling harder
  to test.
- A database was rejected because local JSON storage is an explicit scope and
  infrastructure constraint.

## Decision: JSON array with explicit creation-order metadata

**Rationale**: Store a versioned top-level document containing tasks and a
  monotonically increasing creation sequence. The sequence provides a stable
  tie-breaker for equal-priority sorting and survives restart. Writes use a
  temporary file followed by an atomic rename, with serialized write operations
  to prevent lost updates or partial JSON.

**Alternatives considered**:

- Sorting by generated ID was rejected because ID format is opaque and must not
  define user-visible creation order.
- In-place writes were rejected because an interrupted write can corrupt the
  only copy of the data.

## Decision: Explicit REST resource contract

**Rationale**: Use `/api/tasks` as the collection resource, with `GET`, `POST`,
  `PUT`, `PATCH`, and `DELETE` semantics documented in the contract. Query
  parameters are restricted to the approved tag filter and priority sort so
  malformed or unsupported requests fail deterministically.

**Alternatives considered**:

- A generic query language was rejected because it expands scope beyond the
  specification and increases validation surface.
- GraphQL was rejected because the approved interface is REST.

## Decision: Shared validation schema and domain error mapping

**Rationale**: The same validation and normalization rules must apply to the
  REST API and web interface. Domain errors map to stable error codes and the
  specified HTTP statuses at one backend boundary; unexpected errors become a
  generic server error without stack traces.

**Alternatives considered**:

- Separate frontend and backend validation rules were rejected because they can
  drift and produce inconsistent behavior.
- Returning raw exception messages was rejected because it can expose internal
  details.

## Decision: Test pyramid plus independent harness

**Rationale**: Unit tests cover pure validation, transitions, filtering, and
  sorting; API contract tests cover HTTP status, payload, and error behavior;
  persistence tests cover restart and atomic-write behavior; browser-level
  tests cover the primary UI journey. The independent harness runs lint,
  type-check, unit tests, contract tests, and security checks against the
  generated implementation and records actual output.

**Alternatives considered**:

- UI-only tests were rejected because they do not prove API contracts,
  persistence, or exact error handling.
- End-to-end-only testing was rejected because isolated domain failures would be
  slower and harder to diagnose.
