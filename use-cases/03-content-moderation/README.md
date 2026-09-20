# Content moderation triage: Jev vs OpenAI

Combine abuse detection with a moderation category.

**Primitive:** noul + choice · **Pattern:** Noul + Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/03-content-moderation/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/03-content-moderation/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/03-content-moderation/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A high-volume triage step needs a flag and a category before human review.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Personal attack

```json
{
  "message": "You are an idiot. Nobody wants you here."
}
```

Illustrative values: `{"abuse":0.96,"category":"insult"}`.

### Product criticism

```json
{
  "message": "This release is slow and the interface is confusing."
}
```

Illustrative values: `{"abuse":0.04,"category":"ordinary"}`.

## Questions

```json
{
  "abuse": {
    "type": "noul",
    "instructions": "Does the message directly insult or threaten a person?"
  },
  "category": {
    "type": "choice",
    "instructions": "Classify the message tone.",
    "criteria": {
      "ordinary": "Normal discussion",
      "insult": "Targeted personal insult",
      "threat": "Threat of harm"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "noul",
  "key": "abuse",
  "low": 0.2,
  "high": 0.8,
  "yes": "Moderation queue",
  "no": "Publish in sandbox"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe LLM guardrails](https://docs.typesafe.ai/cookbooks/llm_guardrails)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
