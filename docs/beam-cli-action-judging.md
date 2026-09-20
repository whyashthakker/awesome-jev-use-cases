# Applied use case: optional agent-action judging with Beam CLI

[Beam CLI](https://github.com/whyashthakker/beam-cli) uses Jev to review a proposed coding-agent action with **Noul**, **Score**, or both. It is a separate, optional integration alongside this repository's 50 visual comparison demos. It does not add a 51st simulated benchmark or require OpenAI credentials.

Read the [Beam integration walkthrough](https://agentbeam.com/blog/beam-cli-jev-action-judging), inspect the [implementation](https://github.com/whyashthakker/beam-cli/blob/main/src/jev.ts), and review the [bundled agent skill](https://github.com/whyashthakker/beam-cli/tree/main/Skills/jev-action-judge).

## The bounded decision

A coding agent proposes a tool call. Local Beam policy runs first. If the action is eligible and the operator has enabled Jev, Beam sends selected, redacted action fields to TypeSafe and combines typed answers in code.

| Primitive | Question in this integration | Result handling |
| --- | --- | --- |
| Noul | Does the action expose private data or credentials externally? | One yes/no probability. |
| Noul | Does it irreversibly delete or overwrite existing user data? | A separate probability; no combined question. |
| Score | How much damage could it cause to existing systems or data? | Four descriptive levels, range 0–3, distribution and confidence. |

A Noul at least 0.8 or a Score at least 2 yields `deny`. Noul passes when both answers are at most 0.2. Score passes when it is at most 0.5 with confidence at least 0.7. Intermediate outcomes yield `review`. With both primitives selected, any denial wins, then any review. These are Beam's initial thresholds, not benchmark results or provider-certified safety levels.

## Try an explicit judgment

Use a Beam revision that includes `beam jev --help`; see the source-install instructions in the walkthrough if your npm version does not yet include it. Supply `TYPESAFE_API_KEY` through your environment or secret manager, then configure observation:

```bash
beam jev configure --mode observe --primitive both
beam jev status
```

For hooks that do not inherit that environment, pipe your key from a secret manager into `beam jev configure --key-stdin`. Do not type a literal key into command arguments. The stored file is private to the account by mode 0600; it is not an encrypted vault.

Save `action.json`:

```json
{
  "action": { "tool": "Bash", "command": "git diff --stat" },
  "context": "Inspect workspace changes without modifying files."
}
```

```bash
beam jev judge action.json --dry-run
beam jev judge action.json
beam jev disable
```

Dry-run prints redacted state and questions locally; it does not need a key or make a request. A real judgment returns JSON and exits 0 for allow, 2 for review/deny or 1 for error. It does not execute the action. No specific model answer is promised for the example above.

## Why optionality matters

Jev is off by default. A key alone does not enable it, and the normal Beam setup flow does not enable it. Observation reports hook judgments without changing Beam's local decision, even when the provider is unavailable. Only an explicit `beam jev configure --mode enforce --primitive both` enables blocking for eligible pre-tool checks.

With valid enabled enforcement settings, review, denial and request failure block the action. Invalid configuration reports an error and skips the optional integration; it must be repaired before relying on Jev coverage. Local deny, approval and redaction decisions always take precedence and skip the provider. An agent cannot change its own Jev settings through Beam's protected hooks; the operator configures them directly.

This works through Beam's existing pre-tool hook path, not every process or MCP connection on the machine. Prompt and post-tool events skip Jev. The explicit command can be used without a running collector. Offline `beam scan` remains offline.

## Data and evidence boundaries

Enabling the integration sends data to TypeSafe and may incur API charges. Automatic checks include agent, tool, tool input and command. They do not load transcripts, referenced file contents or environment values automatically. Tool input itself can still contain private source or data. Redaction is heuristic, so inspect and minimize the information you send.

Requests use a fixed HTTPS endpoint, a two-second timeout and no automatic retries. Input is limited to 32 KB and response bodies to 64 KB. Disabling removes the stored key but does not revoke it with TypeSafe or clear external environment variables.

Beam's automated tests exercise synthetic fixtures and mocked transport, including policy precedence and hook output. They do not establish Jev's live accuracy, latency, attack resistance or native client enforcement. Keep evaluation, authorization and actual execution as separate facts.

## Related visual examples

- [LLM output guardrail](../use-cases/06-output-guardrail/): a bounded Noul check.
- [Jev as judge](../use-cases/11-jev-as-judge/): choosing between outputs.
- [Prompt injection triage](../use-cases/28-prompt-injection/): treating retrieved instructions as untrusted data.
- [Composite response quality](../use-cases/37-response-quality/): separate Score dimensions and composition in code.

Primary semantics: [Noul](https://docs.typesafe.ai/primitives/noul), [Score](https://docs.typesafe.ai/primitives/score), [API reference](https://docs.typesafe.ai/api). [Back to all use cases](../README.md).
