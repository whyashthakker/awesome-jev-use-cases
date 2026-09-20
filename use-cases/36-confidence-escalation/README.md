# Confidence-gated support routing: Jev vs OpenAI

Route clear tickets and send low-confidence Jev answers to review.

**Primitive:** choice · **Pattern:** Confidence-gated routing

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/36-confidence-escalation/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/36-confidence-escalation/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/36-confidence-escalation/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

The queue needs both an answer and a separate decision about whether to trust it.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Clear billing

```json
{
  "ticket": "Please refund the duplicate charge."
}
```

Illustrative values: `{"team":"billing"}`.

### Ambiguous ticket

```json
{
  "ticket": "My plan does not work like I expected."
}
```

Illustrative values: `{"team":"technical"}`.

## Questions

```json
{
  "team": {
    "type": "choice",
    "instructions": "Select the best team for the ticket.",
    "criteria": {
      "billing": "Payments or refunds",
      "technical": "Errors or broken behavior",
      "sales": "Purchase requests"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "team",
  "confidence": 0.7
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

The 0.70 Jev threshold is illustrative. OpenAI has no directly comparable native confidence in this baseline; its panel shows an ungated candidate, not equivalent automated coverage.

## Sources

- [TypeSafe confidence routing](https://docs.typesafe.ai/patterns/confidence-routing)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
