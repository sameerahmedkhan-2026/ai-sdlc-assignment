---

description: "Implementation tasks for the Part 1B Natural-Language Reminder Agent"
---

# Tasks: Natural-Language Reminder Agent

**Input**: Design documents from
`Part-1B/specs/001-natural-language-reminder-agent/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/`, and `quickstart.md`

**Testing**: Test-first execution is required. Tests and evaluation cases
must be created and run before corresponding implementation tasks.

## Phase 1: Setup

**Purpose**: Establish the isolated Part 1B package, scripts, configuration,
and evidence directories without implementing reminder behavior.

- [ ] T001 Create the Part 1B package structure in `Part-1B/package.json`, `Part-1B/tsconfig.json`, `Part-1B/src/`, `Part-1B/tests/`, `Part-1B/prompts/`, `Part-1B/evals/`, `Part-1B/.harness/`, and `Part-1B/evidence/`
- [ ] T002 [P] Configure TypeScript, linting, formatting, Vitest, and build scripts in `Part-1B/tsconfig.json`, `Part-1B/vitest.config.ts`, `Part-1B/eslint.config.js`, and `Part-1B/package.json`
- [ ] T003 [P] Configure environment examples and secret exclusions for the external model adapter in `Part-1B/.env.example`, `Part-1B/.gitignore`, and `Part-1B/src/config.ts`
- [ ] T004 [P] Create application and evaluation entry-point placeholders in `Part-1B/src/server.ts`, `Part-1B/src/api/`, `Part-1B/src/evaluation/`, and `Part-1B/.harness/run.sh`
- [ ] T005 [P] Add Part 1B commands and validation instructions to `Part-1B/README.md` and the root `README.md`
- [ ] T006 Capture the genuine pre-implementation Part 1B snapshot and baseline command results in `Part-1B/evidence/initial-generation/` before any repair or correction

**Checkpoint**: Part 1B tooling, environment configuration, and evidence
locations exist without feature implementation.

## Phase 2: Foundational

**Purpose**: Implement shared contracts, error categories, reference-time
handling, and validation infrastructure before any user story behavior.

**Critical**: No user story implementation may begin until this phase is
complete and its tests have run.

- [ ] T007 [P] Define public `ReminderRequest`, `ReminderInterpretation`, and stable error types in `Part-1B/src/domain/types.ts` according to `contracts/reminder-api.md`
- [ ] T008 [P] Define `EvaluationCase`, `EvaluationResult`, aggregate metrics, and threshold types in `Part-1B/src/evaluation/types.ts` according to `contracts/evaluation-result.md`
- [ ] T009 [P] Write schema-validation tests for exact fields, allowed intents, types, and nullability in `Part-1B/tests/unit/schema.test.ts`
- [ ] T010 [P] Write date/time and reference-context tests for ISO values, IANA timezones, relative dates, future-only reminders, and invalid times in `Part-1B/tests/unit/time-context.test.ts`
- [ ] T011 Implement the output schema validator and categorized validation errors in `Part-1B/src/validation/output-schema.ts` and `Part-1B/src/domain/errors.ts`
- [ ] T012 Implement deterministic reference-time and timezone normalization in `Part-1B/src/domain/time-context.ts`
- [ ] T013 [P] Write request-envelope and stable-error contract tests in `Part-1B/tests/contract/reminder-api.test.ts`
- [ ] T014 Implement request validation and stable error serialization in `Part-1B/src/api/request-validation.ts` and `Part-1B/src/api/error-handler.ts`
- [ ] T015 [P] Write redaction tests for API keys, authorization values, raw prompts, and provider stack details in `Part-1B/tests/unit/redaction.test.ts`
- [ ] T016 Implement evidence redaction and structured failure serialization in `Part-1B/src/evaluation/evidence.ts`
- [ ] T017 Run foundational tests and record genuine red/green results in `Part-1B/evidence/initial-generation/foundation-tests.log`

## Phase 3: User Story 1 - Create a Reminder (Priority: P1) 🎯 MVP

**Goal**: Interpret a clear natural-language request as a valid structured
`create` reminder.

**Independent Test**: Submit fixed-context requests with explicit and relative
future dates, then verify schema validity, subject fidelity, future
`remindAt`, and timezone preservation.

### Tests for User Story 1

