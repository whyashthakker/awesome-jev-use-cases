# Ad placement brand safety: Jev vs OpenAI

Check whether a placement conflicts with a stated brand rule.

**Primitive:** noul · **Pattern:** Atomic Noul

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/47-brand-safety/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/47-brand-safety/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/47-brand-safety/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

An ad pipeline needs a suitability flag per placement.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Casino content

```json
{
  "placement": "Live casino bonuses and betting tips."
}
```

Illustrative values: `{"unsuitable":0.99}`.

### Family recipe

```json
{
  "placement": "How to bake banana bread with children."
}
```

Illustrative values: `{"unsuitable":0.02}`.

## Questions

```json
{
  "unsuitable": {
    "type": "noul",
    "instructions": "Does placement promote gambling? This family brand excludes gambling placements."
  }
}
```

## Decision policy

```json
{
  "kind": "noul",
  "key": "unsuitable",
  "low": 0.2,
  "high": 0.8,
  "yes": "Flag for review",
  "no": "Continue"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Illustrates one advertiser-defined rule; suitability is context-dependent.

## Sources

- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
