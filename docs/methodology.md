# Jev vs OpenAI comparison methodology

These demos compare **a native decision API** with **a generative model producing structured decisions**. They do not demonstrate that one provider is always faster, cheaper, more accurate, or better for every task.

## What stays the same

Both providers receive the same state, question instructions, Choice options, and Score rubric. Questions in a batch are independent. The same local policy consumes validated values. No hidden reference answer is sent to either provider. Default models are `jev-latest` and the user-requested `gpt-4o-mini`; returned model IDs are saved in exported results.

Jev uses `POST https://api.typesafe.ai/v1/systemone`. OpenAI uses `client.responses.create()` with strict JSON Schema by default. The optional text baseline asks for JSON without schema-constrained generation. It is a second integration example, not the default benchmark opponent. OpenAI also receives output-format instructions; the model tasks and state remain identical.

## Preview versus live

**Preview** uses one hand-authored fixture per scenario in both panels. It makes no provider request. Timings and token counts are null. Some Jev fixtures illustrate a probability distribution and confidence, explicitly labeled illustrative. These numbers are not observed model results or a calibrated test dataset. Preview intentionally ignores textarea edits.

**Live** starts one request per provider concurrently. Each panel renders when its own request completes. One provider failing does not erase the other's result. No fixture is substituted for a failed live request. A normal comparison makes two paid calls; running each primitive separately makes separate calls. There is no automated loop, hidden retry, or automatic fallback model.

Timing measures the local server's request, response parsing, and validation. It includes network effects; it is not model-only compute time or browser round-trip time. Each provider has a 45-second timeout, and retries are disabled to keep single-call comparisons interpretable. Rate-limit and overload errors remain visible. A production integration should add an explicit, logged backoff policy appropriate to the provider.

## Interpret the outputs correctly

| Value | Jev | OpenAI baseline |
| --- | --- | --- |
| Choice | Native option, probability distribution and confidence | Validated generated option key |
| Score | Native probability-weighted value, distribution, legend and confidence | Validated generated rubric value |
| Noul | Native yes/no probability, no separate confidence | Generated self-reported probability estimate |
| Usage | Provider-reported token usage | Provider-reported token usage |
| Cost | Estimated from reported input tokens | Estimated from reported input, cache and output tokens |

A Noul near **0.5 means uncertainty**, not medium intensity. Independent conditions need independent Nouls; a Choice is a competition among options. A Score uses indices from **0 through N−1**, may be fractional, and is not an exact numerical measurement. Choice/Score confidence is distinct from the selected option's probability.

The confidence-routing demo deliberately shows a Jev-specific capability: low native confidence triggers review. OpenAI's panel shows an ungated candidate because this baseline has no comparable native confidence. Do not compare their automated coverage as if the policies were equivalent. Other demos apply the same deterministic policy. Noul thresholds are illustrative and require separate calibration for each provider.

## Estimated cost per run

Each live panel shows its own request's estimated **USD token cost** beside elapsed time. Prices were verified on **2026-09-20**:

- [TypeSafe Jev 1.13](https://docs.typesafe.ai/models): $0.042 per million input tokens; output free.
- [OpenAI GPT-4o Mini](https://developers.openai.com/api/docs/models/gpt-4o-mini): $0.15 input, $0.075 cached input, and $0.60 output per million tokens at standard pricing.

The adapter explicitly requests OpenAI's default service tier. The estimator recognizes both `gpt-4o-mini` and its `gpt-4o-mini-2024-07-18` snapshot at the default tier; other returned tiers show Unavailable. There is no separate cache-write surcharge or long-context multiplier. Input tokens are partitioned into ordinary input, cache reads and cache writes so they are not double-counted. Output tokens already include reasoning tokens. Absent cache counts are treated as zero; missing or invalid overall usage makes cost unavailable.

Formula: sum of each token category × its USD rate per million ÷ 1,000,000. Response details and JSON exports retain full precision, rates, token breakdown, source and verification date. The UI shows six decimals (positive amounts smaller than that display `<$0.000001`). Preview costs are $0 for local fixture playback, not hypothetical model calls.

These are list-price estimates, not invoices; taxes, credits and negotiated prices are excluded. Unknown returned model versions or service tiers show **Unavailable** until their rates are verified in `shared/pricing.js`. Jev aliases use the published 1.13 rates only when the API returns a known identifier. Failed requests have no cost estimate and may still be billable; this is not a cumulative billing ledger.

## How to make a useful evaluation

1. Collect a representative, held-out, human-labeled dataset for the actual task. Include ambiguous and adversarial inputs.
2. Freeze questions, policy, model identifiers and provider settings. Model aliases can change; record returned versions.
3. Warm up separately, randomize provider order or explicitly record concurrent testing, repeat trials and retain errors. Report sample count and p50/p95 latency, not a winning single request.
4. Report classification accuracy and macro F1, or rubric error for scores. Evaluate calibration separately; agreement with a fixture is not proof of correctness.
5. Include rejection and review rates. Evaluate human-reviewed outcomes for confidence-gated systems.
6. Calculate cost only with verified current prices and applicable account/service-tier rules. Providers count tokens differently; token count alone is not a dollar comparison.
7. Compare with a relevant small classifier, specialized model and deterministic rules too. `gpt-4o-mini` is the requested baseline, not a representative average of all LLMs.

## Boundaries

The top-down driving, robot, NPC and traffic scenes demonstrate one discrete semantic decision, not a simulator benchmark. Driving lane and traffic crossing interlocks override unsafe candidate actions in code. They do not constitute a complete safety system. Voice examples operate on text; e-learning examples are formative toys; financial/legal examples only triage synthetic content. No real external action is executed.

TypeSafe documents limitations around arithmetic, dates, indirection, irrelevant context and adversarial state. Keep exact computations in code, retrieve concise context, and use generative models for writing or open-ended synthesis. [TypeSafe limitations](https://docs.typesafe.ai/model-jaggedness/jev-1.13).

[OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) · [TypeSafe API](https://docs.typesafe.ai/api) · [All examples](../README.md)
