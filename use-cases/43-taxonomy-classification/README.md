# Hierarchical product classification: Jev vs OpenAI

Choose a product leaf category inside a small taxonomy.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/43-taxonomy-classification/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/43-taxonomy-classification/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/43-taxonomy-classification/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

Catalog code needs a stable taxonomy ID, not an invented category.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Rain jacket

```json
{
  "listing": "Light waterproof hiking shell with sealed seams."
}
```

Illustrative values: `{"category":"rainwear"}`.

### Headphones

```json
{
  "listing": "Wireless noise-canceling headphones."
}
```

Illustrative values: `{"category":"audio"}`.

## Questions

```json
{
  "category": {
    "type": "choice",
    "instructions": "Choose the most specific matching taxonomy leaf.",
    "criteria": {
      "rainwear": "Outdoors > Clothing > Rainwear",
      "footwear": "Outdoors > Footwear",
      "audio": "Electronics > Audio",
      "other": "Outside these leaves"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "category"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Single-level slice of a hierarchy. This does not implement the full beam-search cookbook.

## Sources

- [TypeSafe hierarchical classification](https://docs.typesafe.ai/cookbooks/hierarchical_classification)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
