# Delivery exception routing: Jev vs OpenAI

Send delivery notes to a fixed resolution queue.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/18-delivery-exception/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/18-delivery-exception/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/18-delivery-exception/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

Operations needs a queue key for each exception.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Missing apartment

```json
{
  "note": "The building is correct but apartment number is missing."
}
```

Illustrative values: `{"queue":"address"}`.

### Van breakdown

```json
{
  "note": "The delivery van broke down on the route."
}
```

Illustrative values: `{"queue":"carrier"}`.

## Questions

```json
{
  "queue": {
    "type": "choice",
    "instructions": "Choose the resolution team.",
    "criteria": {
      "address": "Address missing or incorrect",
      "carrier": "Carrier delay or vehicle problem",
      "customer": "Recipient unavailable"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "queue"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe intent routing](https://docs.typesafe.ai/patterns/intent-routing)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
