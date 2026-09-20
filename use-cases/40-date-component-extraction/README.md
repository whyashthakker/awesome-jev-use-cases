# Date component extraction: Jev vs OpenAI

Identify a month and day from a bounded candidate set.

**Primitive:** choice · **Pattern:** Parallel bounded extraction

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/40-date-component-extraction/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/40-date-component-extraction/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/40-date-component-extraction/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

Typed choices can extract components while date validation and arithmetic stay in code.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### September appointment

```json
{
  "text": "The appointment is September 20."
}
```

Illustrative values: `{"month":"september","day":"d20"}`.

### October appointment

```json
{
  "text": "The appointment is October 12."
}
```

Illustrative values: `{"month":"october","day":"d12"}`.

## Questions

```json
{
  "month": {
    "type": "choice",
    "instructions": "Which month is explicitly named?",
    "criteria": {
      "september": "September",
      "october": "October",
      "unknown": "Neither named"
    }
  },
  "day": {
    "type": "choice",
    "instructions": "Which day of month is explicitly named?",
    "criteria": {
      "d12": "12",
      "d20": "20",
      "unknown": "Neither named"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "date"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Intentionally bounded to two months and days. No year is inferred; this does not parse arbitrary dates.

## Sources

- [TypeSafe date extraction](https://docs.typesafe.ai/cookbooks/date_extraction_cookbook)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
