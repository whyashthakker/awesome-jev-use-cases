# Agent tool routing: Jev vs OpenAI

Choose one tool from a fixed tool registry.

**Primitive:** choice · **Pattern:** Atomic Choice

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/33-tool-routing/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/33-tool-routing/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/33-tool-routing/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

An agent orchestrator needs a function name to dispatch.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Arithmetic

```json
{
  "request": "What is 18 multiplied by 24?"
}
```

Illustrative values: `{"tool":"calculator"}`.

### Calendar

```json
{
  "request": "Am I free tomorrow afternoon?"
}
```

Illustrative values: `{"tool":"calendar"}`.

## Questions

```json
{
  "tool": {
    "type": "choice",
    "instructions": "Which tool fits the request?",
    "criteria": {
      "calculator": "Arithmetic",
      "search": "Find external information",
      "calendar": "Inspect calendar availability",
      "none": "No listed tool fits"
    }
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "tool"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

Shows selection only; tools do not execute. Arithmetic itself belongs in a calculator.

## Sources

- [TypeSafe function calling](https://docs.typesafe.ai/cookbooks/function_calling)
- [AWS routing workflows](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-patterns/workflow-for-routing.html)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
