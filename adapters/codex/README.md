# First Codex reference consumer

This is a local context-delivery experiment for the existing destructive-action pattern. It produces a task-scoped Markdown packet for Codex. It does not call an LLM, start a Codex task, implement deletion, modify Forma, or establish new design authority. It is not an adapter framework, service, MCP server or persistent agent configuration.

## Boundary and invocation

```text
Authored Design Genome → existing compiler → generated/forma-genome.json
                                              ↓ existing graph resolver
                                         Codex context formatter
                                              ↓ explicit attachment/paste
                                         implementation task
```

Prepare the compiled artifact upstream, then run the consumer:

```sh
npm run genome:generate
npm run genome:check
npm run codex:context
```

Only the first two commands read authored sources. `codex:context` reads **only** `generated/forma-genome.json` and imports the existing query implementation. It does not import compiler or Genome modules at runtime, inspect React/CSS, fetch documents, or follow source paths. Tests prove it runs with those three files alone. Missing or malformed inputs fail clearly and remove any previous output.

The output is `generated/codex-destructive-action.md`, ignored by Git. It is a generated consumer projection, not authority; do not edit it. Regenerate it after upstream changes. The command supports only the explicit `forma.patterns.destructive-action` seed. The fixed proposed request is:

> Add a destructive action allowing a user to delete a project.

This is the controlled example, not a natural-language classifier. The packet itself does not authorize implementation. **No deletion feature or comparison runs are performed in this milestone.**

For a context-only delivery check in a fresh Codex task, paste the generated packet or explicitly attach/name that file and use:

> Read the supplied destructive-action context packet. Do not implement or modify any files. Identify the proposed task, governed component contracts, conditional association, exception status, and remaining human-review requirements. Use the supplied context rather than rediscovering design policy from repository sources.

