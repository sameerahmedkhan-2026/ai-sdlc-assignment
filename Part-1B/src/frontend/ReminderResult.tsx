export function ReminderResult({ result }: { result: any }) {
  return (
    <section className="result-card" aria-live="polite">
      <p className="eyebrow">Interpreted result</p>
      <h2>{result.intent}</h2>
      {result.subject && (
        <p>
          <strong>Subject:</strong> {result.subject}
        </p>
      )}
      {result.remindAt && (
        <p>
          <strong>When:</strong> {result.remindAt} ({result.timezone})
        </p>
      )}
      {result.snoozeMinutes && (
        <p>
          <strong>Snooze:</strong> {result.snoozeMinutes} minutes
        </p>
      )}
      {result.clarificationQuestion && (
        <p className="clarification">{result.clarificationQuestion}</p>
      )}
      {result.reason && <p>{result.reason}</p>}
    </section>
  );
}
