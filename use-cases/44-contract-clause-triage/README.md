# Contract clause triage: Jev vs OpenAI

Route a clause to the relevant review checklist.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/44-contract-clause-triage/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/44-contract-clause-triage/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/44-contract-clause-triage/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

Review software needs a clause type before applying a checklist.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Confidentiality clause

```json
{
  "text": "Each party shall protect the other party confidential information."
}
```

Illustrative values: `{"clause":"confidentiality"}`.

### Payment clause

```json
{
  "text": "Invoices are payable within thirty days of receipt."
}
```

Illustrative values: `{"clause":"payment"}`.

## Questions

```json
{
  "clause": {
    "type": "choice",
    "instructions": "Classify this clause topic, without giving legal advice.",
    "criteria": {
      "confidentiality": "Protecting confidential information",
      "termination": "Ending the agreement",
      "payment": "Fees and payment timing",
      "other": "Other subject"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "clause"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Topic classification only; not legal advice or a finding of compliance.

## Sources

- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
