import { Router } from "express";
import { taskRoutes } from "./tasks.js";
import { TaskService } from "../../services/task-service.js";
export function routes(service: TaskService): Router {
  const router = Router();
  router.use("/tasks", taskRoutes(service));
  return router;
}
