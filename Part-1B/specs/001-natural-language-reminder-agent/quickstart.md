# Part 1B Quickstart Validation

This guide validates the Reminder Agent through the real application path and
the single evaluation harness. It does not replace the implementation tasks.

## Prerequisites

- Node.js 20+ and npm.
- An external LLM endpoint compatible with the planned adapter.
- Environment variables supplied locally and never committed:
  - `LLM_BASE_URL`
  - `LLM_API_KEY`
  - `LLM_MODEL`
  - `LLM_TIMEOUT_MS`

## Install and configure

```sh
cd Part-1B
npm install
cp .env.example .env
```

Populate local secret values in `.env`, or export them in the shell.

## Run the application

```sh
npm run dev
```

Submit a request through the documented API contract and verify that the
response has exactly the declared schema fields. Test at least one create,
clarify, reschedule, snooze, and reject request.

## Run deterministic tests

```sh
npm test
npm run type-check
npm run lint
```

## Run the single evaluation harness

```sh
npm run evaluate
```

Expected output includes:

- At least 15 evaluated cases.
- Structural validity metrics.
- Invariant/property metrics.
- Semantic/quality metrics.
- Per-case results and failures.
- Aggregate pass rate.
- Final `PASS` or `FAIL` against the declared threshold.

The harness must write `evidence/eval-results.json` and preserve genuine
initial-generation, repair, and final-generation evidence.
