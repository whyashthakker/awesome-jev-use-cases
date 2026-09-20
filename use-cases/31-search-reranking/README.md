# Search result re-ranking: Jev vs OpenAI

Sort three retrieved pages by relevance to a query.

**Primitive:** score · **Pattern:** Parallel Score + code sort

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/31-search-reranking/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/31-search-reranking/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/31-search-reranking/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

Search needs relevance scores, not generated page summaries.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Password reset

```json
{
  "query": "reset my password",
  "pages": [
    "Password reset steps",
    "Subscription invoices",
    "Two-factor authentication setup"
  ]
}
```

Illustrative values: `{"item_0":2,"item_1":0,"item_2":1}`.

### Billing history

```json
{
  "query": "find previous invoices",
  "pages": [
    "Password reset steps",
    "Subscription invoices",
    "Two-factor authentication setup"
  ]
}
```

Illustrative values: `{"item_0":0,"item_1":2,"item_2":0}`.

## Questions

```json
{
  "item_0": {
    "type": "score",
    "instructions": "Rate relevance of pages[0] to query.",
    "criteria": [
      "Unrelated",
      "Related background",
      "Direct answer"
    ]
  },
  "item_1": {
    "type": "score",
    "instructions": "Rate relevance of pages[1] to query.",
    "criteria": [
      "Unrelated",
      "Related background",
      "Direct answer"
    ]
  },
  "item_2": {
    "type": "score",
    "instructions": "Rate relevance of pages[2] to query.",
    "criteria": [
      "Unrelated",
      "Related background",
      "Direct answer"
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