- [ ] T018 [P] [US1] Create representative create-reminder evaluation cases with expected properties and semantic rubrics in `Part-1B/evals/dataset.json`
- [ ] T019 [P] [US1] Write create-intent unit tests for subject extraction, explicit times, relative times, timezone preservation, and future scheduling in `Part-1B/tests/unit/create-reminder.test.ts`
- [ ] T020 [P] [US1] Write API contract tests for `POST /api/reminders/interpret` create requests and exact response fields in `Part-1B/tests/contract/reminder-api.test.ts`
- [ ] T021 [US1] Run User Story 1 tests and capture genuine pre-implementation failures in `Part-1B/evidence/initial-generation/us1-red.log`

### Implementation for User Story 1

- [ ] T022 [P] [US1] Write reminder system prompt and structured-output instructions in `Part-1B/prompts/reminder-system.md`
- [ ] T023 [US1] Implement the external model configuration and provider-agnostic adapter in `Part-1B/src/llm/llm-client.ts` using environment credentials without logging secrets
- [ ] T024 [US1] Implement prompt construction with fixed reference time, timezone, schema rules, and one-request scope in `Part-1B/src/llm/prompt-builder.ts`
- [ ] T025 [US1] Implement create-intent interpretation and normalized output mapping in `Part-1B/src/domain/reminder-interpreter.ts`
- [ ] T026 [US1] Implement the interpretation endpoint in `Part-1B/src/api/reminder-routes.ts` and wire it through `Part-1B/src/server.ts`
- [ ] T027 [P] [US1] Implement the minimal reminder input and result display in `Part-1B/src/frontend/ReminderForm.tsx` and `Part-1B/src/frontend/ReminderResult.tsx`
- [ ] T028 [US1] Run User Story 1 unit, contract, and UI tests against the real application path and record results in `Part-1B/evidence/final-generation/us1-green.log`

## Phase 4: User Story 2 - Request Clarification (Priority: P1)

**Goal**: Safely clarify missing or ambiguous subject, schedule, timezone, or
reminder-reference information.

**Independent Test**: Submit incomplete and ambiguous requests and verify
`clarify`, a focused question, null unsupported values, and no invented time.

- [ ] T029 [P] [US2] Add missing-subject, missing-time, ambiguous-date, empty-input, and missing-context cases to `Part-1B/evals/dataset.json`
- [ ] T030 [P] [US2] Write clarification unit tests for mandatory-field detection, focused questions, nullability, and no invented dates in `Part-1B/tests/unit/clarification.test.ts`
- [ ] T031 [P] [US2] Extend API contract tests for clarification responses and invalid request errors in `Part-1B/tests/contract/reminder-api.test.ts`
- [ ] T032 [US2] Run User Story 2 tests and capture genuine pre-implementation failures in `Part-1B/evidence/initial-generation/us2-red.log`
- [ ] T033 [US2] Implement missing-information and ambiguity detection in `Part-1B/src/domain/clarification-rules.ts`
- [ ] T034 [US2] Implement focused clarification-question generation and nullability enforcement in `Part-1B/src/domain/reminder-interpreter.ts`
- [ ] T035 [US2] Render clarification questions and invalid-request errors in `Part-1B/src/frontend/ReminderResult.tsx` and `Part-1B/src/frontend/ErrorMessage.tsx`
- [ ] T036 [US2] Run User Story 2 unit, contract, and UI tests and record results in `Part-1B/evidence/final-generation/us2-green.log`

## Phase 5: User Story 3 - Reschedule or Snooze (Priority: P2)

**Goal**: Interpret reschedule and snooze requests without confusing them with
new reminder creation.

**Independent Test**: Submit clear reschedule and snooze requests with fixed
context and verify intent, target time or positive snooze duration, and
clarification for missing references.

- [ ] T037 [P] [US3] Add reschedule, snooze, missing-reference, invalid-duration, and past-target cases to `Part-1B/evals/dataset.json`
- [ ] T038 [P] [US3] Write reschedule and snooze unit tests for intent separation, target-time parsing, positive durations, and nullability in `Part-1B/tests/unit/reschedule-snooze.test.ts`
- [ ] T039 [P] [US3] Write API contract tests for reschedule and snooze response shapes in `Part-1B/tests/contract/reminder-api.test.ts`
- [ ] T040 [US3] Run User Story 3 tests and capture genuine pre-implementation failures in `Part-1B/evidence/initial-generation/us3-red.log`
- [ ] T041 [US3] Implement reschedule and snooze intent rules in `Part-1B/src/domain/reminder-interpreter.ts` and `Part-1B/src/domain/clarification-rules.ts`
- [ ] T042 [US3] Implement reschedule/snooze result rendering and categorized errors in `Part-1B/src/frontend/ReminderResult.tsx` and `Part-1B/src/frontend/ErrorMessage.tsx`
- [ ] T043 [US3] Run User Story 3 unit, contract, and UI tests and record results in `Part-1B/evidence/final-generation/us3-green.log`