No persistent `AGENTS.md`, skill, model choice, plugin, or project configuration is added. Explicit invocation keeps unrelated work unaffected and the baseline experiment uncontaminated. Official [OpenAI prompting guidance](https://learn.chatgpt.com/docs/prompting) describes supplying relevant files and stating context and boundaries directly. The exact attachment UI depends on the Codex surface; pasting the complete packet is also supported by this workflow and requires no custom integration.

## Context format

The deliverable is Markdown with compact JSON records, typed-token lines, relationship evidence and quoted verbatim guidance excerpts. It has these distinct sections:

1. **Intent and invocation boundary:** the fixed request, explicit pattern ID and task-specific consumption instructions.
2. **Governed context:** Genome metadata; actual traversed relationships; principles; selected pattern; Button/Stack guidance and complete contracts; foundation guidance and resolved token inventory; rules with original levels and checker availability; content guidance; governance.
3. **Conditional context:** the original `related-to` Input edge, its note and source metadata. Its contract is not included as a required dependency.
4. **Exceptions:** original reason, scope, review, owner and status, accompanied by an explicit no-automatic-permission boundary.
5. **Human review:** existing accessibility responsibilities, rule validation limitations, applicability and unresolved-judgment boundaries.
6. **Provenance:** compiled input byte hash, repository-relative authority references and deduplicated source hashes.

“Governed context” is a selection category, not a new MUST level. The consumer does not promote SHOULD to MUST, draft to active, a conditional association to a requirement, or a draft exception to approval. All contract fields and token aliases remain available, including internal dependencies marked as internal. Foundation groups follow the existing resolver; the consumer does not guess which subset of Button variants or colors the implementation will need.

The packet avoids dumping the entire source catalog, methodology documents or unrelated component contracts. Referenced Markdown sections are extracted verbatim from embedded compiled text using the compiler's current unique ATX heading convention. They are quoted to keep source headings separate from packet sections. Missing/ambiguous fragments fail. Unselected adjacent prose and linked documents are not silently made relevant or crawled. References are provenance and a way to report gaps, not directions to infer additional authority from disk.

## Intent → Intelligence → Inheritance

Intent is the caller's explicit destructive-action seed and fixed implementation brief. Intelligence is the graph-resolved knowledge already present in the compiled Genome. Inheritance means carrying the supplied decisions into a separately authorized implementation, with source evidence and human review. These are not new authoritative fields or inferred requirements.

Codex may read implementation files to reuse components and integrate behavior. That does not give implementation code, CSS or arbitrary Markdown a parallel role as design policy. If context is insufficient or conflicts with the implementation, report the gap for upstream resolution instead of inventing an unsupported design decision.

## Baseline versus Genome-informed protocol

This protocol is documented for a later explicitly authorized experiment. Do not run it against the approved showcase as part of context delivery.

1. Record the exact starting commit, Codex model/version/settings, tools, project/global instructions, experiment date and permitted time. Use two fresh tasks with separate disposable checkouts of the same commit. Keep implementation files, task brief, tool access and operational constraints identical. Do not use this long-running task or shared task history.
2. Generate/check the compiled artifact before the experiment, outside both model conversations. Record its SHA-256 and the exact generated packet bytes. Do not let the baseline task run generation/query/consumer commands or see generated context.
3. Give both tasks the same request and ordinary implementation-file context. Use the same shared boundaries: local demonstration only; no real deletion, persistence, networking, commit or push; preserve the approved layout and existing APIs; report assumptions and checks. For both, keep Genome source files, compiler/consumer documentation, generated Genome/context and the human evaluator's checklist outside ordinary codebase browsing. The one difference is that B explicitly receives the generated packet. Close automatically included design documents and inspect inherited instruction files before running.
4. **A — Baseline:** supply only the common request, ordinary implementation context and shared boundaries. **B — Genome-informed:** supply those exact materials plus the complete packet, introduced as task-scoped context derived from authored authority. Do not tell B to rediscover the Genome.
5. Record actual file reads, attached context, prompts, outputs, diffs, tests, assumptions and unresolved questions. If either task receives extra design guidance, follows authority imports from components, uses prior conversation knowledge, or reads excluded materials, mark the comparison contaminated and describe how. These are experimental controls, not a claim that prompts enforce filesystem isolation. A component implementation can itself reveal design decisions; acknowledge that baseline exposure.
6. Have a human compare both outputs against the same checklist below, retaining evidence by file/line, behavior or quoted reasoning. Describe differences and uncertainty, not numeric scores. Do not provide the checklist to only one model run. If the task lacks necessary product context, compare whether each model identifies that gap rather than forcing invention.
7. Do not merge either output automatically. Report this as a small qualitative comparison, not proof of causality, general AI improvement, deterministic generation or universal design-system benefit. No model execution or quality claim is part of this milestone.

Common proposed implementation brief for the later experiment:

> Add a destructive action allowing a user to delete a project. Work only in this disposable local demonstration. Do not delete real data, add persistence/networking, commit, or push. Preserve the approved layout and existing component APIs. Report assumptions, changed files, verification, and any decisions requiring human review.

For B, add only:

> The attached generated packet supplies task-scoped Design Genome context for this request. It is a projection of authored authority, not independent authority. Consume it without rediscovering design policy from source files.

### Qualitative comparison checklist

| Dimension | Evidence to inspect in both outputs |
| --- | --- |
| Component reuse | Reuses Button/Stack where appropriate; respects the actual contract and unsupported props. |
| Semantic foundations | Uses supplied governed token roles without invented visual values; reuses executable components. |
| Action labels | Communicates the actual consequence explicitly; treats the label rule at its authored SHOULD level. |
| Hierarchy and destructive treatment | Connects emphasis to product consequence and decision context; avoids treating variant selection as proof of safe UX. |
| Accessibility responsibilities | Preserves native semantics, naming, focus, disabled/loading behavior; tests relevant behavior and identifies remaining human review. |
| Unnecessary invention | Does not invent component variants, policy, visual foundations, confirmation requirements or infrastructure to fill context gaps. |
| Conditional knowledge | Recognizes that Input is conditional rather than automatically adding a typed-confirmation field. |
| Exceptions and governance | Preserves draft status and narrow external-workflow scope; does not use the exception as permission to weaken project-deletion labeling. |
| Unresolved judgment | Identifies actual consequence, scope, confirmation and applicability decisions that the supplied brief cannot determine. |

Use observations such as “supported by evidence,” “needs review,” or “not exercised,” with explanations. They are experiment notes, not a new governed scoring system or rule checker.

## Validation and limitations

Tests cover deterministic bytes for identical compiled input/intent, direction-preserving relationship delivery, conditional separation, draft-exception handling, embedded-guidance use, malformed/missing artifact failures, missing selected records/fragments, source-text hash consistency and independent execution without authoritative source files. Compiler correctness tests are reused, not reimplemented.

The consumer checks the transport it needs, not comprehensive source correctness or authenticity. SHA-256 identifies the input and checks embedded-text consistency; it is not a signature. Only the upstream `genome:check` establishes freshness against current authority. The consumer cannot establish freshness while intentionally refusing to read that authority. Context files must be regenerated intentionally; no watcher or automatic attachment is installed.

The first packet retains full selected contracts and foundation groups, so it is smaller than the complete artifact but not a tiny prompt. It makes no model-specific token-budget claim. The selection format is reference-consumer presentation, not a new authored governance schema. No missing governance decision blocks this milestone. Further intent routing, structured prose policies, automated exception applicability or vendor integrations would require separate work and appropriate decisions. Future consumers could use the same compiled/query boundary; no such adapters are implemented here.
