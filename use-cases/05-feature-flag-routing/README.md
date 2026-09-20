# Feature-flag eligibility: Jev vs OpenAI

Classify feedback into a suitable feature-preview cohort.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/05-feature-flag-routing/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/05-feature-flag-routing/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/05-feature-flag-routing/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

Semantic eligibility can be a fixed choice; experiment assignment itself belongs in deterministic code.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Find old orders

```json
{
  "feedback": "I cannot find old orders by product name."
}
```

Illustrative values: `{"cohort":"search"}`.

### Export trends

```json
{
  "feedback": "I want a monthly trend report in a spreadsheet."
}
```

Illustrative values: `{"cohort":"reports"}`.

## Questions

```json
{
  "cohort": {
    "type": "choice",
    "instructions": "Which preview matches the stated need?",
    "criteria": {
      "search": "Needs better search",
      "reports": "Needs analytics or exports",
      "none": "No relevant feature need"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "cohort"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Use a stable hash for A/B allocation and permissions for access. Neither Jev nor an LLM should randomly assign production experiment buckets.

## Sources

- [TypeSafe intent routing](https://docs.typesafe.ai/patterns/intent-routing)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
