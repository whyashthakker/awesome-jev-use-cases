# Game NPC decisions: Jev vs OpenAI

Choose the next action for a top-down game character.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/04-game-npc/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/04-game-npc/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/04-game-npc/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A game loop consumes an action enum; dialogue generation is a separate task.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Low health

```json
{
  "health": "critical",
  "enemy": "nearby",
  "cover": "behind NPC"
}
```

Illustrative values: `{"action":"retreat"}`.

### Clear patrol

```json
{
  "health": "full",
  "enemy": "none visible",
  "cover": "behind NPC"
}
```

Illustrative values: `{"action":"patrol"}`.

## Questions

```json
{
  "action": {
    "type": "choice",
    "instructions": "Choose the NPC action given the supplied tactical facts.",
    "criteria": {
      "retreat": "Threat nearby and health critical",
      "attack": "Threat in range and health sufficient",
      "patrol": "No immediate threat"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "action"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Discrete toy turns, not a frame-time benchmark. No claim that a network model can meet a real-time game frame budget.

## Sources

- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
