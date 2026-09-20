# Autonomous driving decisions: Jev vs OpenAI

Choose a maneuver for a vehicle in a tiny top-down scene.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/13-autonomous-driving/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/13-autonomous-driving/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/13-autonomous-driving/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

The next maneuver is a closed action set, while motion and collision checks belong in code.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Blocked lanes

```json
{
  "ahead": "stopped vehicle",
  "left": "occupied",
  "right": "road edge"
}
```

Illustrative values: `{"maneuver":"brake"}`.

### Clear left lane

```json
{
  "ahead": "stopped vehicle",
  "left": "verified clear",
  "right": "road edge"
}
```

Illustrative values: `{"maneuver":"left"}`.

## Questions

```json
{
  "maneuver": {
    "type": "choice",
    "instructions": "Choose a cautious toy maneuver from the described lane facts.",
    "criteria": {
      "brake": "Obstacle ahead and no verified clear adjacent lane",
      "left": "Obstacle ahead and left lane explicitly clear",
      "cruise": "Lane ahead clear"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "maneuver"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Synthetic text-to-maneuver visualization. Not a driving stack; no perception, trajectory planning or real-vehicle validation.

## Sources

- [Farama HighwayEnv intersection](https://highway-env.farama.org/environments/intersection/)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
