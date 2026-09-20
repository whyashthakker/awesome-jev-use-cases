# Policy checklist screening: Jev vs OpenAI

Check a draft against an explicit local publishing rule.

**Primitive:** noul · **Pattern:** Atomic Noul

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/45-policy-compliance/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/45-policy-compliance/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/45-policy-compliance/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A publishing workflow needs a policy flag, not a general compliance essay.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Prohibited promise

```json
{
  "draft": "Invest here and you are guaranteed to double your money."
}
```

Illustrative values: `{"violation":0.99}`.

### Risk-aware statement

```json
{
  "draft": "Returns vary and losses are possible."
}
```

Illustrative values: `{"violation":0.01}`.

## Questions

```json
{
  "violation": {
    "type": "noul",
    "instructions": "Does draft promise a guaranteed investment return? Policy prohibits guaranteed-return claims."
  }
}
```

## Decision policy

```json
{
  "kind": "noul",
  "key": "violation",
  "low": 0.2,
  "high": 0.8,
  "yes": "Flag for review",
  "no": "Continue"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Checks one fictional publishing rule. It does not determine legal or regulatory compliance.

## Sources

- [TypeSafe LLM guardrails](https://docs.typesafe.ai/cookbooks/llm_guardrails)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
