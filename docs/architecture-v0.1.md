# Design Genome Architecture v0.1

Status: locked architecture decisions for the project foundation. Concrete contracts, identifier syntax, token tooling, registry schema, and consumer implementation are not established by this document.

The foundation-state descriptions below are historical, not the current delivery inventory. The [root README](../README.md), [Forma Genome](../genome/README.md), [compiled Genome documentation](compiled-genome.md), and [site README](../site/README.md) describe delivered v0.1 functionality.

See [Specification v0.1](specification-v0.1.md) for the methodology, intended reference scope, positioning, and IP boundary.

## AD-01 — Distributed authority

Design Genome does not use one monolithic source-of-truth file.

| Authoritative source | Responsibility |
| --- | --- |
| Authored guidance | **WHY and WHEN:** principles, rationale, UX guidance, content guidance, and pattern intent. |
| Structured contracts | **WHAT IS ALLOWED:** tokens, component contracts, variants, states, rules, constraints, metadata, and deterministic relationships. |
| Executable implementations | **WHAT ACTUALLY EXISTS:** real components, APIs, and implemented behavior. |
| Governance | **WHAT IS AUTHORITATIVE:** status, ownership, relationships, versioning, authority, and exceptions. |

Information should be authored once whenever practical. Do not create manually maintained duplicates merely for another consumer. Organizational guidance, contracts, implementation, and governance remain connected authorities with distinct responsibilities.

## AD-02 — Seven operational domains

The operational domains are Principles, Foundations, Components, Patterns, Content, Rules, and Governance. Intent remains cross-cutting and is not a separate repository domain.

The v0.1 reference implementation should contain only a small representative subset sufficient to test the methodology. Its planned coverage is recorded in the specification.

## AD-03 — Connected knowledge

Important Design Genome entities use stable IDs and explicit semantic relationships. Keep the relationship vocabulary intentionally small.

Initial conceptual relationships may include:

- `informs`
- `uses`
- `governed-by`
- `implements`
- `related-to`
- `supersedes`

This is an initial conceptual vocabulary, not a fully specified relationship schema. Only model relationships that communicate meaningful design intelligence. Do not manually duplicate dependency information already authoritatively represented elsewhere.

Rules are independently addressable entities so documentation, machine context, implementations, and validation can reference the same governed decision.

## AD-04 — Appropriate technical representations

Use the representation appropriate to the authority of the knowledge.

The current reference implementation direction is:

| Knowledge or responsibility | Representation direction |
| --- | --- |
| Authored judgment and guidance | Markdown/MDX. |
| Design tokens | Established design-token conventions where practical; do not invent a proprietary Design Genome token format. |
| Deterministic component and rule knowledge | TypeScript structured objects/contracts. |
| Reference executable implementation | React + TypeScript. |
| Discovery, authority, and relationships | A lightweight manifest/registry. |
| Deterministic validation | TypeScript scripts/tests. |
| Machine consumption | Generated representations may be derived from authoritative sources. |

These are choices for the reference implementation, not requirements of the Design Genome methodology. The foundation uses Markdown; it does not yet need MDX tooling, React, TypeScript dependencies, or a package manager selection.

## AD-05 — Repository separation

The repository should clearly distinguish the following responsibilities. Paths describe conceptual architecture; create them when actual work requires them rather than scaffolding empty directories. Legitimate tooling needs may justify minor naming adjustments.

| Conceptual path | Responsibility | Foundation state |
| --- | --- | --- |
| `docs/` | Methodology documentation. | Specification and architecture documents. |
| `genome/` | Organizational design intelligence across the seven domains. | Deferred. |
| `src/` | Executable implementation. | Deferred. |
| `site/` | Human-facing documentation/site. | Deferred. |
| `generated/` | Derived machine artifacts. | Deferred. |
| `adapters/` | Replaceable consumer adapters. | Deferred. |
| `scripts/` | Transformation/build scripts. | Deferred. |
| `tests/` | Validation and tests. | Deferred. |

The `genome/` area represents organizational design intelligence. Executable implementations remain separately authoritative for actual implemented behavior. Generated artifacts are derived and must not become manually maintained authorities. Adapters are replaceable consumers and must not become independent sources of design truth.

Human-facing documentation is a first-class consumer of the connected sources. Its eventual presentation must preserve the distinction between authored guidance, deterministic contracts, actual implementations, and governance rather than maintaining independent interpretations.

## AD-06 — Author → Derive → Validate → Consume

The lifecycle is:

**Authoritative sources → derive consumer-appropriate representations → validate → consume through humans, applications, or AI.**

Important artifacts conceptually fall into three categories:

| Category | Meaning |
| --- | --- |
| AUTHORED | Humans/Codex intentionally maintain them. |
| GENERATED | Scripts derive them. Generated files must never become manually maintained authorities. |
| CONSUMER-SPECIFIC | Adapters explain how a particular environment should consume the Genome but must not redefine the system. |

The mention of Codex describes a possible authoring tool, not a methodology dependency.

Validation should eventually include:

- **Structural validation:** whether structured information has the required form.
- **Referential validation:** whether references resolve to the intended entities.
- **Contract validation:** whether contracts and executable implementations agree.
- **Deterministic rule validation:** checks for rules whose compliance can actually be determined mechanically.

Subjective design judgment must not be falsely presented as deterministic validation. It should explicitly remain human-review or guidance where appropriate.

Official generated artifacts should only be produced from a valid Genome. Future tooling must gate official output on successful validation; the derive step in the conceptual lifecycle does not authorize publishing unvalidated artifacts. This foundation introduces neither a generator nor a claim of Genome validity.

## Foundation bootstrap

The initial repository contains:

```text
README.md
.editorconfig
.gitignore
docs/
  specification-v0.1.md
  architecture-v0.1.md
```

The README is the entry point. The specification owns the methodology definition and scope; this document owns the locked architecture decisions. Both are authored documentation.

`.editorconfig` supplies basic UTF-8, newline, indentation, and whitespace consistency. `.gitignore` excludes local macOS metadata only. Build-output and dependency ignore rules can be added when tooling is introduced and output locations are known.

No package manifest, dependency lockfile, application framework, build system, backend/database, component library, fictional brand, MCP server, adapter, public site, or deployment configuration is needed in this pass. No empty future-domain directories are created.

## Decisions deferred until implementation

The locked direction does not yet specify a concrete token standard/version, entity ID format, manifest schema, component contract shape, validation library, package manager, or first AI consumer. Those choices should be resolved against the small representative reference Genome when implementation needs them. They are not additional methodology decisions made by this foundation.

The public site was deferred at bootstrap and is now implemented. Render deployment remains a separate release step.
