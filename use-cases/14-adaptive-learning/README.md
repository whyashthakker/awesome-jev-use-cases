# Adaptive e-learning: Jev vs OpenAI

Select the next lesson from a learner explanation.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/14-adaptive-learning/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/14-adaptive-learning/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/14-adaptive-learning/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A learning path needs a next-step ID; teaching prose can be generated separately.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Foundational gap

```json
{
  "explanation": "The denominator is the number of pieces I have and the numerator is always the total."
}
```

Illustrative values: `{"lesson":"basics"}`.

### Ready for more

```json
{
  "explanation": "One half equals two quarters because multiplying both parts by two preserves the ratio."
}
```

Illustrative values: `{"lesson":"advance"}`.

## Questions

```json
{
  "lesson": {
    "type": "choice",
    "instructions": "Select the next lesson based on the learner explanation.",
    "criteria": {
      "basics": "Misunderstands numerator and denominator",
      "practice": "Understands terms but needs equivalent fraction practice",
      "advance": "Correctly explains equivalent fractions"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "lesson"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Learning support only. These two fixtures do not measure teaching quality or justify high-stakes student assessment.

## Sources

- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
