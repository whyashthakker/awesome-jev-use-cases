# Maintenance report triage: Jev vs OpenAI

Route equipment notes to a maintenance specialty.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/49-maintenance-triage/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/49-maintenance-triage/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/49-maintenance-triage/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A work-order system needs a trade or review queue.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Motor vibration

```json
{
  "note": "The conveyor bearing grinds and vibrates during rotation."
}
```

Illustrative values: `{"trade":"mechanical"}`.

### Roof leak

```json
{
  "note": "Rainwater is leaking through the warehouse ceiling."
}
```

Illustrative values: `{"trade":"facilities"}`.

## Questions

```json
{
  "trade": {
    "type": "choice",
    "instructions": "Which specialty matches the described symptom?",
    "criteria": {
      "electrical": "Power, wiring or electrical issue",
      "mechanical": "Moving parts, vibration or physical wear",
      "facilities": "Leaks, building fixtures or room issues",
      "review": "Unclear"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "trade"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Routes reports only. Does not diagnose equipment or authorize repairs.

## Sources

- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
