import type { ReminderInterpretation, Intent } from "../domain/types";
import { AppError } from "../domain/errors";
const intents = ["create", "reschedule", "snooze", "clarify", "reject"];
export function validateInterpretation(value: unknown): ReminderInterpretation {
  if (!value || typeof value !== "object")
    throw new AppError(
      "INVALID_MODEL_OUTPUT",
      "Model output must be an object",
      502,
    );
  const v = value as Record<string, unknown>;
  const keys = Object.keys(v);
  const expected = [
    "intent",
    "subject",
    "remindAt",
    "timezone",
    "snoozeMinutes",
    "clarificationQuestion",
    "reason",
  ];
  if (
    keys.length !== expected.length ||
    expected.some((k) => !keys.includes(k))
  )
    throw new AppError(
      "INVALID_MODEL_OUTPUT",
      "Model output has invalid fields",
      502,
    );
  if (!intents.includes(v.intent as string))
    throw new AppError("INVALID_MODEL_OUTPUT", "Unsupported intent", 502);
  for (const k of [
    "subject",
    "remindAt",
    "timezone",
    "clarificationQuestion",
    "reason",
  ])
    if (v[k] !== null && typeof v[k] !== "string")
      throw new AppError("INVALID_MODEL_OUTPUT", "Invalid field type", 502);
  if (
    v.snoozeMinutes !== null &&
    (!Number.isInteger(v.snoozeMinutes) || Number(v.snoozeMinutes) <= 0)
  )
    throw new AppError("INVALID_MODEL_OUTPUT", "Invalid snooze duration", 502);
  const out = v as unknown as ReminderInterpretation;
  if (
    (out.intent === "create" && (!out.subject || !out.remindAt)) ||
    (out.intent === "clarify" && !out.clarificationQuestion) ||
    (out.intent === "reject" && !out.reason) ||
    (out.intent === "snooze" && out.snoozeMinutes === null)
  )
    throw new AppError(
      "INVALID_MODEL_OUTPUT",
      "Intent nullability invariant failed",
      502,
    );
  return out;
}
