import { createApp } from "./app.js";
import { JsonTaskRepository } from "./persistence/json-task-repository.js";
const port = Number(process.env.PORT ?? 3000);
const repository = new JsonTaskRepository(process.env.TASK_DATA_FILE ?? "./data/tasks.json");
repository.initialize().then(() => {
  createApp(undefined, repository).listen(port, () => console.info(`Smart Todo API listening on ${port}`));
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
