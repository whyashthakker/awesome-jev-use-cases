# Traffic signal selection: Jev vs OpenAI

Choose a toy intersection phase from precomputed queue conditions.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/12-traffic-signals/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/12-traffic-signals/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/12-traffic-signals/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

The controller needs a phase enum and code-enforced interlocks.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### North queue

```json
{
  "dominant_demand": "north-south",
  "crossing": "clear",
  "emergency_hold": false
}
```

Illustrative values: `{"phase":"north_south"}`.

### Crossing occupied

```json
{
  "dominant_demand": "east-west",
  "crossing": "pedestrian present",
  "emergency_hold": false
}
```

Illustrative values: `{"phase":"all_red"}`.

## Questions

```json
{
  "phase": {
    "type": "choice",
    "instructions": "Choose the next phase using the supplied priority facts.",
    "criteria": {
      "north_south": "North-south demand is dominant and crossing is clear",
      "east_west": "East-west demand is dominant and crossing is clear",
      "all_red": "Crossing occupied or emergency hold"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "phase"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Educational phase visualization only. No road infrastructure connection, timing optimization, safety certification or real-time control claim.

## Sources

- [SUMO traffic signal simulation](https://sumo.dlr.de/docs/Simulation/Traffic_Lights.html)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
