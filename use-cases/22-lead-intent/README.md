# Inbound lead intent: Jev vs OpenAI

Route an inbound message by its explicit buying intent.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/22-lead-intent/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/22-lead-intent/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/22-lead-intent/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A CRM needs a known next step before a salesperson writes a response.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Book a demo

```json
{
  "message": "We want a team plan. Can we see a demo this week?"
}
```

Illustrative values: `{"intent":"demo"}`.

### Account problem

```json
{
  "message": "I already paid, but I cannot log in."
}
```

Illustrative values: `{"intent":"support"}`.

## Questions

```json
{
  "intent": {
    "type": "choice",
    "instructions": "What does the sender explicitly want?",
    "criteria": {
      "demo": "Product demo or buying discussion",
      "support": "Help using an existing account",
      "research": "General information without buying request"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "intent"
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
