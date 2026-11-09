import type { ErrorRequestHandler } from "express";
import { DomainError } from "../../domain/errors.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof DomainError) {
    response.status(error.status).json({ error: { code: error.code, message: error.message, ...(error.fields ? { fields: error.fields } : {}) } });
    return;
  }
  if (error?.type === "entity.parse.failed") {
    response.status(400).json({ error: { code: "MALFORMED_REQUEST", message: "Request body contains malformed JSON" } });
    return;
  }
  console.error(error);
  response.status(500).json({ error: { code: "INTERNAL_ERROR", message: "An unexpected server error occurred" } });
};
