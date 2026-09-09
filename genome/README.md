# Forma Design Genome

Forma is a fictional collaborative workflow-management SaaS product used solely to demonstrate Design Genome. Its personality is clear, calm, and precise. These are original reference materials, not an implemented product or a marketed company.

This is the first authored organizational Genome. Its version and review status live in [governance/model.ts](governance/model.ts). All entities begin in draft for review; inclusion does not imply implementation or release approval.

## Inspect the intelligence

- [Principles](principles/README.md)
- [Foundations](foundations/README.md)
- [Components](components/README.md) and [contract structure](components/contracts.ts)
- Patterns: [Form](patterns/form.md) and [Destructive Action](patterns/destructive-action.md)
- [Content](content/README.md)
- [Rules](rules/README.md) and [structured rule metadata](rules/rules.ts)
- [Governance](governance/README.md) and [exception record](governance/exceptions.ts)

## Authority and discovery

[registry.ts](registry.ts) maps stable IDs to authoritative source locations, role ownership, status, and semantic relationships. Paths are relative to `genome/`; Markdown fragments identify sections and TypeScript fragments identify exported symbols. The registry is a discovery index, not a replacement for the sources it identifies.

IDs use `forma.<domain>.<slug>`, with plural operational-domain names and lowercase kebab-case slugs. They exclude versions and paths so moves and revisions need not change identity. Preserve IDs when editing the same entity. The governance version describes the Genome, not separate versions embedded in each ID.

Markdown owns why/when guidance and contextual judgment. Rule wording is authored once in the rules guide; structured rule records reference it and own levels and validation classifications. Component contracts own their explicitly unresolved deterministic surface. No executable source exists yet, so no implementation authority is claimed.

Relationships are directional: `informs` goes from guidance to what it informs, `uses` from a consumer to knowledge/component it uses, `governed-by` from an entity to its governing rule, and `related-to` marks a conditional association. Only meaningful design connections are recorded; imports and other technical dependencies are not mirrored.

Foundations have no token values yet. Components have no approved variants, state enumerations, or runtime APIs yet. `null` contract fields mean unresolved, not an empty supported set or permission to invent values. No generated artifacts, executable UI, adapters, or automated UI rule enforcement are included.
