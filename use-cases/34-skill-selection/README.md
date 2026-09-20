# Agent skill selection: Jev vs OpenAI

Pick a relevant skill and independently check whether any skill is needed.

**Primitive:** choice + noul · **Pattern:** Speculative Choice + Noul

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/34-skill-selection/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/34-skill-selection/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/34-skill-selection/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

The agent needs one catalog ID or a no-skill branch.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Deck request

```json
{
  "request": "Create a six-slide presentation from these notes."
}
```

Illustrative values: `{"skill":"slides","needed":0.99}`.

### Simple greeting

```json
{
  "request": "Hello, how are you?"
}
```

Illustrative values: `{"skill":"pdf","needed":0.01}`.

## Questions

```json
{
  "skill": {
    "type": "choice",
    "instructions": "Which skill best fits the request?",
    "criteria": {
      "pdf": "Read or write PDF",
      "slides": "Build slide decks",
      "spreadsheet": "Work with spreadsheets"
    }
  },
  "needed": {
    "type": "noul",
    "instructions": "Does the request need PDF, slides or spreadsheet tooling?"
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "skill",
  "require": "needed"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

The code suppresses the forced Choice when no listed skill is needed. Skill execution is outside this demo.

## Sources

- [TypeSafe skill suggestion](https://docs.typesafe.ai/cookbooks/skill_suggestion)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
