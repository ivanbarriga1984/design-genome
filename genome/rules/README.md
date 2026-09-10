# Forma rules

This guide owns rule wording and review rationale. [rules.ts](rules.ts) owns each stable ID, level, validation classification, and checker availability. Classification describes intended validation, not a delivered checker. No UI compliance is asserted by inspecting these source files.

## Semantic colors only

Executable UI uses approved semantic color tokens rather than arbitrary color values.

The authoritative inventory is the `color` group in [foundation tokens](../foundations/tokens.json), discovered through `forma.foundations.color`. Consumer roles and intended pairings are explained in [color guidance](../foundations/README.md#color). The inventory is authored for review; an inspectable implementation and executable checker are still required for enforcement.

## Spacing tokens only

Supported UI spacing resolves to the approved spacing scale.

The authoritative scale is the `spacing` group in [foundation tokens](../foundations/tokens.json), discovered through `forma.foundations.spacing`. See [spacing guidance](../foundations/README.md#spacing) for intended use. Component contracts now map spacing roles and Stack gap options to this scale. Implementations and executable UI enforcement remain later work.

## Reuse governed components

When an authoritative governed component satisfies the requirement, consumers must use it rather than creating an equivalent primitive.

Future checks may identify imports or duplicate primitives. Humans must still judge whether an authoritative component satisfies the requirement. No implementation exists yet.

## Destructive styling requires destructive intent

Destructive visual treatment is reserved for actions with destructive consequences.

Implementation alone cannot reliably infer product intent. Review the consequence before approving the treatment.

## Explicit action labels

Action labels should communicate what will happen rather than relying on generic labels such as "Submit" or "Confirm."

Use the content examples in context. A word match cannot determine whether a label communicates the actual outcome.

## One primary action per decision context

Prefer a single visually dominant forward action within a decision context.

A decision context is a UX judgment, not simply a DOM container. Counting primary-looking buttons cannot establish compliance.

## Advanced complexity should be progressive

Advanced or infrequently needed controls should not compete with the primary workflow unless context requires them.

Review relevance and discoverability in the workflow. Visibility alone does not establish whether complexity is appropriate.

## Unsupported component variants

Consumers must not invent variants that are not part of the authoritative component contract.

The [component contracts](../components/contracts.ts) now define supported variants and reject a variant API where none is provided. Checking actual consumer usage remains later work; source-integrity checks alone do not enforce this rule in UI.
