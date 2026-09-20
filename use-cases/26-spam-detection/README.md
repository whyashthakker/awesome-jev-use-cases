# Spam detection: Jev vs OpenAI

Flag unsolicited promotional messages for a review queue.

**Primitive:** noul · **Pattern:** Atomic Noul

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/26-spam-detection/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/26-spam-detection/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/26-spam-detection/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A message filter needs a compact signal for every message.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Spam link

```json
{
  "context": "A programming help forum",
  "message": "Guaranteed cash prize! Visit my casino offer now!!!"
}
```

Illustrative values: `{"spam":0.99}`.

### Relevant help

```json
{
  "context": "A programming help forum",
  "message": "Try awaiting the fetch before reading its result."
}
```

Illustrative values: `{"spam":0.03}`.

## Questions

```json
{
  "spam": {
    "type": "noul",
    "instructions": "Is this message unsolicited promotional spam rather than an on-topic discussion?"
  }
}
```

## Decision policy

```json
{
  "kind": "noul",
  "key": "spam",
  "low": 0.2,
  "high": 0.8,
  "yes": "Flag for review",
  "no": "Continue"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe LLM guardrails](https://docs.typesafe.ai/cookbooks/llm_guardrails)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
