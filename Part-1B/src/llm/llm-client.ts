import { config } from "../config";
import { AppError } from "../domain/errors";
export async function callModel(prompt: string) {
  if (!config.baseUrl || !config.apiKey || !config.model)
    throw new AppError(
      "MODEL_UNAVAILABLE",
      "Model service is not configured",
      503,
    );
  const c = new AbortController();
  const timer = setTimeout(() => c.abort(), config.timeoutMs);
  try {
    const res = await fetch(
      `${config.baseUrl.replace(/\/$/, "")}/chat/completions`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: "system", content: prompt }],
          temperature: 0,
        }),
        signal: c.signal,
      },
    );
    if (!res.ok)
      throw new AppError(
        "MODEL_UNAVAILABLE",
        "Model service is unavailable",
        503,
      );
    const data = (await res.json()) as any;
    return data.choices?.[0]?.message?.content ?? "";
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(
      "MODEL_UNAVAILABLE",
      "Model service is unavailable",
      503,
    );
  } finally {
    clearTimeout(timer);
  }
}
