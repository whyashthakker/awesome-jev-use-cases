# Research behind the 50 Jev use cases

Reviewed on 2026-09-20. The collection combines the user's requested examples, TypeSafe's documented patterns and cookbooks, and recurring workflows described by other primary technical sources. **It is not a popularity ranking.** No search-volume or adoption statistics were established.

## Documentation-first selection

The starting point was TypeSafe's [complete documentation index](https://docs.typesafe.ai/llms.txt), followed by the [introduction](https://docs.typesafe.ai/introduction), [API contract](https://docs.typesafe.ai/api), [primitives](https://docs.typesafe.ai/primitives), [confidence](https://docs.typesafe.ai/confidence), [patterns](https://docs.typesafe.ai/patterns), [industry use-case map](https://docs.typesafe.ai/concepts/use-case-map) and [known model limitations](https://docs.typesafe.ai/model-jaggedness/jev-1.13).

Every example folder carries its own source links. The example prompts and fixtures are original, small synthetic scenarios; source links establish architectural precedent, not measured Jev capability on those inputs.

| Documentation concept | Examples in this repository |
| --- | --- |
| Choice, Score, Noul on one state | Support ticket: three primitives |
| Independent questions / fan-out | Moderation, batch classification, speculative support |
| Confidence-gated routing | Confidence-gated support routing |
| Composite scoring | Response quality, demand features |
| Intent and tool routing | Support, lead intent, tool routing, model escalation |
| Re-ranking | Products and search results |
| RAG verification | Passage filtering, prompt-injection triage, citation checking |
| Bounded extraction | Email spans, date components, product attributes |
| Structure recovery | Document block classification |
| Entity alignment | Catalog records, alert grouping |
| Hierarchical classification | Product taxonomy slice |
| Skill suggestion | Skill choice plus an independent need check |
| Extraction cascade | Candidate extraction verifier |
| Semantic feature extraction | Churn intent, demand signals |

The full cookbooks can contain multiple stages, retrieval systems or learned models. Our examples intentionally isolate one decision; they do not claim to reproduce entire cookbook systems.

## Independent primary sources

- [AWS routing workflows](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-patterns/workflow-for-routing.html): routing as a classifier that selects specialized handlers.
- [Anthropic ticket-routing guide](https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing): customer-support classification as a concrete LLM workflow.
- [Cohere reranking](https://docs.cohere.com/docs/rerank): query-to-candidate relevance ranking after retrieval.
- [OpenAI evaluation graders](https://developers.openai.com/api/docs/guides/graders): reference-based and score-based evaluation patterns.
- [LiveKit turn handling](https://docs.livekit.io/agents/logic/turns/): interruptions, backchannels and endpointing; the local example demonstrates only the text-semantic part.
- [SUMO traffic signals](https://sumo.dlr.de/docs/Simulation/Traffic_Lights.html): phase selection and signal simulation motivate the traffic illustration, not a real-world Jev controller.
- [Farama HighwayEnv intersection](https://highway-env.farama.org/environments/intersection/): a primary reference for small driving decision environments. Our SVG does not implement HighwayEnv physics.
- [AWS fraud detection patterns](https://docs.aws.amazon.com/frauddetector/latest/ug/what-is-frauddetector.html): risk scores feeding explicit review rules. The Jev example is not a replacement for trained fraud detection.
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) and [GPT-4o Mini](https://developers.openai.com/api/docs/models/gpt-4o-mini): basis for the requested OpenAI comparator and fair structured baseline.

## Why these examples

Each use case has a bounded output that directly changes a small visual: a route, a ranked list, a gauge, a graph link, a review gate or a top-down action. A generative response is unnecessary for that specific step, although an LLM may still be appropriate elsewhere in the workflow. Exact arithmetic, randomized A/B allocation and permission enforcement stay outside model judgment.

[Catalog](../README.md) · [Methodology](methodology.md)
