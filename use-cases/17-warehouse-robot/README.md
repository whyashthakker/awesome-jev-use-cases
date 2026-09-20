# Warehouse robot routing: Jev vs OpenAI

Choose a next corridor from semantic obstruction reports.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/17-warehouse-robot/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/17-warehouse-robot/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/17-warehouse-robot/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A robot planner can consume an enum while a geometric planner owns movement.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Left blocked

```json
{
  "left": "fallen box",
  "right": "clear"
}
```

Illustrative values: `{"route":"right"}`.

### Both blocked

```json
{
  "left": "fallen box",
  "right": "person working"
}
```

Illustrative values: `{"route":"wait"}`.

## Questions

```json
{
  "route": {
    "type": "choice",
    "instructions": "Choose the available corridor; wait if neither is clear.",
    "criteria": {
      "left": "Left clear, right blocked",
      "right": "Right clear, left blocked",
      "wait": "Both blocked or uncertain"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "route"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Toy grid with text facts. Not robot navigation, obstacle perception or a safety controller.

## Sources

- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
