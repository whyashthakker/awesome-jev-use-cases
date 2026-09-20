# Email urgency triage: Jev vs OpenAI

Identify time-sensitive language in an inbox.

**Primitive:** noul · **Pattern:** Atomic Noul

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/24-email-priority/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/24-email-priority/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/24-email-priority/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A priority badge needs one urgency signal rather than an email summary.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Deadline today

```json
{
  "email": "Production is down. We need the fix before this afternoon launch."
}
```

Illustrative values: `{"urgent":0.98}`.

### Future suggestion

```json
{
  "email": "When you have time next month, consider new icon colors."
}
```

Illustrative values: `{"urgent":0.04}`.

## Questions

```json
{
  "urgent": {
    "type": "noul",
    "instructions": "Does this email explicitly describe a time-sensitive problem or near-term deadline?"
  }
}
```

## Decision policy

```json
{
  "kind": "noul",
  "key": "urgent",
  "low": 0.2,
  "high": 0.8,
  "yes": "Urgent inbox",
  "no": "Normal inbox"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
