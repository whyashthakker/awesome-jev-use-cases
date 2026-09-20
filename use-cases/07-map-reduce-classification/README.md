# Map-reduce classification: Jev vs OpenAI

Label three feedback records in parallel, then count labels in code.

**Primitive:** choice · **Pattern:** Parallel independent questions

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/07-map-reduce-classification/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/07-map-reduce-classification/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/07-map-reduce-classification/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A dataset job needs labels and aggregation, not one explanation per record.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Mixed batch

```json
{
  "records": [
    "The save button crashes.",
    "Please add dark mode.",
    "Love the keyboard shortcuts."
  ]
}
```

Illustrative values: `{"item_0":"bug","item_1":"request","item_2":"praise"}`.

### Bug-heavy batch

```json
{
  "records": [
    "The app freezes.",
    "Export fails.",
    "Please add offline mode."
  ]
}
```

Illustrative values: `{"item_0":"bug","item_1":"bug","item_2":"request"}`.

## Questions

```json
{
  "item_0": {
    "type": "choice",
    "instructions": "Classify records[0].",
    "criteria": {
      "bug": "Broken behavior",
      "request": "Desired new feature",
      "praise": "Positive feedback"
    }
  },
  "item_1": {
    "type": "choice",
    "instructions": "Classify records[1].",
    "criteria": {
      "bug": "Broken behavior",
      "request": "Desired new feature",
      "praise": "Positive feedback"
    }
  },
  "item_2": {
    "type": "choice",
    "instructions": "Classify records[2].",
    "criteria": {
      "bug": "Broken behavior",
      "request": "Desired new feature",
      "praise": "Positive feedback"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "item_0"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

This mini batch contains three records. It is not evidence of million-record throughput or cost.

## Sources

- [TypeSafe speculative fan-out](https://docs.typesafe.ai/patterns/fan-out)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
