import { Router } from "express";
import { validateCreate, validateId, validateUpdate } from "../../domain/validation.js";
import { DomainError } from "../../domain/errors.js";
import { TaskService } from "../../services/task-service.js";

function parseQuery(value: unknown): { tags: string[]; sort: boolean } {
  const allowed = new Set(["tags", "sort"]);
  const tags: string[] = [];
  let sort = false;
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!allowed.has(key)) throw new DomainError("MALFORMED_REQUEST", 400, `Unknown query parameter: ${key}`);
    const values = Array.isArray(raw) ? raw : [raw];
    if (key === "tags") {
      for (const item of values) {
        if (typeof item !== "string" || item.split(",").some((tag) => tag.trim() === "")) throw new DomainError("MALFORMED_REQUEST", 400, "Tag filters must not be empty");
        tags.push(...item.split(",").map((tag) => tag.trim()));
      }
    } else {
      for (const item of values) {
        if (item !== "priority") throw new DomainError("MALFORMED_REQUEST", 400, "Only sort=priority is supported");
        sort = true;
      }
    }
  }
  return { tags: [...new Set(tags)], sort };
}

export function taskRoutes(service: TaskService): Router {
  const router = Router();
  router.post("/", (request, response, next) => { try { if (!request.is("application/json")) throw new DomainError("MALFORMED_REQUEST", 400, "Content-Type must be application/json"); service.create(validateCreate(request.body)).then((task) => response.status(201).json(task)).catch(next); } catch (error) { next(error); } });
  router.get("/", (request, response, next) => { try { const query = parseQuery(request.query); service.query(query.tags, query.sort).then((tasks) => response.json(tasks)).catch(next); } catch (error) { next(error); } });
  router.get("/:id", (request, response, next) => { try { validateId(request.params.id); service.get(request.params.id).then((task) => response.json(task)).catch(next); } catch (error) { next(error); } });
  router.put("/:id", (request, response, next) => { try { validateId(request.params.id); if (!request.is("application/json")) throw new DomainError("MALFORMED_REQUEST", 400, "Content-Type must be application/json"); service.update(request.params.id, validateUpdate(request.body, false)).then((task) => response.json(task)).catch(next); } catch (error) { next(error); } });
  router.patch("/:id", (request, response, next) => { try { validateId(request.params.id); if (!request.is("application/json")) throw new DomainError("MALFORMED_REQUEST", 400, "Content-Type must be application/json"); service.update(request.params.id, validateUpdate(request.body, true)).then((task) => response.json(task)).catch(next); } catch (error) { next(error); } });
  router.delete("/:id", (request, response, next) => { try { validateId(request.params.id); service.delete(request.params.id).then(() => response.status(204).send()).catch(next); } catch (error) { next(error); } });
  return router;
}
