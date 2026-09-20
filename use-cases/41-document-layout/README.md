# Document structure recovery: Jev vs OpenAI

Classify text blocks as heading, paragraph or list item.

**Primitive:** choice · **Pattern:** Parallel block classification

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/41-document-layout/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/41-document-layout/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/41-document-layout/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A renderer needs block types; it should preserve the original text.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Setup document

```json
{
  "blocks": [
    "Getting started",
    "Install the package before running the server.",
    "- Set your API key"
  ]
}
```

Illustrative values: `{"block_0":"heading","block_1":"paragraph","block_2":"list"}`.

### Usage document

```json
{
  "blocks": [
    "Usage notes",
    "- Start in preview mode",
    "Live mode calls both providers."
  ]
}
```

Illustrative values: `{"block_0":"heading","block_1":"list","block_2":"paragraph"}`.

## Questions

```json
{
  "block_0": {
    "type": "choice",
    "instructions": "Classify blocks[0] by its document role.",
    "criteria": {
      "heading": "Short section title",
      "paragraph": "Explanatory prose",
      "list": "A list item"
    }
  },
  "block_1": {
    "type": "choice",
    "instructions": "Classify blocks[1] by its document role.",
    "criteria": {
      "heading": "Short section title",
      "paragraph": "Explanatory prose",
      "list": "A list item"
    }
  },
  "block_2": {
    "type": "choice",
    "instructions": "Classify blocks[2] by its document role.",
    "criteria": {
      "heading": "Short section title",
      "paragraph": "Explanatory prose",
      "list": "A list item"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "block_0"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe structure recovery](https://docs.typesafe.ai/cookbooks/autoformat)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
