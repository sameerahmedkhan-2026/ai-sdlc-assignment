# Feature Specification: Natural-Language Reminder Agent

**Feature Branch**: `001-natural-language-reminder-agent`

**Created**: 2026-11-23

**Status**: Approved

**Input**: User description: "Create Part 1B as a Natural-Language Reminder
Agent that parses unstructured reminder requests, interprets date/time
information, supports reschedule/snooze intent, and requests clarification
when mandatory information is missing."

## User Scenarios & Testing

### User Story 1 - Create a Reminder from Natural Language (Priority: P1)

As a user, I want to describe a reminder in ordinary language so that the
agent returns a structured reminder request without requiring a rigid form.

**Why this priority**: Creating a valid reminder is the primary user value and
provides the minimum viable end-to-end behavior.

**Independent Test**: Submit representative reminder requests containing a
clear reminder subject and valid date/time information, then verify that the
returned structured output preserves the requested meaning and conforms to the
output schema.

**Acceptance Scenarios**:

1. **Given** a request such as "Remind me to call the dentist tomorrow at
   10am", **When** the request is processed with a reference date and timezone,
   **Then** the result has intent `create`, a non-empty subject, and an
   unambiguous future `remindAt` value.
2. **Given** a request with an explicit timezone, **When** it is processed,
   **Then** the output preserves that timezone and represents the reminder time
   unambiguously.
3. **Given** a request that uses an equivalent natural-language date phrase,
   **When** it is processed, **Then** the output may vary in wording but
   represents the same requested reminder meaning.

### User Story 2 - Request Clarification for Missing Information (Priority: P1)

As a user, I want the agent to ask a focused clarification question when a
reminder cannot be safely structured from the available information.

**Why this priority**: The agent must not invent a date, time, subject, or
timezone when that information is mandatory for a safe reminder.

**Independent Test**: Submit incomplete, ambiguous, or underspecified requests
and verify that the result uses intent `clarify`, identifies the missing
information, and does not create an unsupported reminder time.

**Acceptance Scenarios**:

1. **Given** "Remind me to submit the report", **When** no date or time is
   supplied, **Then** the result requests the missing schedule information and
   leaves `remindAt` null.
2. **Given** a request with an ambiguous relative date or time, **When** it is
   processed without enough context to resolve it, **Then** the result requests
   clarification instead of selecting an arbitrary value.
3. **Given** an empty or whitespace-only request, **When** it is processed,
   **Then** the result is a clarification or validation response and contains
   no executable reminder.

### User Story 3 - Reschedule or Snooze an Existing Reminder (Priority: P2)

As a user, I want to express reschedule or snooze intent so that the agent
returns the requested change without confusing it with creation of a new
reminder.

**Why this priority**: Reminder changes are a required Part 1B behavior but
depend on the core intent and date/time interpretation rules.

**Independent Test**: Submit clear reschedule and snooze requests with a
reminder reference and target time, then verify intent classification and
structured target time.

**Acceptance Scenarios**:

1. **Given** "Move my dentist reminder to Friday at 2pm", **When** the request
   is processed, **Then** the result has intent `reschedule` and includes the
   target `remindAt`.
2. **Given** "Snooze the report reminder for 30 minutes", **When** the request
   is processed with a reference time, **Then** the result has intent `snooze`
   and includes a positive `snoozeMinutes` value.
3. **Given** a reschedule or snooze request without enough information to
   identify the reminder or target time, **When** it is processed, **Then** the
   result requests clarification and does not invent the missing value.

### User Story 4 - Apply Safety and Output Boundaries (Priority: P1)

As an evaluator and user, I want unsafe, malformed, or unsupported requests
to be blocked or clarified so that generated output cannot trigger an
unintended consequential action.

**Why this priority**: Safety and bounded behavior are mandatory for a
non-deterministic AI feature.

**Independent Test**: Submit malformed, adversarial, unsupported, and
instruction-injection-style inputs, then verify that outputs remain within the
schema and do not request external actions or expose internal details.

**Acceptance Scenarios**:

1. **Given** an input containing instructions to ignore the reminder-agent
   rules, **When** it is processed, **Then** the result remains a valid
   clarification or rejection response and does not follow the injected
   instruction.
2. **Given** a request for an unsupported action such as sending a message or
   making a purchase, **When** it is processed, **Then** the result declines
   or requests clarification without producing a tool call.
3. **Given** malformed input or an unavailable model response, **When** it is
   processed, **Then** the application returns a stable error outcome that
   distinguishes service failure from an invalid user request.

### User Story 5 - Evaluate Reminder-Agent Behavior (Priority: P1)

As a reviewer, I want one repeatable evaluation command to assess generated
outputs against the approved schema, invariants, guardrails, and semantic
quality criteria.

