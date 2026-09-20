# Fraud-tier scoring: Jev vs OpenAI

Score transaction review priority against a small risk rubric.

**Primitive:** score · **Pattern:** Atomic Score

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/02-fraud-tier-scoring/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/02-fraud-tier-scoring/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/02-fraud-tier-scoring/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A review queue consumes a bounded score, not a generated fraud report.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Suspicious checkout

```json
{
  "device": "new",
  "shipping": "reshipper",
  "activity": "many failed cards followed by a high-value purchase"
}
```

Illustrative values: `{"risk":1.9}`.

### Routine renewal

```json
{
  "device": "known",
  "activity": "usual subscription renewal",
  "shipping": "unchanged"
}
```

Illustrative values: `{"risk":0.1}`.

## Questions

```json
{
  "risk": {
    "type": "score",
    "instructions": "Rate suspiciousness of the transaction signals, not guilt.",
    "criteria": [
      "Routine known customer activity",
      "Unusual activity with a plausible explanation",
      "Multiple suspicious signals needing review"
    ]
  }
}
```

## Decision policy

```json
{
  "kind": "score",
  "key": "risk",
  "max": 2,
  "threshold": 1,
  "high": "Prioritize",
  "low": "Standard queue"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Toy review prioritization only. This is not a calibrated fraud probability, payment authorization system or financial decision model.

## Sources

- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [AWS fraud detection patterns](https://docs.aws.amazon.com/frauddetector/latest/ug/what-is-frauddetector.html)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
