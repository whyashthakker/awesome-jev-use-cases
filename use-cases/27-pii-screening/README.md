# Personal-data screening: Jev vs OpenAI

Detect personal contact data in a draft before publication.

**Primitive:** noul · **Pattern:** Atomic Noul

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/27-pii-screening/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/27-pii-screening/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/27-pii-screening/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A publishing gate needs a review flag, not a prose privacy audit.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Personal contact

```json
{
  "draft": "Contact Alex at alex.person@example.com for the surprise party."
}
```

Illustrative values: `{"pii":0.98}`.

### Generic instructions

```json
{
  "draft": "Contact our support team through the in-app help button."
}
```

Illustrative values: `{"pii":0.03}`.

## Questions

```json
{
  "pii": {
    "type": "noul",
    "instructions": "Does the draft contain a personal email address or personal phone number?"
  }
}
```

## Decision policy

```json
{
  "kind": "noul",
  "key": "pii",
  "low": 0.2,
  "high": 0.8,
  "yes": "Flag for review",
  "no": "Continue"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Use deterministic secret/PII detectors as additional controls. No model-based detector guarantees complete coverage.

## Sources

- [TypeSafe LLM guardrails](https://docs.typesafe.ai/cookbooks/llm_guardrails)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