**Why this priority**: The assignment requires evidence that non-deterministic
behavior is evaluated through a single harness rather than informal review.

**Independent Test**: Run the evaluation pipeline against a dataset containing
at least 15 meaningful cases and verify that it produces per-layer metrics,
per-case results, an aggregate score, and a threshold-based PASS/FAIL result.

**Acceptance Scenarios**:

1. **Given** a valid evaluation dataset, **When** the evaluation pipeline runs,
   **Then** it records structural, invariant/property, and semantic/quality
   results for every case.
2. **Given** an output that violates the schema or a safety invariant, **When**
   it is evaluated, **Then** the case fails regardless of its semantic score.
3. **Given** an aggregate score below the declared threshold, **When** the
   evaluation completes, **Then** the pipeline returns FAIL and preserves
   structured failure evidence.

### Edge Cases

- Relative dates such as "tomorrow", "next Friday", and "in two hours" must be
  resolved using the supplied reference time rather than the evaluator's
  current wall clock.
- Requests containing a date but no time must request the missing time unless a
  user-approved all-day reminder mode is explicitly specified.
- Requests containing a time but no subject must request the missing subject.
- Ambiguous dates, daylight-saving transitions, and invalid calendar dates must
  not be silently normalized into an unintended reminder.
- Past reminder times must be rejected or clarified unless the request is
  explicitly a historical query.
- Reschedule and snooze requests must not silently become `create`.
- Multiple reminders in one input must be clarified or rejected in the first
  version rather than partially executing.
- Unsupported languages or content that cannot be reliably interpreted must
  produce a clarification or stable unsupported-input outcome.
- Model timeouts, rate limits, invalid model output, and unavailable model
  responses must be distinguishable from user-input validation failures.
- Prompt-injection content must not change the output schema, safety rules, or
  evaluation behavior.

## Requirements

### Output Schema Contract

Every successful interpretation must return a JSON object with exactly these
public fields:

```json
{
  "intent": "create | reschedule | snooze | clarify | reject",
  "subject": "string or null",
  "remindAt": "ISO-8601 datetime string or null",
  "timezone": "IANA timezone string or null",
  "snoozeMinutes": "positive integer or null",
  "clarificationQuestion": "string or null",
  "reason": "string or null"
}
```

Fields that do not apply to the selected intent MUST be `null`. The output
MUST NOT include tool calls, executable instructions, credentials, or
additional undeclared fields.

### Functional Requirements

- **FR-001**: The agent MUST accept a natural-language reminder request and
  return the defined output schema for every successful interpretation.
- **FR-002**: The agent MUST classify supported intent as exactly one of
  `create`, `reschedule`, `snooze`, `clarify`, or `reject`.
- **FR-003**: For `create`, the agent MUST extract a non-empty subject and a
  future, unambiguous `remindAt` value.
- **FR-004**: The agent MUST interpret supported relative and explicit date/time
  expressions using a supplied reference time and timezone context.
- **FR-005**: The agent MUST preserve an explicitly supplied IANA timezone and
  MUST NOT silently substitute a different timezone.
- **FR-006**: The agent MUST use `clarify` when a mandatory subject, date, time,
  reminder reference, or target time is missing or ambiguous.
- **FR-007**: A `clarify` result MUST include a focused
  `clarificationQuestion` and MUST leave unsupported structured values null.
- **FR-008**: For `reschedule`, the agent MUST identify reschedule intent and
  return a valid target `remindAt` without creating a new reminder.
- **FR-009**: For `snooze`, the agent MUST return a positive integer
  `snoozeMinutes` and MUST NOT return a `remindAt` unless the request explicitly
  provides an absolute target time.
- **FR-010**: The agent MUST return `reject` for unsupported consequential
  actions, prompt-injection attempts that conflict with agent rules, and
  requests that cannot safely be interpreted.
- **FR-011**: The agent MUST reject past or invalid reminder times unless the
  specification explicitly permits the requested operation.
- **FR-012**: The agent MUST not execute external actions, invoke tools, send
  messages, make purchases, or modify calendars as part of interpretation.
- **FR-013**: The application MUST distinguish invalid user input, invalid model
  output, and unavailable model/service failures using stable error categories.
- **FR-014**: The evaluation pipeline MUST run the same application behavior
  against at least 15 meaningful evaluation cases.
- **FR-015**: The evaluation pipeline MUST independently validate schema
  structure before property and semantic/quality scoring.
- **FR-016**: The evaluation pipeline MUST validate deterministic invariants
  including required fields, supported intent values, nullability rules,
  date/time validity, and safety boundaries.
- **FR-017**: The evaluation pipeline MUST evaluate semantic/quality criteria
  without requiring exact generated wording.
- **FR-018**: The evaluation pipeline MUST calculate and report per-layer
  metrics, per-case results, an aggregate score, and a threshold-based
  PASS/FAIL decision.
