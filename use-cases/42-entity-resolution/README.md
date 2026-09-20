# Knowledge graph entity alignment: Jev vs OpenAI

Choose whether two catalog records describe the same product.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/42-entity-resolution/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/42-entity-resolution/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/42-entity-resolution/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A graph pipeline needs merge, separate or review rather than generated descriptions.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Same product

```json
{
  "a": "Trail mug, 350 ml, blue, SKU M350-B",
  "b": "Blue 350ml Trail Mug (M350-B)"
}
```

Illustrative values: `{"match":"merge"}`.

### Different sizes

```json
{
  "a": "Trail mug, 350 ml, blue",
  "b": "Trail mug, 500 ml, blue"
}
```

Illustrative values: `{"match":"separate"}`.

## Questions

```json
{
  "match": {
    "type": "choice",
    "instructions": "Do the two records identify the same product variant?",
    "criteria": {
      "merge": "Same product and same variant",
      "separate": "Different products or variants",
      "review": "Insufficient evidence"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "match"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe entity alignment](https://docs.typesafe.ai/cookbooks/entity_alignment)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
