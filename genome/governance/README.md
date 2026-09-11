# Forma governance

[model.ts](model.ts) owns the Genome version, status vocabulary (`draft`, `active`, `deprecated`), role vocabulary, and metadata shapes. [registry.ts](../registry.ts) identifies each important entity's authority, status, and owner. Contract and rule entities use Design + Engineering; authored design guidance uses Design. These roles identify responsibility, not fictional employees.

All entities are draft in this first reviewable pass. `active` identifies approved current knowledge; `deprecated` identifies knowledge retained for reference but no longer current. This vocabulary does not claim that a component is executable: implementation availability is separately represented in its contract.

## Authority

Source locations distinguish guidance, contracts, and metadata. The registry owns discovery and semantic relationships; source records own their actual content. TypeScript fragments name exported symbols; find the matching ID within the export for grouped records. Foundation contract locations use JSON Pointer fragments to identify groups in the authored token file. Executable behavior will have its own authority when implementations exist.

The first real foundation values now live in the token source identified by the registry; component APIs are now specified in their contracts, with implementations now linked through the registry. Human review of intent, hierarchy, labels, and progressive complexity remains human review. Machine-readable metadata must not be treated as evidence that those judgments have been automated.

## Exceptions

[exceptions.ts](exceptions.ts) owns the representative exception record: rule ID, reason, narrow scope, role owner, status, and review information. The model also supports an expiration date where appropriate. The example uses a review milestone instead of inventing a calendar deadline.

The included draft demonstrates the record shape and a limited departure from a recommendation. It is not a blanket exemption or an approved production deviation. Review its scope and reason alongside the referenced rule before any activation. No approval workflow, automated expiration mechanism, or exception enforcement engine is claimed in this pass.
