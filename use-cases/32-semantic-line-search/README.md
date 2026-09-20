# Semantic line search: Jev vs OpenAI

Select a line ID containing the answer to a question.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/32-semantic-line-search/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/32-semantic-line-search/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/32-semantic-line-search/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

The caller needs an existing span identifier, not generated text.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Cancellation

```json
{
  "query": "How do I cancel?",
  "lines": {
    "line_1": "Invoices are emailed monthly.",
    "line_2": "Cancel from Settings > Billing.",
    "line_3": "Support responds on weekdays."
  }
}
```

Illustrative values: `{"line":"line_2"}`.

### Support hours

```json
{
  "query": "When is support available?",
  "lines": {
    "line_1": "Invoices are emailed monthly.",
    "line_2": "Cancel from Settings > Billing.",
    "line_3": "Support responds on weekdays."
  }
}
```

Illustrative values: `{"line":"line_3"}`.

## Questions

```json
{
  "line": {
    "type": "choice",
    "instructions": "Which provided line directly answers query?",
    "criteria": {
      "line_1": "Line 1",
      "line_2": "Line 2",
      "line_3": "Line 3",
      "none": "No line answers"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "line"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe line-by-line search](https://docs.typesafe.ai/cookbooks/semantic_find)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
