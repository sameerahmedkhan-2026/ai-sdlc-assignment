# Research: Natural-Language Reminder Agent

## Decision: Provider-agnostic external LLM adapter

**Decision**: Call an external LLM through a small OpenAI-compatible HTTP
adapter configured by environment variables.

**Rationale**: The constitution requires an external LLM API, while the
assignment does not require a specific vendor. Keeping provider details behind
one adapter avoids coupling the reminder domain to a vendor SDK and makes
service failures distinguishable from application failures.

**Alternatives considered**:

- A provider-specific SDK was rejected because it adds unnecessary coupling for
  a small assignment.
- A local deterministic parser was rejected because it would not demonstrate
  meaningful non-deterministic AI behavior.
- A fully autonomous agent with calendar tools was rejected because external
  consequential actions are explicitly out of scope.

## Decision: Local schema and invariant validation

**Decision**: Validate the model response locally against the exact output
schema before any semantic scoring or user response.

**Rationale**: Structural validity, nullability, allowed intents, date/time
rules, and safety boundaries must remain deterministic even when model wording
varies. Invalid model output must never be treated as a successful
interpretation.

**Alternatives considered**:

- Trusting model JSON without validation was rejected because malformed or
  expanded output would violate the contract.
- Using semantic scoring as the first gate was rejected because a semantically
  plausible output can still contain unsafe fields or invalid dates.

## Decision: Rubric-based semantic evaluation

**Decision**: Use case-specific expected properties and normalized semantic
  comparisons for intent, subject meaning, temporal meaning, and clarification
  usefulness.

**Rationale**: The assignment requires evaluation that does not depend on
  exact generated wording. A deterministic rubric keeps results inspectable and
  avoids making an LLM judge the only source of truth.

**Alternatives considered**:

- Exact string matching was rejected because equivalent natural-language
  responses can be correct.
- An LLM-as-a-judge-only approach was rejected because it can hide structural
  or safety failures and introduces another nondeterministic dependency.

## Decision: Fixed evaluation context

**Decision**: Every dataset case declares a reference time, timezone, expected
  properties, and semantic rubric.

**Rationale**: Relative dates must be reproducible without removing model
  variation. Fixed context also makes failures comparable between initial and
  repaired generations.

**Alternatives considered**:

- Using the evaluator's current clock was rejected because results would drift
  across runs.
- Requiring exact model text was rejected because it would over-constrain
  acceptable behavior.
