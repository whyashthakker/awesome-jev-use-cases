# Customer churn signals: Jev vs OpenAI

Score explicit cancellation intent in a support note.

**Primitive:** score · **Pattern:** Atomic Score

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/21-churn-signal/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/21-churn-signal/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/21-churn-signal/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

An account dashboard needs a signal rather than a generated account plan.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Cancel now

```json
{
  "note": "Please cancel my subscription. We moved to another product."
}
```

Illustrative values: `{"intent":2}`.

### How-to question

```json
{
  "note": "How do I invite another teammate?"
}
```

Illustrative values: `{"intent":0}`.

## Questions

```json
{
  "intent": {
    "type": "score",
    "instructions": "Rate expressed intent to stop using the product.",
    "criteria": [
      "No cancellation intent",
      "Considering alternatives",
      "Explicit request to cancel or leave"
    ]
  }
}
```

## Decision policy

```json
{
  "kind": "score",
  "key": "intent",
  "max": 2,
  "threshold": 1,
  "high": "Prioritize",
  "low": "Standard queue"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

A semantic feature, not a churn forecast. No personal demographic inference or account action occurs.

## Sources

- [TypeSafe feature discovery](https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery)
- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
