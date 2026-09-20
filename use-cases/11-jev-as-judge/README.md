# Jev as judge: Jev vs OpenAI

Judge two candidate answers against one explicit factual reference.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/11-jev-as-judge/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/11-jev-as-judge/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/11-jev-as-judge/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

An evaluator can emit a winner without generating a critique.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Wrong capital

```json
{
  "question": "What is the capital of France?",
  "reference": "Paris is the capital of France.",
  "a": "Paris.",
  "b": "Lyon."
}
```

Illustrative values: `{"winner":"a"}`.

### Swap candidates

```json
{
  "question": "What is the capital of France?",
  "reference": "Paris is the capital of France.",
  "a": "Lyon.",
  "b": "Paris."
}
```

Illustrative values: `{"winner":"b"}`.

## Questions

```json
{
  "winner": {
    "type": "choice",
    "instructions": "Which candidate correctly answers the question using only the reference?",
    "criteria": {
      "a": "Only answer A is correct",
      "b": "Only answer B is correct",
      "tie": "Both correct or equally unsupported"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "winner"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Toy judge, not an objective quality oracle. Use human labels, swap candidate order, and evaluate position bias and disagreement.

## Sources

- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI evaluation graders](https://developers.openai.com/api/docs/guides/graders)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
