# Voice-agent turn-taking: Jev vs OpenAI

Decide whether a transcript fragment signals an interruption.

**Primitive:** noul · **Pattern:** Atomic Noul

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/08-voice-turn-taking/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/08-voice-turn-taking/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/08-voice-turn-taking/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

A conversational controller needs a stop-or-continue signal, not prose.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-4o-mini", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Explicit interruption

```json
{
  "transcript": "Wait, stop. That is not what I meant.",
  "assistant": "speaking"
}
```

Illustrative values: `{"interrupt":0.99}`.

### Backchannel

```json
{
  "transcript": "Mm-hmm, yes.",
  "assistant": "speaking"
}
```

Illustrative values: `{"interrupt":0.08}`.

## Questions

```json
{
  "interrupt": {
    "type": "noul",
    "instructions": "Is the user asking the speaking assistant to stop or yield the turn?"
  }
}
```

## Decision policy

```json
{
  "kind": "noul",
  "key": "interrupt",
  "low": 0.2,
  "high": 0.8,
  "yes": "Yield turn",
  "no": "Continue speaking"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Text-only semantic demonstration. Audio VAD, endpointing and production voice latency are not implemented.

## Sources

- [LiveKit turn detection](https://docs.livekit.io/agents/build/turns/)
- [TypeSafe use-case map](https://docs.typesafe.ai/concepts/use-case-map)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
