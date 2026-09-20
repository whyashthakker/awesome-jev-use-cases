# Citation support checking: Jev vs OpenAI

Compare one claim with its cited source excerpt.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/30-citation-check/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/30-citation-check/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/30-citation-check/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A source check needs supported, contradicted or unknown.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Supported claim

```json
{
  "claim": "The trial enrolled 40 participants.",
  "source": "Forty participants enrolled in the trial."
}
```

Illustrative values: `{"verdict":"supported"}`.

### Inflated claim

```json
{
  "claim": "The trial enrolled 400 participants.",
  "source": "Forty participants enrolled in the trial."
}
```

Illustrative values: `{"verdict":"contradicted"}`.

## Questions

```json
{
  "verdict": {
    "type": "choice",
    "instructions": "Does the source excerpt support the claim?",
    "criteria": {
      "supported": "Source explicitly supports claim",
      "contradicted": "Source explicitly conflicts with claim",
      "unknown": "Source does not establish claim"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "verdict"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Checks only the supplied excerpt. It does not fetch sources or establish that the source itself is true.

## Sources

- [TypeSafe citation checking](https://docs.typesafe.ai/cookbooks/citation_check)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
