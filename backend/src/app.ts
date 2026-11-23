import express from "express";
import { routes } from "./api/routes/index.js";
import { errorHandler } from "./api/middleware/error-handler.js";
import { requestLogger } from "./api/middleware/request-logger.js";
import { JsonTaskRepository } from "./persistence/json-task-repository.js";
import { TaskService } from "./services/task-service.js";

export function createApp(filePath = process.env.TASK_DATA_FILE ?? "./data/tasks.json", repository?: JsonTaskRepository) {
  const app = express();
  const service = new TaskService(repository ?? new JsonTaskRepository(filePath));
  const allowedOrigins = new Set((process.env.CORS_ORIGINS ?? "http://localhost:5173,http://127.0.0.1:5173").split(",").map((origin) => origin.trim()));
  app.use((request, response, next) => {
    const origin = request.get("Origin");
    if (origin && allowedOrigins.has(origin)) {
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Vary", "Origin");
      response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
    if (request.method === "OPTIONS") {
      response.sendStatus(origin && allowedOrigins.has(origin) ? 204 : 403);
      return;
    }
    next();
  });
  app.use(requestLogger);
  app.use(express.json({ strict: true }));
  app.use("/api", routes(service));
  app.use(errorHandler);
  return app;
}
