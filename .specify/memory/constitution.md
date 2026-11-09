<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.0.1
- Modified principles: all existing principles retained and normalized to the
  resolved constitution scaffold; no principle titles were renamed.
- Added sections: Technology and Engineering Constraints; Development Workflow
  and Quality Gates.
- Removed sections: none; existing governance content was retained.
- Follow-up TODOs: none.
-->

# AI-SDLC Assignment Constitution

## Core Principles

### I. Specification-First Development

- Every feature MUST originate from an approved specification.
- The project MUST follow the Spec Kit workflow: Constitution, Specify,
  Clarify, Plan, Tasks, Analyze where applicable, and Implement.
- Acceptance criteria MUST be measurable, unambiguous, and testable.
- Implementation MUST NOT begin before the relevant specification and plan are
  reviewed.

### II. TypeScript and Architectural Consistency

- Application code MUST use TypeScript.
- The frontend MUST use React with Vite.
- Backend APIs MUST use Node.js with Express.
- The architecture MUST maintain clear separation between UI, business logic,
  API routes, validation, and persistence.
- Modules MUST remain small, focused, reusable, and independently testable.
- Dependencies and architectural complexity MUST be justified by project needs.

### III. Test-First and Deterministic Correctness

- Tests MUST be derived directly from approved requirements and acceptance
  criteria.
- Part 1A tests MUST validate task CRUD operations, tag filtering, priority
  sorting, status transitions, and JSON persistence.
- Deterministic functionality MUST use exact assertions.
- Appropriate unit tests and API contract or integration tests MUST be
  included.
- Failing tests MUST NOT be removed or weakened merely to obtain a passing
  result.

### IV. Independent Harness and Quality Gates

- The project MUST maintain an independent harness for linting, security
  checks, and automated tests.
- The harness MUST validate the implementation against approved
  specifications.
- Mandatory quality gates MUST pass before final acceptance.
- Actual command output, failures, and test results MUST be captured as
  evidence.
- Genuine failure evidence MUST be provided to the coding agent for
  corrective implementation.
- The initial generated implementation MUST be preserved before
  harness-driven corrections.

### V. AI Behaviour and Evaluation Boundaries

- Part 1B MUST validate AI-generated outputs against a defined output schema.
- Structural invariants, behavioural properties, safety rules, and evaluation
  thresholds MUST be defined before final evaluation.
- Non-deterministic AI responses MUST NOT be evaluated solely through exact
  text matching.
- AI-generated outputs MUST be validated before any consequential action is
  taken.
- Missing or ambiguous mandatory information MUST result in clarification
  rather than unsupported assumptions.

### VI. Security and Data Protection

- API keys, credentials, tokens, and other secrets MUST NOT be hardcoded.
- Sensitive configuration MUST use environment variables.
- External inputs MUST be validated and sanitized.
- Errors MUST NOT expose internal implementation details or secrets.
- Appropriate dependency and static security checks MUST be applied.
- Security checks MUST NOT be bypassed to obtain a passing harness result.

### VII. Maintainability and Traceability

- Specifications, tasks, implementation, tests, and harness results MUST
  remain traceable to one another.
- The project MUST use clear naming, consistent formatting, and meaningful
  error messages.
- Setup, execution, and test instructions MUST be documented.
- Known limitations MUST be recorded honestly.
- Implementation and validation evidence MUST be preserved throughout
  development.

## Technology and Engineering Constraints

- Language: TypeScript.
- Frontend: React and Vite.
- Backend: Node.js and Express.
- Part 1A persistence MUST use JSON-based storage as defined by its approved
  specification.
- Part 1B AI integration MUST use an external LLM API with validated,
  structured outputs.
- Application settings and API credentials MUST use environment-based
  configuration.
- Git MUST be used for version control, with meaningful development history
  retained.
- Part 1A and Part 1B implementations and evidence MUST remain clearly
  separated.

## Development Workflow and Quality Gates

1. Establish and review the project constitution.
2. Create and clarify feature specifications.
3. Prepare and review technical plans.
4. Generate implementation tasks from approved plans.
5. Analyze specifications and plans for inconsistencies where applicable.
6. Use GitHub Copilot to implement approved tasks.
7. Run the independent harness against the generated implementation.
8. Record actual failures and provide actionable feedback to the coding agent.
9. Apply corrections and rerun the same validation checks.
10. Perform a final human review and record an explicit ACCEPT or REJECT
    decision.

The coding agent MUST NOT independently change approved acceptance criteria,
delete failing tests, disable mandatory checks, or alter recorded evidence to
obtain a passing result.

## Governance

This constitution governs both Part 1A and Part 1B of the AI-SDLC assignment
and supersedes conflicting project practices.

Any amendment MUST document the reason for the change, identify affected
principles or constraints, update the version and amendment date, and preserve
an impact report for human review. Changes affecting application behaviour
MUST be reflected in the relevant upstream specification and associated
artifacts before implementation.

Constitution versions MUST follow semantic versioning:

- MAJOR for backward-incompatible governance changes, including removing or
  redefining a principle.
- MINOR for adding a principle or materially expanding governance requirements.
- PATCH for clarifications, wording changes, reorganizations, and typo fixes
  that do not alter project obligations.

Every implementation review, pull request, and harness run MUST verify
compliance with this constitution. Non-compliance MUST be recorded and
resolved, or explicitly accepted by the human reviewer before final
acceptance. Automated harness success does not replace human review; final
acceptance remains the responsibility of the human reviewer.

**Version**: 1.0.1 | **Ratified**: 2026-11-03 | **Last Amended**: 2026-11-03
