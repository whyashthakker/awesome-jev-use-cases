# Smart home intent: Jev vs OpenAI

Route a natural-language request to a known room action.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/16-smart-home/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/16-smart-home/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/16-smart-home/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

Home automation needs a bounded command, not an essay.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Lights please

```json
{
  "request": "Turn on the living room light."
}
```

Illustrative values: `{"command":"light_on"}`.

### Good night

```json
{
  "request": "Switch off the living room light."
}
```

Illustrative values: `{"command":"light_off"}`.

## Questions

```json
{
  "command": {
    "type": "choice",
    "instructions": "Which supported command is explicitly requested?",
    "criteria": {
      "light_on": "Turn living room light on",
      "light_off": "Turn living room light off",
      "none": "Anything else or unclear request"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "command"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Local illustration only. No home devices are connected.

## Sources

- [TypeSafe function calling](https://docs.typesafe.ai/cookbooks/function_calling)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
