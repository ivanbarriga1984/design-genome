# Forma rules

This guide owns rule wording and review rationale. [rules.ts](rules.ts) owns each stable ID, level, validation classification, and checker availability. Classification describes intended validation, not a delivered checker. No UI compliance is asserted by inspecting these source files.

## Semantic colors only

Executable UI uses approved semantic color tokens rather than arbitrary color values.

Requires an approved token source and an inspectable implementation. No palette or checker exists yet.

## Spacing tokens only

Supported UI spacing resolves to the approved spacing scale.

Requires an approved scale and a defined set of supported spacing surfaces. No scale or checker exists yet.

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

Requires resolved supported variants and an implementation that can be checked. Unresolved contracts do not grant permission to invent variants.