## Phase 6: User Story 4 - Safety and Output Boundaries (Priority: P1)

**Goal**: Block unsupported, adversarial, malformed, or unsafe behavior.

**Independent Test**: Submit prompt-injection, unsupported-action, malformed,
secret-like, and invalid-model-output cases and verify safe bounded outcomes.

- [ ] T044 [P] [US4] Add prompt-injection, unsupported-action, tool-call, secret-like, malformed, timeout, and invalid-model-output cases to `Part-1B/evals/dataset.json`
- [ ] T045 [P] [US4] Write guardrail unit tests for untrusted input, no tools, no external actions, reject/clarify behavior, and secret redaction in `Part-1B/tests/unit/guardrails.test.ts`
- [ ] T046 [P] [US4] Write model-failure contract tests for invalid output, timeout, rate limit, unavailable service, and non-disclosing stable errors in `Part-1B/tests/contract/model-errors.test.ts`
- [ ] T047 [US4] Run User Story 4 tests and capture genuine pre-implementation failures in `Part-1B/evidence/initial-generation/us4-red.log`
- [ ] T048 [US4] Implement prompt-injection resistance, unsupported-action rejection, and no-tool-call guardrails in `Part-1B/src/domain/guardrails.ts`
- [ ] T049 [US4] Implement model timeout, rate-limit, invalid-output, and unavailable-service mapping in `Part-1B/src/llm/llm-errors.ts` and `Part-1B/src/api/error-handler.ts`
- [ ] T050 [US4] Implement output secret scanning and safe evidence redaction in `Part-1B/src/validation/safety-checks.ts` and `Part-1B/src/evaluation/evidence.ts`
- [ ] T051 [US4] Add security and excluded-scope checks for credentials, external actions, notifications, and calendar integrations in `Part-1B/.harness/security.sh`
- [ ] T052 [US4] Run User Story 4 unit and contract tests and record results in `Part-1B/evidence/final-generation/us4-green.log`

## Phase 7: User Story 5 - Evaluation Pipeline (Priority: P1)

**Goal**: Evaluate all generated outputs through one repeatable pipeline with
structural, invariant/property, and semantic/quality layers.

**Independent Test**: Run the evaluator against at least 15 cases and verify
per-case evidence, layer metrics, aggregate score, threshold decision, and
non-zero exit on failure.

- [ ] T053 [P] [US5] Write dataset-shape tests requiring at least 15 unique cases and all six required categories in `Part-1B/tests/unit/dataset.test.ts`
- [ ] T054 [P] [US5] Write structural evaluator tests for exact fields, types, enums, nullability, and invalid-output rejection in `Part-1B/tests/unit/structural-evaluator.test.ts`
- [ ] T055 [P] [US5] Write invariant/property evaluator tests for time validity, required clarification, safety, and no-tool rules in `Part-1B/tests/unit/property-evaluator.test.ts`
- [ ] T056 [P] [US5] Write semantic rubric tests for equivalent wording, subject meaning, temporal meaning, and clarification usefulness in `Part-1B/tests/unit/quality-evaluator.test.ts`
- [ ] T057 [US5] Run User Story 5 tests and capture genuine pre-implementation failures in `Part-1B/evidence/initial-generation/us5-red.log`
- [ ] T058 [P] [US5] Create the complete 15-case evaluation dataset with fixed reference times, expected properties, categories, and rubrics in `Part-1B/evals/dataset.json`
- [ ] T059 [US5] Implement structural evaluation and schema metrics in `Part-1B/src/evaluation/structural-evaluator.ts`
- [ ] T060 [US5] Implement invariant/property and safety evaluation in `Part-1B/src/evaluation/property-evaluator.ts`
- [ ] T061 [US5] Implement normalized semantic/quality scoring without exact string matching in `Part-1B/src/evaluation/quality-evaluator.ts`
- [ ] T062 [US5] Implement per-case evidence, aggregate metrics, threshold decision, and JSON output in `Part-1B/src/evaluation/evaluation-runner.ts`
- [ ] T063 [US5] Implement the single executable evaluation dispatcher in `Part-1B/.harness/run.sh` and `Part-1B/.harness/evaluate.ts`
- [ ] T064 [US5] Run the complete evaluation pipeline and write `Part-1B/evidence/eval-results.json` and `Part-1B/evidence/final-generation/harness.log`
- [ ] T065 [US5] Run User Story 5 tests and verify non-zero status for threshold or structural failures in `Part-1B/tests/integration/evaluation-pipeline.test.ts`

