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

## Validate

```sh
npm run type-check
npm test
npm run build
npm run harness
```

The API contract is documented in
[`specs/001-smart-todo-task-manager/contracts/rest-api.md`](specs/001-smart-todo-task-manager/contracts/rest-api.md).
