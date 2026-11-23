# Reminder Interpretation API Contract

## Interpret a request

`POST /api/reminders/interpret`

### Request

```json
{
  "text": "Remind me to call the dentist tomorrow at 10am",
  "referenceTime": "2026-11-23T09:00:00Z",
  "timezone": "Asia/Kolkata",
  "requestId": "eval-001"
}
```

### Successful response

HTTP `200`

```json
{
  "intent": "create",
  "subject": "call the dentist",
  "remindAt": "2026-11-24T10:00:00+05:30",
  "timezone": "Asia/Kolkata",
  "snoozeMinutes": null,
  "clarificationQuestion": null,
  "reason": null
}
```

The response MUST contain exactly the public fields defined above. Equivalent
wording is acceptable for text fields where the semantic rubric permits it.

## Stable errors

```json
{
  "error": {
    "code": "INVALID_REQUEST | INVALID_MODEL_OUTPUT | MODEL_UNAVAILABLE | EVALUATION_ERROR",
    "message": "Non-sensitive human-readable message"
  }
}
```

| Condition | Status | Code |
|---|---:|---|
| Missing or invalid request fields | 400 | `INVALID_REQUEST` |
| Model output cannot satisfy the schema | 502 | `INVALID_MODEL_OUTPUT` |
| Timeout, rate limit, or unavailable model service | 503 | `MODEL_UNAVAILABLE` |
| Unexpected evaluation failure | 500 | `EVALUATION_ERROR` |

Errors MUST NOT disclose prompts containing secrets, authorization headers,
provider internals, stack traces, or raw model credentials.

## Safety behavior

- The endpoint interprets requests only; it does not execute calendar,
  notification, messaging, purchase, or other external actions.
- Unsupported consequential actions and prompt-injection attempts return a
  valid `reject` interpretation. Stable request errors are reserved for
  malformed or invalid request envelopes before interpretation.
- The service MUST use fixed `referenceTime` and `timezone` values supplied by
  the caller rather than the evaluator's wall clock.
