# Composite response quality: Jev vs OpenAI

Score grounding and relevance separately, then combine in code.

**Primitive:** score · **Pattern:** Atomic Score + weighted code

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/37-response-quality/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/37-response-quality/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/37-response-quality/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

An evaluation pipeline needs independent dimensions and explicit weights.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Good answer

```json
{
  "question": "When does support open?",
  "reference": "Support opens at 09:00 UTC.",
  "answer": "Support opens at 09:00 UTC."
}
```

Illustrative values: `{"grounding":2,"relevance":2}`.

### Off-topic answer

```json
{
  "question": "When does support open?",
  "reference": "Support opens at 09:00 UTC.",
  "answer": "Our logo is blue."
}
```

Illustrative values: `{"grounding":0,"relevance":0}`.

## Questions

```json
{
  "grounding": {
    "type": "score",
    "instructions": "Is answer supported by reference?",
    "criteria": [
      "Unsupported",
      "Partially supported",
      "Fully supported"
    ]
  },
  "relevance": {
    "type": "score",
    "instructions": "Does answer address question?",
    "criteria": [
      "Unrelated",
      "Partial answer",
      "Direct answer"
    ]
  }
}
```

## Decision policy

```json
{
  "kind": "composite",
  "keys": [
    "grounding",
    "relevance"
  ],
  "weights": [
    0.7,
    0.3
  ],
  "max": 2,
  "threshold": 1.5,
  "high": "Meets demo rubric",
  "low": "Needs review"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe composite scoring](https://docs.typesafe.ai/patterns/composite-scoring)
- [OpenAI evaluation graders](https://developers.openai.com/api/docs/guides/graders)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
