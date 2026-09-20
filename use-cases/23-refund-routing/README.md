# Refund request routing: Jev vs OpenAI

Categorize a refund request for the right reviewer.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/23-refund-routing/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/23-refund-routing/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/23-refund-routing/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A queue classifier needs a reason code; refund eligibility stays in policy code.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Charged twice

```json
{
  "request": "There are two charges for one order."
}
```

Illustrative values: `{"reason":"duplicate"}`.

### Not delivered

```json
{
  "request": "The parcel never arrived. I want a refund."
}
```

Illustrative values: `{"reason":"delivery"}`.

## Questions

```json
{
  "reason": {
    "type": "choice",
    "instructions": "Classify the stated refund reason.",
    "criteria": {
      "duplicate": "Duplicate charge",
      "quality": "Product dissatisfaction",
      "delivery": "Item not received"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "reason"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Does not authorize refunds or determine legal rights.

## Sources

- [TypeSafe intent routing](https://docs.typesafe.ai/patterns/intent-routing)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
