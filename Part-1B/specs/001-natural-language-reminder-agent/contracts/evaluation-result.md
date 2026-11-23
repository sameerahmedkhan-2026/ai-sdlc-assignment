# Evaluation Result Contract

The evaluation runner writes `evidence/eval-results.json`.

```json
{
  "runId": "2026-11-23T20:00:00Z",
  "configuration": {
    "model": "declared-model-name",
    "promptVersion": "v1",
    "evaluatorVersion": "v1"
  },
  "threshold": {
    "aggregatePassRate": 0.9,
    "structuralValidity": 1,
    "safetyCompliance": 1
  },
  "metrics": {
    "cases": 15,
    "passed": 14,
    "aggregatePassRate": 0.9333,
    "structuralValidity": 1,
    "safetyCompliance": 1,
    "invariantPassRate": 0.9333,
    "semanticAverage": 0.9
  },
  "cases": [
    {
      "id": "create-explicit-time",
      "category": "normal",
      "structural": { "score": 1, "failures": [] },
      "invariants": { "score": 1, "failures": [] },
      "semantic": { "score": 1, "criteria": [] },
      "latencyMs": 1200,
      "passed": true
    }
  ],
  "decision": "PASS"
}
```

The actual evaluator MUST preserve generated outputs or categorized service
failures for each case, but MUST redact credentials and authorization data.
`decision` is `PASS` only when all declared threshold conditions hold.
