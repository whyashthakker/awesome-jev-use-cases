# LLM output guardrail: Jev vs OpenAI

Screen a candidate answer before it reaches a user.

**Primitive:** noul · **Pattern:** Atomic Noul

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/06-output-guardrail/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/06-output-guardrail/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/06-output-guardrail/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

The check should return a narrow risk signal that code can act on.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Credential request

```json
{
  "answer": "Please paste your account password and secret API key into this chat."
}
```

Illustrative values: `{"unsafe":0.99}`.

### Safe setup guidance

```json
{
  "answer": "Set your API key in a local environment variable. Do not share it."
}
```

Illustrative values: `{"unsafe":0.02}`.

## Questions

```json
{
  "unsafe": {
    "type": "noul",
    "instructions": "Does the assistant answer request or expose a password or secret API key?"
  }
}
```

## Decision policy

```json
{
  "kind": "noul",
  "key": "unsafe",
  "low": 0.2,
  "high": 0.8,
  "yes": "Flag for review",
  "no": "Continue"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

A probabilistic detector is one layer, not a security boundary or a guarantee against prompt injection.

## Sources

- [TypeSafe LLM guardrails](https://docs.typesafe.ai/cookbooks/llm_guardrails)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
