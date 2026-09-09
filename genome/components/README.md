# Forma component guidance

These are intended responsibilities, not descriptions of implemented React behavior. [contracts.ts](contracts.ts) owns contract structure; [registry.ts](../registry.ts) identifies authority and governance. The contracts remain unresolved until actual supported variants, states, and APIs are decided. Reuse obligations become actionable when an authoritative implementation satisfies the requirement.

## Button

Use Button for an action the user can take. Its label should make the outcome understandable; consult [action-label guidance](../content/README.md#action-labels). Review emphasis against the current decision context and reserve destructive treatment for destructive consequences.

A future contract must resolve supported variants, states, and API behavior. This pass does not assign visual variants or promise loading, disabled, or other behavior.

## Input

Use Input for user-entered information within a coordinated [Form](../patterns/form.md). Guidance around the control should make the requested information and any validation feedback understandable.

For consequential actions, additional entry is appropriate only when the interaction warrants it; see [Destructive Action](../patterns/destructive-action.md). Do not infer that every deletion needs a typed confirmation. Input types, validation APIs, and states remain unresolved.

## Card

Use Card to group related information when that grouping helps the user understand it. A container alone does not establish an action or a new decision context. Evaluate nesting and density against clarity.

Surface treatment, interaction behavior, variants, and APIs remain unresolved.

## Stack

Stack is the initial simple layout primitive for arranging related content with deliberate spacing. Use it to support grouping and hierarchy in the reference patterns.

Spacing must eventually resolve to governed tokens. Direction, alignment options, responsive behavior, and prop names remain unresolved; no layout implementation is claimed.