## Phase 8: Polish, Repair, and Final Review

**Purpose**: Complete cross-cutting validation, preserve genuine feedback,
repair failures, and obtain human acceptance.

- [ ] T066 [P] Add Part 1B lint, type-check, unit, contract, integration, security, dependency, evaluation, and traceability commands to `Part-1B/package.json` and `Part-1B/.harness/run.sh`
- [ ] T067 [P] Implement requirement-to-case and requirement-to-test traceability validation in `Part-1B/.harness/traceability.ts` and write `Part-1B/evidence/traceability.md`
- [ ] T068 [P] Add latency measurement and NFR-005 reporting to `Part-1B/src/evaluation/evaluation-runner.ts` and `Part-1B/evidence/eval-results.json`
- [ ] T069 Run the initial-generation harness and preserve actual structural, invariant, semantic, and service failures in `Part-1B/evidence/initial-generation/`
- [ ] T070 Feed genuine failed cases, outputs, failed properties, and evaluator results back to the coding agent in `Part-1B/evidence/feedback.md` without weakening requirements or removing cases
- [ ] T071 Repair confirmed application, prompt, parser, validator, or guardrail failures and document changed paths in `Part-1B/evidence/repairs.md`
- [ ] T072 Re-run the unchanged evaluation dataset and all mandatory quality gates, preserving final evidence in `Part-1B/evidence/final-generation/`
- [ ] T073 Update `Part-1B/evidence/harness-log.md` with model/configuration, threshold, scoring, failures, repairs, re-evaluation, limitations, and no-secret assurance
- [ ] T074 Run the complete `Part-1B/quickstart.md` validation guide and record actual outcomes in `Part-1B/evidence/quickstart-validation.md`
- [ ] T075 Perform final human review against the constitution, specification, plan, tasks, contracts, evaluation results, and limitations; record `ACCEPT` or `REJECT` in `Part-1B/evidence/final-review.md`

## Dependencies and Execution Order

- Phase 1 has no prerequisites.
- Phase 2 depends on Phase 1 and blocks all user stories.
- US1, US2, and US4 depend on Phase 2; US3 depends on US1's interpretation
  foundation.
- US5 depends on US1–US4 and provides the complete evaluation pipeline.
- Phase 8 depends on all stories and the evaluation pipeline.
- Within each story, tests and evaluation cases precede implementation, and
  green validation follows implementation.

## Parallel Opportunities

- T002–T005 can run in parallel after T001.
- T007–T010, T013, and T015 can run in parallel after setup.
- T018–T020 can run in parallel before T021.
- T029–T031, T037–T039, and T044–T046 can each run in parallel.
- T053–T056 can run in parallel before T057.
- T058–T061 can run in parallel after evaluator contracts exist.
- T066–T068 can run in parallel after the evaluation pipeline is available.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1 create-reminder behavior.
3. Validate US1 with fixed-context representative cases.
4. Demonstrate the minimum safe structured interpretation before completing
   clarification, rescheduling, snooze, guardrails, and evaluation.

### Incremental Delivery

1. Add US2 clarification behavior.
2. Add US3 reschedule/snooze intent.
3. Add US4 guardrails and categorized model failures.
4. Add US5 dataset, three-layer evaluator, evidence, repair, and final review.
5. Run the same full harness after every repair.

## Traceability Summary

| Requirement area | Tasks |
|---|---|
| Output schema and request contract | T007–T016, T019–T020, T054 |
| Create and time interpretation | T018–T028 |
| Clarification behavior | T029–T036 |
| Reschedule and snooze | T037–T043 |
| Safety and model failures | T044–T052 |
| Evaluation dataset and three-layer pipeline | T053–T065 |
| Thresholds, reproducibility, latency, and evidence | T066–T075 |

All tasks use the required checkbox, sequential ID, parallel marker where
valid, story label for story phases, and concrete repository paths.
