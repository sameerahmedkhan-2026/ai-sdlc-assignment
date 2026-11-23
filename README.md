# AI-Augmented SDLC Assignment

This repository contains both assignment applications:

- [Part 1A](Part-1A/) — completed Smart Todo & Task Manager deterministic application.
- [Part 1B](Part-1B/) — completed Natural-Language Reminder Agent, evaluation
  harness, and evidence package.

Part 1A remains at the repository root to preserve its validated workspace,
scripts, harness, and evidence paths. The `Part-1A/README.md` file provides the
submission index for that layout.

## Part 1A — Smart Todo & Task Manager

## Run locally

```sh
npm install
npm run dev
# in another terminal
npm run dev --workspace frontend
```

The API listens on `http://localhost:3000`; the Vite UI uses its configured API
URL and persists tasks in the local JSON file configured by `TASK_DATA_FILE`.
The backend allows the local Vite origins `http://localhost:5173` and
`http://127.0.0.1:5173` by default. Set `CORS_ORIGINS` to a comma-separated
allow-list when using another frontend origin.

## Validate

```sh
npm run type-check
npm test
npm run build
npm run harness
```

The API contract is documented in
[`specs/001-smart-todo-task-manager/contracts/rest-api.md`](specs/001-smart-todo-task-manager/contracts/rest-api.md).

## Part 1B

The isolated reminder agent is in [`Part-1B/`](Part-1B/). See
[`Part-1B/README.md`](Part-1B/README.md) for local setup and
[`Part-1B/specs/001-natural-language-reminder-agent/spec.md`](Part-1B/specs/001-natural-language-reminder-agent/spec.md)
for the approved specification.
