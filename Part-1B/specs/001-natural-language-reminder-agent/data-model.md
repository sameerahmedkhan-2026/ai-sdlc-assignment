# Data Model: Natural-Language Reminder Agent

## ReminderRequest

The normalized request envelope submitted by the UI, API client, or evaluator.

| Field | Type | Rules |
|---|---|---|
| `text` | string | Required; trimmed; must contain at least one non-whitespace character. |
| `referenceTime` | ISO-8601 datetime | Required; used for relative-date interpretation. |
| `timezone` | IANA timezone string | Required context; explicit input timezone takes precedence. |
| `requestId` | string | Optional caller/evaluator correlation identifier. |

## ReminderInterpretation

The only successful public model output. It has exactly the fields in the API
contract:

| Field | Type | Rules |
|---|---|---|
| `intent` | enum | `create`, `reschedule`, `snooze`, `clarify`, or `reject`. |
| `subject` | string or null | Non-empty for `create`; null when not applicable. |
| `remindAt` | ISO-8601 datetime or null | Future and unambiguous when required. |
| `timezone` | IANA timezone or null | Preserves explicit timezone; null when not applicable. |
| `snoozeMinutes` | positive integer or null | Required for `snooze` unless an absolute target is used. |
| `clarificationQuestion` | string or null | Required and focused for `clarify`. |
| `reason` | string or null | Required for `reject`; concise and non-sensitive. |

### Nullability invariants

- `create`: `subject` and `remindAt` are non-null; `snoozeMinutes`,
  `clarificationQuestion`, and `reason` are null.
- `reschedule`: `remindAt` is non-null; `snoozeMinutes` is null.
- `snooze`: `snoozeMinutes` is positive unless an explicit absolute target is
  represented by `remindAt`.
- `clarify`: `clarificationQuestion` is non-null; unsupported values are null.
- `reject`: `reason` is non-null; action fields are null.

## EvaluationCase

| Field | Type | Rules |
|---|---|---|
| `id` | string | Stable unique identifier. |
| `input` | ReminderRequest | Submitted to the real application path. |
| `category` | enum | Normal, boundary, ambiguous, missing, malformed, or adversarial. |
| `expectedProperties` | object | Deterministic intent, fields, time relations, and safety expectations. |
| `semanticRubric` | object | Case-specific criteria scored 0, 0.5, or 1. |
| `maxLatencyMs` | integer | Optional per-case latency threshold; default 10000. |

## EvaluationResult

Each result records the case ID, generated output or categorized service
failure, structural score, invariant score, semantic score, latency, passed
status, failed checks, and repair disposition. Secrets and raw authorization
headers are excluded.

## Relationships

- One `ReminderRequest` produces at most one `ReminderInterpretation`.
- One `EvaluationCase` produces one `EvaluationResult`.
- An evaluation run contains all case results plus aggregate layer metrics and
  the final threshold decision.
