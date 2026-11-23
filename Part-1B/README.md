# Part 1B — Natural-Language Reminder Agent

This directory contains the Part 1B application required by the assignment.
The application will parse natural-language reminder requests into a stable
structured representation, interpret date/time information, support
reschedule/snooze intent, and request clarification when mandatory information
is missing.

The implementation must be driven by the reviewed Spec Kit artifacts and
evaluated through one harness covering schema, invariant/property, and
semantic/quality checks.

## Planned structure

- `specs/` — specification, plan, tasks, contracts, and supporting artifacts
- `src/` — application implementation
- `prompts/` — prompts or model configuration, if used
- `tests/` — deterministic application tests
- `evals/dataset.json` — at least 15 meaningful evaluation cases
- `.harness/` — evaluation pipeline and validators
- `evidence/` — initial-generation, final-generation, results, and harness log
