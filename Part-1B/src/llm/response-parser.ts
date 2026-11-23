import { AppError } from "../domain/errors";
export function parseModelJson(text: string) {
  const s = text.trim();
  if (!s.startsWith("{") || !s.endsWith("}"))
    throw new AppError(
      "INVALID_MODEL_OUTPUT",
      "Model response must contain JSON only",
      502,
    );
  try {
    return JSON.parse(s);
  } catch {
    throw new AppError(
      "INVALID_MODEL_OUTPUT",
      "Model response is not valid JSON",
      502,
    );
  }
}
