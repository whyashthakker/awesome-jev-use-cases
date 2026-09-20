# Model escalation routing: Jev vs OpenAI

Choose a handler based on task complexity.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/35-model-escalation/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/35-model-escalation/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/35-model-escalation/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A dispatcher needs a route; expensive generation can be reserved for the selected handler.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Exact sum

```json
{
  "task": "Add 12 and 34."
}
```

Illustrative values: `{"handler":"code"}`.

### Research synthesis

```json
{
  "task": "Reconcile these conflicting research papers and derive a testable hypothesis."
}
```

Illustrative values: `{"handler":"reasoning"}`.

## Questions

```json
{
  "handler": {
    "type": "choice",
    "instructions": "Choose the appropriate handler for this task.",
    "criteria": {
      "code": "Exact arithmetic or deterministic lookup",
      "small": "Simple classification or rewrite",
      "reasoning": "Multi-step synthesis or proof",
      "human": "Request needs accountable human approval"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "handler"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

No downstream model is called. Savings require measured routing quality, traffic mix and current prices.

## Sources

- [TypeSafe intent routing](https://docs.typesafe.ai/patterns/intent-routing)
- [TypeSafe extraction cascade](https://docs.typesafe.ai/cookbooks/sde_cascade)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
