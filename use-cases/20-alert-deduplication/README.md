# Alert deduplication: Jev vs OpenAI

Detect whether two alerts describe the same incident.

**Primitive:** noul · **Pattern:** Atomic Noul

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/20-alert-deduplication/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/20-alert-deduplication/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/20-alert-deduplication/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

The system needs a grouping signal, not two generated summaries.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Same database outage

```json
{
  "a": "API database connection refused on primary.",
  "b": "Primary DB refusing connections; API requests fail."
}
```

Illustrative values: `{"same":0.98}`.

### Different services

```json
{
  "a": "Checkout database connection refused.",
  "b": "Analytics report email delayed."
}
```

Illustrative values: `{"same":0.05}`.

## Questions

```json
{
  "same": {
    "type": "noul",
    "instructions": "Do both alerts describe the same service failure and symptom?"
  }
}
```

## Decision policy

```json
{
  "kind": "noul",
  "key": "same",
  "low": 0.2,
  "high": 0.8,
  "yes": "Group alerts",
  "no": "Keep separate"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe entity alignment](https://docs.typesafe.ai/cookbooks/entity_alignment)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
