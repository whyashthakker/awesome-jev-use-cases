# Support ticket: Choice, Noul & Score: Jev vs OpenAI

Ask three different questions about the same flight-refund ticket.

**Primitive:** choice + noul + score · **Pattern:** Choice + Noul + Score

## Run

From the repository root:

```bash
npm install
npm start
# Open http://127.0.0.1:3000/use-cases/01-support-ticket-routing/

# CLI fixture preview, no keys:
node --env-file-if-exists=.env use-cases/01-support-ticket-routing/run.js
# Actual provider requests, after setting both keys:
node --env-file-if-exists=.env use-cases/01-support-ticket-routing/run.js --live
```

Use `--scenario=1` for the second input and `--text` for the plain-text OpenAI baseline. The browser also supports editable live input and JSON export.

## Why this decision fits

The application needs one queue key per ticket; a written answer adds no routing value.

Jev receives the state and typed questions directly. OpenAI uses `client.responses.create({ model: "gpt-6-astra", input, ... })` with the same state and question definitions, plus a matching JSON schema by default. Both results are validated before the same local decision policy is applied.

## Inputs

### Flight refund

```json
"My flight was cancelled and I need a refund before Friday, this is honestly ridiculous."
```

Illustrative values: `{"department":"billing","refund":0.95,"frustration":1.65}`.

### Calm sales question

```json
"Hello, could you tell me which plan includes team accounts? Thank you."
```

Illustrative values: `{"department":"sales","refund":0.02,"frustration":0.05}`.

## Questions

```json
{
  "department": {
    "type": "choice",
    "instructions": "Which department should handle this ticket?",
    "criteria": {
      "billing": "Refunds, charges and payment issues",
      "technical": "Software bugs and integration failures",
      "sales": "New purchases and plan questions"
    }
  },
  "refund": {
    "type": "noul",
    "instructions": "Does this message request a refund?"
  },
  "frustration": {
    "type": "score",
    "instructions": "How frustrated does the customer sound?",
    "criteria": [
      "Calm",
      "Concerned",
      "Very angry"
    ]
  }
}
```

## Decision policy

```json
{
  "kind": "choice",
  "key": "department"
}
```

## What to compare

Compare task agreement on your labeled data, observed request latency, reported token usage, parsing failures, and native Jev distributions where available. Preview fixtures are not model predictions, accuracy labels, or timing measurements. OpenAI's Noul-like values are self-reported estimates; they are not equivalent to Jev's native probabilities.

## Limits

The preview probabilities and confidence are illustrative, not API measurements. Noul 0.5 means uncertainty, not medium intensity. Score runs from 0 to 2 here and can fall between levels.

## Sources

- [TypeSafe intent routing](https://docs.typesafe.ai/patterns/intent-routing)
- [AWS routing workflows](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-patterns/workflow-for-routing.html)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

These sources motivate the pattern; the small scenarios here are original synthetic examples.

[All 50 demos](../../README.md) · [Comparison methodology](../../docs/methodology.md)
