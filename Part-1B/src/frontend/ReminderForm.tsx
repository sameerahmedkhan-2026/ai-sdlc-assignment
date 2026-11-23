import { useState } from "react";
import { ReminderResult } from "./ReminderResult";
export function ReminderForm() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: any) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/reminders/interpret", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text,
          referenceTime: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      const j = await r.json();
      r.ok ? setResult(j) : setError(j.error?.message || "Request failed");
    } catch {
      setError("Unable to connect to the reminder service.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">Natural-language reminder assistant</p>
        <h1>Plan a reminder in your own words</h1>
        <p className="description">
          Describe what you want to remember and when you need it. This app
          interprets your request into a structured reminder, asks for missing
          details, and supports rescheduling or snoozing.
        </p>
      </section>
      <form className="reminder-form" onSubmit={submit}>
        <label htmlFor="reminder">What would you like to remember?</label>
        <textarea
          id="reminder"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="For example: Remind me to call the dentist tomorrow at 10am"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Understanding..." : "Interpret reminder"}
        </button>
      </form>
      {error && (
        <p className="message error-message" role="alert">
          {error}
        </p>
      )}
      {result && <ReminderResult result={result} />}
    </main>
  );
}
