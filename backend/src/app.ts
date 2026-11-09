import express from "express";
import { routes } from "./api/routes/index.js";
import { errorHandler } from "./api/middleware/error-handler.js";
import { requestLogger } from "./api/middleware/request-logger.js";
import { JsonTaskRepository } from "./persistence/json-task-repository.js";
import { TaskService } from "./services/task-service.js";

export function createApp(filePath = process.env.TASK_DATA_FILE ?? "./data/tasks.json", repository?: JsonTaskRepository) {
  const app = express();
  const service = new TaskService(repository ?? new JsonTaskRepository(filePath));
  app.use(requestLogger);
  app.use(express.json({ strict: true }));
  app.use("/api", routes(service));
  app.use(errorHandler);
  return app;
}
