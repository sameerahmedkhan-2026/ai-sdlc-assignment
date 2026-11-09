import { mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import type { Task } from "@smart-todo/contracts";
import { PersistenceError } from "../domain/errors.js";
import type { PersistenceDocument, StoredTask } from "./persistence-types.js";

export class JsonTaskRepository {
  private document: PersistenceDocument | undefined;
  private writing: Promise<void> = Promise.resolve();
  constructor(private readonly filePath: string) {}

  async initialize(): Promise<void> {
    await this.load();
  }

  private async load(): Promise<PersistenceDocument> {
    if (this.document) return this.document;
    try {
      const raw = await readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as PersistenceDocument;
      if (parsed.version !== 1 || !Array.isArray(parsed.tasks) || typeof parsed.nextCreationOrder !== "number") throw new Error("invalid document");
      this.document = parsed;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        this.document = { version: 1, nextCreationOrder: 1, tasks: [] };
      } else {
        throw new PersistenceError();
      }
    }
    return this.document;
  }

  async list(): Promise<StoredTask[]> { return [...(await this.load()).tasks]; }
  async find(id: string): Promise<StoredTask | undefined> { return (await this.load()).tasks.find((task) => task.id === id); }

  async mutate(mutator: (document: PersistenceDocument) => PersistenceDocument): Promise<void> {
    this.writing = this.writing.then(async () => {
      const next = mutator(await this.load());
      await mkdir(dirname(this.filePath), { recursive: true });
      const temporary = `${this.filePath}.${randomUUID()}.tmp`;
      try {
        const handle = await open(temporary, "w");
        try {
          await handle.writeFile(JSON.stringify(next, null, 2), "utf8");
          await handle.sync();
        } finally {
          await handle.close();
        }
        await rename(temporary, this.filePath);
        const directory = await open(dirname(this.filePath), "r");
        try {
          await directory.sync();
        } finally {
          await directory.close();
        }
        this.document = next;
      } catch {
        await unlink(temporary).catch(() => undefined);
        throw new PersistenceError();
      }
    });
    return this.writing;
  }

  async create(task: Omit<Task, "id" | "createdAt">): Promise<StoredTask> {
    const document = await this.load();
    const stored: StoredTask = { ...task, id: randomUUID(), createdAt: new Date().toISOString(), creationOrder: document.nextCreationOrder };
    await this.mutate((current) => ({ ...current, nextCreationOrder: current.nextCreationOrder + 1, tasks: [...current.tasks, stored] }));
    return stored;
  }
}
