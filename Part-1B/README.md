# Part 1B — Natural-Language Reminder Agent

## Run locally

Install dependencies from this directory:

```sh
cd Part-1B
npm install
```

For offline deterministic operation, start the backend in one terminal:

```sh
REMINDER_MODE=deterministic npm run dev
```

Start the React UI in a second terminal:

```sh
cd Part-1B
npm run dev:ui
```

Open `http://localhost:5173`. Vite proxies `/api` requests to the Express
backend at `http://localhost:3001`.

For external-model operation, copy `.env.example` to `.env` and set
`LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`, and `LLM_TIMEOUT_MS`. Do not commit
the `.env` file or credentials.

## Validate

```sh
npm test
npm run type-check
npm run lint
npm run build
npm run evaluate
npm run harness
```

The harness evaluates at least 15 fixed-context cases through structural,
invariant/property, and semantic/quality gates. No calendar, messaging,
notification, tool, or other consequential action is executed.
