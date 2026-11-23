# Smart Todo & Task Manager

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
