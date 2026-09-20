# Student answer scoring: Jev vs OpenAI

Evaluate a short science answer against a visible rubric.

**Primitive:** score · **Pattern:** Atomic Score

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/15-answer-rubric/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/15-answer-rubric/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/15-answer-rubric/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A formative feedback widget needs a rubric score before composing feedback.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Complete concept

```json
{
  "answer": "Liquid water gains energy and becomes water vapor."
}
```

Illustrative values: `{"quality":2}`.

### Misconception

```json
{
  "answer": "Water disappears forever when the sun shines."
}
```

Illustrative values: `{"quality":0}`.

## Questions

```json
{
  "quality": {
    "type": "score",
    "instructions": "Grade the answer: evaporation is liquid water changing into water vapor.",
    "criteria": [
      "Incorrect or unrelated",
      "Mentions water leaving but misses vapor",
      "Correctly describes liquid changing into vapor"
    ]
  }
}
```

## Decision policy

```json
{
  "kind": "score",
  "key": "quality",
  "max": 2,
  "threshold": 1,
  "high": "Prioritize",
  "low": "Standard queue"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic examples demonstrate an integration pattern. Validate on representative labeled data before choosing a model or an operating threshold.

## Sources

- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI evaluation graders](https://developers.openai.com/api/docs/guides/graders)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
