# Implementation Plan: Natural-Language Reminder Agent

**Branch**: `001-natural-language-reminder-agent` | **Date**: 2026-11-23 |
**Spec**: [spec.md](./spec.md)

**Input**: Feature specification from
`Part-1B/specs/001-natural-language-reminder-agent/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Part 1B provides a natural-language reminder agent that interprets one
reminder request at a time into a stable structured result. The application
will call an external LLM through a provider-agnostic adapter, validate the
returned structure and deterministic safety invariants locally, and expose the
behavior through a small web/API surface. A single evaluation runner will
execute at least 15 fixed cases and report structural, invariant/property, and
semantic/quality results against the declared threshold.

## Technical Context

**Language/Version**: TypeScript 5.7 on Node.js 20+

**Primary Dependencies**: React, Vite, Express, Ajv, Vitest, and native
`fetch`; an OpenAI-compatible external LLM endpoint accessed through a small
adapter

**Storage**: No application persistence in the first version; fixed evaluation
data in `evals/dataset.json` and generated results in `evidence/`

**Testing**: Vitest unit/contract tests plus the single evaluation runner

**Target Platform**: Local Node.js process with a browser-based local UI

**Project Type**: Web application and evaluation harness

**Performance Goals**: At least 95% of valid, non-service-error evaluation
cases produce a result within 10 seconds

**Constraints**: Minimum 90% aggregate case pass rate, 100% schema validity,
100% safety-invariant compliance, no committed secrets, fixed reference times,
and no external consequential actions

**Scale/Scope**: One request at a time, one user, one external model adapter,
and at least 15 evaluation cases covering all required categories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Plan evidence |
|---|---|---|
| Specification-first development | PASS | Uses the approved Part 1B specification before implementation. |
| TypeScript and architectural consistency | PASS | Separates React UI, Express API, interpretation service, validation, and external model adapter. |
| Test-first and deterministic correctness | PASS | Unit/contract tests and fixed-context evaluation cases precede implementation work. |
| Independent harness and quality gates | PASS | One runner executes schema, invariant, semantic, threshold, security, and evidence checks. |
| AI behavior and evaluation boundaries | PASS | Schema, invariants, guardrails, scoring, and threshold are defined in the specification. |
| Security and data protection | PASS | Credentials use environment variables; outputs are checked for secrets and unsafe actions. |
| Maintainability and traceability | PASS | Requirements, evaluation cases, tests, results, and repairs are linked and preserved. |

No constitution violations require a complexity exception.

## Project Structure

### Documentation (this feature)

```text
Part-1B/specs/001-natural-language-reminder-agent/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── reminder-api.md
│   └── evaluation-result.md
└── tasks.md
```

### Source Code

```text
Part-1B/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── api/
│   ├── domain/
│   ├── evaluation/
│   ├── llm/
│   │   └── response-parser.ts
│   ├── validation/
│   ├── frontend/
│   │   └── main.tsx
│   └── server.ts
├── prompts/
│   └── reminder-system.md
├── tests/
│   ├── unit/
│   ├── contract/
│   └── integration/
├── evals/
│   └── dataset.json
├── .harness/
│   ├── run.sh
│   ├── evaluate.ts
│   ├── security.sh
│   └── traceability.ts
│   ├── schema/
│   ├── property/
│   └── quality/
└── evidence/
    ├── initial-generation/
    ├── final-generation/
    ├── eval-results.json
    └── harness-log.md
```

**Structure Decision**: Keep Part 1B isolated under `Part-1B/`. The backend
owns request handling, model calls, parsing, and validation; the React UI
provides a demonstrable user surface; the evaluation runner consumes the same
application behavior as the UI/API; and evidence is kept separate from source.

## Architecture and Data Flow

1. The user submits reminder text, reference time, and timezone context.
2. The API validates the request envelope and passes it to the interpretation
   service.
3. The interpretation service sends a constrained prompt to the external LLM
   adapter.
4. The response parser extracts JSON only and rejects malformed or extra
   content, then the schema validator checks the exact output shape.
5. Deterministic invariant and guardrail checks validate intent, nullability,
   date/time rules, and prohibited actions.
6. The API returns the validated interpretation or a stable categorized error.
7. The evaluation runner submits each dataset case through the same service,
   executes all three evaluation layers, and writes per-case and aggregate
   evidence.

The model adapter is the only module aware of provider request details.
Credentials, endpoint, model, timeout, and prompt version are configured
through environment variables or non-secret configuration.

## Phase 0 Research Decisions

Research findings are recorded in [research.md](./research.md). The selected
approach is:

- Use an external OpenAI-compatible LLM endpoint through native HTTP rather
  than coupling domain logic to one provider SDK.
- Use local JSON schema validation and deterministic invariant checks before
  semantic scoring.
- Use a case-specific rubric and normalized semantic comparisons instead of
  exact generated-text matching.
- Use fixed reference times and declared configuration for reproducible
  evaluation while preserving non-deterministic model wording.

## Phase 1 Design Outputs

- [data-model.md](./data-model.md) defines request, interpretation, evaluation
  case, and evidence entities.
- [contracts/reminder-api.md](./contracts/reminder-api.md) defines the API
  request, response, and stable errors.
- [contracts/evaluation-result.md](./contracts/evaluation-result.md) defines
  per-case and aggregate evaluation evidence.
- [quickstart.md](./quickstart.md) defines end-to-end validation commands and
  expected outcomes.

## Implementation Sequencing

1. Create Part 1B package/tooling and capture the initial-generation snapshot.
2. Define output contracts, fixtures, and schema/property tests before model
   integration.
3. Implement the model adapter, prompt construction, parser, and categorized
   errors.
4. Implement deterministic invariant and guardrail validation.
5. Implement the API and minimal UI using the same interpretation service.
6. Create the 15-case evaluation dataset and rubric metadata.
7. Implement the single evaluation pipeline and evidence writer.
8. Run the initial harness, preserve genuine failures, repair root causes, and
   rerun the unchanged evaluation.
9. Perform final human review and record ACCEPT or REJECT.

## Complexity Tracking

No constitution violations or unjustified complexity were identified.
