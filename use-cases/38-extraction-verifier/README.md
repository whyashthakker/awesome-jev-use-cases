# Structured extraction verifier: Jev vs OpenAI

Verify a candidate extraction against source text before accepting it.

**Primitive:** noul · **Pattern:** Atomic Noul

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/38-extraction-verifier/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/38-extraction-verifier/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/38-extraction-verifier/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A cascade needs a pass-or-review signal, not regenerated extraction.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Matching record

```json
{
  "source": "Order A17 contains two blue mugs.",
  "extracted": {
    "order": "A17",
    "item": "blue mugs",
    "quantity": 2
  }
}
```

Illustrative values: `{"correct":0.99}`.

### Wrong item

```json
{
  "source": "Order A17 contains two blue mugs.",
  "extracted": {
    "order": "A17",
    "item": "red plates",
    "quantity": 2
  }
}
```

Illustrative values: `{"correct":0.01}`.

## Questions

```json
{
  "correct": {
    "type": "noul",
    "instructions": "Does the extracted object accurately reflect all stated fields in the source?"
  }
}
```

## Decision policy

```json
{
  "kind": "noul",
  "key": "correct",
  "low": 0.2,
  "high": 0.8,
  "yes": "Accept candidate",
  "no": "Escalate extraction"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe extraction cascade](https://docs.typesafe.ai/cookbooks/sde_cascade)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
