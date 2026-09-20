# Product attribute extraction: Jev vs OpenAI

Select a material explicitly stated in a product listing.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/46-product-attribute/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/46-product-attribute/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/46-product-attribute/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A filter index needs a canonical material key instead of free-form text.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Cotton shirt

```json
{
  "listing": "A breathable shirt made from cotton."
}
```

Illustrative values: `{"material":"cotton"}`.

### Unspecified blend

```json
{
  "listing": "Soft everyday shirt in a proprietary fabric blend."
}
```

Illustrative values: `{"material":"unknown"}`.

## Questions

```json
{
  "material": {
    "type": "choice",
    "instructions": "Which material is explicitly stated?",
    "criteria": {
      "cotton": "Cotton",
      "wool": "Wool",
      "polyester": "Polyester",
      "unknown": "None of these stated"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "material"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe pre-parsed extraction](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook)
- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
