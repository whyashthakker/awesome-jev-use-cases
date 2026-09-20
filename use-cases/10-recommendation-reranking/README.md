# Recommendation re-ranking: Jev vs OpenAI

Score three products against a shopper preference and sort in code.

**Primitive:** score · **Pattern:** Parallel Score + code sort

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/10-recommendation-reranking/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/10-recommendation-reranking/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/10-recommendation-reranking/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A page needs an ordered candidate list, not a shopping essay.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Light hiking gear

```json
{
  "preference": "Lightweight waterproof hiking jacket",
  "products": [
    "Light rain shell for hiking",
    "Heavy wool overcoat",
    "Breathable fleece, not waterproof"
  ]
}
```

Illustrative values: `{"item_0":2,"item_1":0,"item_2":1}`.

### Warm city coat

```json
{
  "preference": "Warm wool coat for city winter",
  "products": [
    "Light rain shell for hiking",
    "Heavy wool overcoat",
    "Breathable fleece, not waterproof"
  ]
}
```

Illustrative values: `{"item_0":0,"item_1":2,"item_2":1}`.

## Questions

```json
{
  "item_0": {
    "type": "score",
    "instructions": "How well does products[0] match preference?",
    "criteria": [
      "Poor fit",
      "Partial fit",
      "Strong fit"
    ]
  },
  "item_1": {
    "type": "score",
    "instructions": "How well does products[1] match preference?",
    "criteria": [
      "Poor fit",
      "Partial fit",
      "Strong fit"
    ]
  },
  "item_2": {
    "type": "score",
    "instructions": "How well does products[2] match preference?",
    "criteria": [
      "Poor fit",
      "Partial fit",
      "Strong fit"
    ]
  }
}
```

## Decision policy

```json
{
  "kind": "rank",
  "keys": [
    "item_0",
    "item_1",
    "item_2"
  ]
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe re-ranking](https://docs.typesafe.ai/cookbooks/rerank_typesafe)
- [Cohere reranking](https://docs.cohere.com/docs/rerank)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
