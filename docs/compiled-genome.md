# Compiled Forma Genome

The compiler creates `generated/forma-genome.json`, a deterministic JSON snapshot of the existing distributed authority. It adds machine consumption alongside the human-readable design system. It is GENERATED, ignored by Git, and must never be edited or treated as independent authority.

This is a reference-specific serialization format, not a new authored Genome schema or methodology domain. It introduces no design decisions, relationships, maturity assignments, natural-language intent classifier, AI generation, adapter, backend, or UI.

## Author → validate → compile → consume

The compiler imports the existing registry, component contracts, rules, governance metadata and exceptions. Existing token tooling validates and collects foundation tokens. Referenced Markdown is embedded verbatim, with its original references and SHA-256 provenance. Source integrity gates publication; invalid input does not produce an official artifact. A failed generation removes the previous artifact rather than leaving it to masquerade as current.

```sh
npm run genome:generate
npm run genome:check
npm run genome:query -- forma.patterns.destructive-action
```

Generation validates sources and atomically replaces the output. `genome:check` recompiles in memory and compares exact bytes; a missing, stale or edited artifact fails. Run this check before consuming a local snapshot. Querying does not regenerate or silently repair it. The query command defaults to the destructive-action pattern when no ID is supplied. Use `node scripts/query-genome.ts <entity-id>` for JSON-only stdout without npm's command banner.

`npm run check` remains the shared source-integrity check and does not require a generated JSON file. Existing Vite development and build behavior is unchanged. JSON compilation is intentional and separate from CSS generation. No dependency is added.

## Artifact contents

| Field | Derived contents |
| --- | --- |
| `generated` | Generated warning, transport format version and regeneration command; no timestamp or machine-specific path. |
| `genome` | Existing version, name, status, owner and ID, copied from governance. |
| `entities` | Existing stable IDs, owners, statuses and role-specific authority references. Principles, foundations, components, patterns, content, rules and governance remain discoverable here. |
| `relationships` | Original directional edges and conditional notes, unchanged. |
| `contracts` | Original component APIs, variants, states, token roles, semantics, accessibility guidance and implementation references. |
| `rules` | Original rule levels, guidance references, validation classifications and checker availability. A null checker stays null. |
| `exceptions` | Original scope, reason, status, ownership, referenced rule and review conditions. Draft never becomes approval. |
| `tokens` | Path-keyed typed values and source pointers, with aliases preserved. Includes internal references needed to resolve aliases. |
| `sources` | Repository-relative source paths and SHA-256 hashes. Markdown and token JSON text are embedded verbatim, including token descriptions and group annotations. TS and implementation files have hashes only. |
| `referenceBases` | Existing conventions: authority/guidance references are genome-relative; implementation and source-catalog paths are repository-relative. |
| `limitations` | Explicit boundaries of compilation and interpretation. |

Object keys are sorted with a locale-independent ordering. Authored arrays retain their order; prose is not rewritten. Identical inputs yield identical bytes. `generated.formatVersion` identifies this transport layout, independently of the authored Genome version.

Markdown fragment references retain their scope. Full documents are included so introductions and neighboring context are not lost, but adjacent sections are not thereby declared relevant to every entity. This compiler supports the current simple, unique ATX heading convention and fails on missing or ambiguous referenced headings. It does not recursively crawl links inside prose. Source locations identify more information where necessary.

Consumers should use this snapshot for authority discovery and governed context, rather than infer policy from component code or crawl arbitrary files. Implementations remain separately authoritative for actual behavior and must still be reused and tested. A file's existence or hash does not prove contract compliance. This artifact is not a portable implementation bundle.

## Intent → Intelligence → Inheritance

**Intent** enters the deterministic example as the existing stable ID `forma.patterns.destructive-action`. The caller explicitly selects this pattern to represent “a destructive action.” The script does not infer that mapping from free text or decide whether a product consequence is destructive.

**Intelligence** is resolved through existing relationships: outgoing `uses` and `governed-by`, plus incoming `informs`. Traversal repeats until no additional entities are reached. It does not walk backward through `uses`, or forward from a shared principle into every workflow that principle informs. Returned edges provide the evidence for selection.

**Inheritance** is the downstream responsibility to carry forward the returned contracts, token mappings, rules, content guidance and governance constraints. The result contains those existing records rather than generating a new requirements list. Structured availability does not determine product intent, exception applicability, safe UX or accessible behavior. The compiler cannot certify what a later implementation inherits.

The result therefore uses `seed`, `entities`, `relationships`, `contracts`, `rules`, `tokens`, `conditional`, `exceptions`, `governance` and `sources`, rather than adding authoritative Intent/Intelligence/Inheritance fields to the Genome.

## Destructive-action example

The query reads only the compiled JSON. Its pure resolver has no runtime import of the authored Genome or compiler.

For the destructive-action seed it returns:

- Clarity before density and Hierarchy communicates intent through incoming `informs` edges.
- Button and Stack contracts through `uses` edges.
- Voice and action-label guidance; explicit-action-label, destructive-intent, one-primary-action, reuse, supported-variant, semantic-color and spacing rules through encoded relationships.
- Foundation groups used by those components, plus exact contract token dependencies. Border/focus tokens are included from contract mappings even though they do not have separate registry entities. Alias dependencies include the internal shared font family.
- The conditional `related-to` Input edge and its authored note separately; no automatic confirmation-field requirement is created.
- The existing draft exception tied to the explicit-action-label rule as review context only. It is narrowly scoped to an external embedded workflow, not a waiver for this destructive action.
- Genome governance and a complete source catalog for supporting guidance. Catalog inclusion alone is not a relevance claim.

Conditional associations are not traversed automatically. A caller may explicitly query the conditional entity separately when human judgment establishes relevance. All current authored entity statuses remain draft regardless of the implementation's availability or prior visual review.

## Validation and limits

The shared gate checks stable-ID uniqueness and syntax, status/owner vocabulary, valid relationship kinds/endpoints, duplicate edges and structured records, record registration, authority file/fragment existence, exception references and metadata agreement, rule classification, enum inventories/defaults, token mappings, accessibility guidance references and implementation-reference agreement. Existing token validation remains responsible for types, values and aliases. The compiler additionally verifies that each registered TS authority resolves to the matching record in its known export; unknown export bindings fail rather than being guessed.

Canonical serialization rejects non-JSON values. Tests cover repeat compilation, preserved source records/prose, query directionality, conditional handling, token dependency closure, malformed records, broken references, and missing/stale output. Freshness covers the included source hashes, so a referenced source edit invalidates the old snapshot even when its structured projection happens to remain the same.

Prose requirements, relationship applicability, accessibility and product consequences remain human judgment. TypeScript-only metadata vocabulary declarations remain referenced by their source; they are not independently reauthored as a generated policy schema. No new governance/schema decision was required for this projection. A future consumer needing structured prose requirements, intent matching, automatic exception approval or rule execution would require further explicit authority decisions.