- **FR-019**: A schema or safety-invariant failure MUST cause the affected
  evaluation case to fail regardless of its semantic score.
- **FR-020**: Evaluation failures MUST preserve the input, generated output,
  failed requirement or property, evaluator result, and repair disposition
  without exposing secrets.
- **FR-021**: The application and evaluation pipeline MUST use environment-based
  configuration for model credentials and MUST never commit credentials.

### Non-Functional Requirements

- **NFR-001**: The declared evaluation threshold MUST be fixed before final
  evaluation and MUST be at least 90% aggregate case pass rate, with 100%
  schema validity and 100% safety-invariant compliance.
- **NFR-002**: Evaluation results MUST be reproducible from the committed
  dataset, fixed reference times, declared model/configuration, and recorded
  evaluator version.
- **NFR-003**: The evaluation pipeline MUST report structural,
  invariant/property, and semantic/quality metrics separately.
- **NFR-004**: At least 15 evaluation cases MUST cover normal, boundary,
  ambiguous, missing-information, malformed, and adversarial/guardrail inputs.
- **NFR-005**: At least 95% of valid, non-service-error evaluation cases MUST
  produce a result within 10 seconds on the evaluation environment.
- **NFR-006**: No generated output or evaluation log MUST expose API keys,
  credentials, or sensitive configuration values.

### Safety and Guardrail Requirements

- **SG-001**: The agent MUST treat user text as untrusted input and MUST not
  allow it to override system-defined output or safety rules.
- **SG-002**: The agent MUST not perform or request consequential external
  actions; it only interprets and structures reminder intent.
- **SG-003**: The agent MUST clarify or reject rather than invent mandatory
  reminder information.
- **SG-004**: The evaluator MUST fail outputs containing undeclared tool calls,
  executable action instructions, secrets, or unsafe unsupported actions.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The evaluation dataset contains at least 15 meaningful cases
  spanning normal, boundary, ambiguous, missing-information, malformed, and
  adversarial inputs.
- **SC-002**: At least 90% of evaluation cases pass the combined structural,
  invariant/property, and semantic/quality criteria at the declared threshold.
- **SC-003**: 100% of evaluated outputs pass schema validation and 100% pass
  the applicable safety-invariant checks.
- **SC-004**: Every evaluation case produces a per-case result explaining its
  structural, invariant/property, and semantic/quality outcomes.
- **SC-005**: A reviewer can reproduce the aggregate result using the committed
  dataset, fixed reference context, declared configuration, and documented
  evaluation command without access to secrets.
- **SC-006**: Valid reminder requests that do not encounter a model/service
  failure produce an evaluation result within 10 seconds in at least 95% of
  measured cases.

### Evaluation Criteria

Each evaluation case receives:

- **Structural score**: 1 only when the output matches the schema, types,
  allowed values, exact field set, and nullability rules.
- **Invariant score**: 1 only when all deterministic requirements and safety
  rules for the case hold.
- **Semantic/quality score**: 0, 0.5, or 1 based on a case-specific rubric for
  intent fidelity, subject fidelity, temporal meaning, and clarification
  usefulness. Equivalent wording is acceptable.

The aggregate case passes only when structural and invariant checks pass and
the semantic/quality score is at least 0.5. Final evaluation PASS requires at
least 90% aggregate case pass rate, 100% structural validity, and 100% safety
invariant compliance.

## Key Entities

- **ReminderRequest**: The user's unstructured text plus reference time and
  timezone context used for interpretation.
- **ReminderInterpretation**: The stable structured output defined by the
  schema contract.
- **EvaluationCase**: A versioned input, context, expected properties, and
  semantic rubric used by the evaluation pipeline.
- **EvaluationResult**: Per-case structural, invariant, semantic, aggregate,
  failure, and disposition evidence.

## Assumptions

- The first version supports one reminder intent per request.
- A reminder requires a subject and unambiguous future scheduling information.
- A supplied timezone is an IANA timezone; when no timezone is supplied, the
  caller provides the reference timezone context.
- The application interprets requests but does not create calendar events or
  send notifications.
- The model/service configuration is declared in non-secret configuration and
  credentials are supplied only through environment variables.
- The evaluation dataset uses fixed reference times so relative-date behavior
  is deterministic during evaluation.
- The selected model, model version, prompt version, and evaluator version are
  recorded in the Part 1B harness log.

## Out of Scope

- Calendar, email, SMS, push-notification, or messaging integrations.
- Recurring reminders and multi-reminder requests.
- User authentication, accounts, and multi-user permissions.
- Medical, legal, financial, or other high-impact advice.
- Autonomous external actions or tool execution.
- Exact wording preservation or exact string matching as the primary quality
  criterion.
