# Pre-parsed email selection: Jev vs OpenAI

Pick a billing email from candidates already found by a parser.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/39-email-span-extraction/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/39-email-span-extraction/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/39-email-span-extraction/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

The caller needs an existing span ID instead of a newly generated email address.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Billing second

```json
{
  "text": "Support: help@example.com. Billing: accounts@example.com.",
  "candidates": [
    "help@example.com",
    "accounts@example.com"
  ]
}
```

Illustrative values: `{"span":"email_2"}`.

### Billing first

```json
{
  "text": "Billing: finance@example.com. Sales: buy@example.com.",
  "candidates": [
    "finance@example.com",
    "buy@example.com"
  ]
}
```

Illustrative values: `{"span":"email_1"}`.

## Questions

```json
{
  "span": {
    "type": "choice",
    "instructions": "Which candidate is explicitly identified as the billing contact?",
    "criteria": {
      "email_1": "First candidate",
      "email_2": "Second candidate",
      "none": "No billing email stated"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "span"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Candidates are supplied fixtures. A production parser should discover and validate spans in code.

## Sources

- [TypeSafe pre-parsed extraction](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
