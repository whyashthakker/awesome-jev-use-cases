# Review sentiment: Jev vs OpenAI

Score product sentiment on an ordered three-level rubric.

**Primitive:** score · **Pattern:** Atomic Score

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/25-review-sentiment/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/25-review-sentiment/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/25-review-sentiment/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A review dashboard needs a numeric summary suitable for aggregation.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Delighted reviewer

```json
{
  "review": "Setup was effortless and everything works beautifully."
}
```

Illustrative values: `{"sentiment":2}`.

### Mixed experience

```json
{
  "review": "Great search, but the editor crashes often."
}
```

Illustrative values: `{"sentiment":1}`.

## Questions

```json
{
  "sentiment": {
    "type": "score",
    "instructions": "Rate the sentiment toward the product.",
    "criteria": [
      "Negative",
      "Mixed or neutral",
      "Positive"
    ]
  }
}
```

## Decision policy

```json
{
  "kind": "score",
  "key": "sentiment",
  "max": 2,
  "threshold": 1.5,
  "high": "Positive",
  "low": "Needs attention"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
