export class DomainError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string,
    public readonly fields?: Record<string, string>
  ) {
    super(message);
  }
}

export class PersistenceError extends DomainError {
  constructor(message = "Task storage is unavailable") {
    super("PERSISTENCE_ERROR", 500, message);
  }
}

export class InternalError extends DomainError {
  constructor() {
    super("INTERNAL_ERROR", 500, "An unexpected server error occurred");
  }
}
