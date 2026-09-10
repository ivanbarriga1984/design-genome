# Forma component guidance

[contracts.ts](contracts.ts) owns the finalized v0.1 contract proposals: supported options, defaults, states, semantics, accessibility responsibilities, and token mappings. The [registry](../registry.ts) identifies their authority and draft review status. No Button, Input, Card, or Stack implementation exists yet; contract requirements are not evidence of runtime behavior.

The listed API is intentionally closed. Do not expose consumer style/class hooks or forward arbitrary props that can redefine appearance. Preserve necessary native semantics through the explicitly listed API. Token roles reference the authored foundations; they are not a second palette or scale. Contract enum/API fields and state descriptions are deterministic implementation requirements. The contextual decisions below remain human review.

## Button

Use Button for an action the user can take. Review [action labels](../content/README.md#action-labels) against the actual outcome and emphasis against the decision context. Reserve destructive treatment for destructive consequences; a variant name cannot establish intent.

Primary expresses the dominant forward action; secondary offers a bounded alternative; ghost minimizes visual emphasis when context remains clear. The contract owns the exact variants, sizes, default props, and token roles. Ghost's resting surface is unpainted, not a new color token; review its contrast on the containing surface.

Icon-only use needs both the required accessible name and human review of discoverability. Loading retains the action's existing name and focus, exposes busy/unavailable state, and blocks repeat activation; explicit disabled uses native disabling. The implementation must test mouse, keyboard, and form submission paths. A spinner is not required and cannot replace understandable semantics.

## Input

Use Input for user-entered information within a coordinated [Form](../patterns/form.md). Review whether the visible label explains the information requested and whether help and error messages are useful in context. A placeholder is supplemental, never a substitute for the label.

The contract defines the exact text-like input types and restrained data-entry API. A component-generated stable ID connects its visible label, input, helper text, and error text. Callers supply meaningful content and decide when an error exists; association alone cannot determine useful validation timing. No automatic error announcement or focus movement is promised.

For [Destructive Action](../patterns/destructive-action.md), additional entry is appropriate only when the consequence warrants it. Do not infer that every deletion needs typed confirmation.

## Card

Use Card to group related information when that grouping helps the user understand it. Review grouping and density before introducing another surface. No shadow, decorative variant family, or custom radius API is provided.

The default static card can contain real controls. Whole-card navigation is an optional native-link mode: the destination must be clear from the content, and the card cannot contain nested interactive elements. Use an actual Button within a static card for an action. A generic clickable div, fake link, or tab stop does not provide equivalent semantics.

## Stack

Use Stack for deliberate grouping through flex layout and approved spacing. The contract derives allowed gap options from the authoritative spacing keys; it does not repeat their values. Direction, alignment, justification, and wrapping are restrained and do not constitute a generic responsive layout framework.

Keep visual and DOM reading order aligned. Human review determines whether grouping and density suit the workflow and whether wrapping remains understandable at narrow widths. A valid gap token cannot prove a useful composition.

## Implementation details to resolve next

The contract surface is now specified. Actual components still need semantic markup, event handling, and visual tests. Border width and focus-ring width/offset now reference the governed [foundation geometry](../foundations/README.md#border-and-focus-geometry). No decorative border-width variants are supported. Inter is bundled locally through `@fontsource/inter`. These decisions do not establish accessibility compliance; actual focus visibility and interaction behavior still require implementation and testing.
