# Speculative support fan-out: Jev vs OpenAI

Ask intent, urgency and refund reason together; read only the relevant branch.

**Primitive:** choice + noul · **Pattern:** Choice + Noul + conditional code

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/50-speculative-fanout/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/50-speculative-fanout/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/50-speculative-fanout/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

One typed batch can prepare multiple branches without generating a workflow narrative.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Urgent duplicate

```json
{
  "message": "I was billed twice. Refund the extra charge ASAP."
}
```

Illustrative values: `{"intent":"refund","urgent":0.99,"refund_reason":"duplicate"}`.

### Technical question

```json
{
  "message": "The export button shows an error. Can you help?"
}
```

Illustrative values: `{"intent":"technical","urgent":0.1,"refund_reason":"unknown"}`.

## Questions

```json
{
  "intent": {
    "type": "choice",
    "instructions": "Which intent is expressed?",
    "criteria": {
      "refund": "Asks for money back",
      "technical": "Asks to fix an error",
      "other": "Neither"
    }
  },
  "urgent": {
    "type": "noul",
    "instructions": "Does the message explicitly convey immediate urgency?"
  },
  "refund_reason": {
    "type": "choice",
    "instructions": "Which refund reason is stated?",
    "criteria": {
      "duplicate": "Duplicate payment",
      "quality": "Dissatisfied with quality",
      "unknown": "Not stated or not a refund request"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "fanout"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Questions are independent. Branch relevance is resolved in code; no question relies on another answer from the same call.

## Sources

- [TypeSafe speculative fan-out](https://docs.typesafe.ai/patterns/fan-out)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
