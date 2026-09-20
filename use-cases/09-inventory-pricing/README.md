# Inventory pressure scoring: Jev vs OpenAI

Turn supplier notes into a scarcity score for a pricing policy.

**Primitive:** score · **Pattern:** Atomic Score

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/09-inventory-pricing/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/09-inventory-pricing/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/09-inventory-pricing/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

Code can consume a semantic pressure score and own all price calculations.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Supply disruption

```json
{
  "notes": "The supplier halted shipments; all incoming deliveries are canceled."
}
```

Illustrative values: `{"pressure":1.95}`.

### Normal restock

```json
{
  "notes": "Regular weekly deliveries are confirmed; backup supplier is available."
}
```

Illustrative values: `{"pressure":0.05}`.

## Questions

```json
{
  "pressure": {
    "type": "score",
    "instructions": "Rate supply pressure described in the notes.",
    "criteria": [
      "Normal replenishment",
      "Some delays or limited stock",
      "Severe shortage and no near-term replenishment"
    ]
  }
}
```

## Decision policy

```json
{
  "kind": "score",
  "key": "pressure",
  "max": 2,
  "threshold": 1,
  "high": "Prioritize",
  "low": "Standard queue"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Does not set real prices or forecast demand. Price bounds, fairness rules and numerical inventory math belong in code.

## Sources

- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
