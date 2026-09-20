# Demand signal extraction: Jev vs OpenAI

Extract purchase intent and urgency as features for a separate forecaster.

**Primitive:** score · **Pattern:** Semantic features + code composition

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/48-demand-features/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/48-demand-features/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/48-demand-features/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A forecasting pipeline needs semantic numeric features alongside historical data.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Immediate order

```json
{
  "note": "We are ready to buy twenty units and need them this week."
}
```

Illustrative values: `{"intent":2,"urgency":2}`.

### Early browsing

```json
{
  "note": "Just exploring products for an unspecified future project."
}
```

Illustrative values: `{"intent":0,"urgency":0}`.

## Questions

```json
{
  "intent": {
    "type": "score",
    "instructions": "Rate explicit purchase intent.",
    "criteria": [
      "Browsing only",
      "Considering a purchase",
      "Ready to buy"
    ]
  },
  "urgency": {
    "type": "score",
    "instructions": "Rate expressed purchase urgency.",
    "criteria": [
      "No deadline",
      "Flexible near-term interest",
      "Explicit immediate need"
    ]
  }
}
```

## Decision policy

```json
{
  "kind": "composite",
  "keys": [
    "intent",
    "urgency"
  ],
  "weights": [
    0.6,
    0.4
  ],
  "max": 2,
  "threshold": 1.4,
  "high": "Strong demand signal",
  "low": "Weak demand signal"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

This produces features, not a sales forecast or purchase probability.

## Sources

- [TypeSafe feature discovery](https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
