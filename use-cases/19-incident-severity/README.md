# Incident severity triage: Jev vs OpenAI

Score an operational incident for the response queue.

**Primitive:** score · **Pattern:** Atomic Score

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/19-incident-severity/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/19-incident-severity/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/19-incident-severity/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

On-call routing needs a severity value before a long incident summary.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Checkout outage

```json
{
  "report": "All customers see errors at checkout; no payment can complete."
}
```

Illustrative values: `{"severity":2}`.

### Icon alignment

```json
{
  "report": "A settings icon is misaligned but every control works."
}
```

Illustrative values: `{"severity":0}`.

## Questions

```json
{
  "severity": {
    "type": "score",
    "instructions": "Rate impact described by this report.",
    "criteria": [
      "Cosmetic issue, service usable",
      "Partial degradation with workaround",
      "Core service unavailable to many users"
    ]
  }
}
```

## Decision policy

```json
{
  "kind": "score",
  "key": "severity",
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
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
