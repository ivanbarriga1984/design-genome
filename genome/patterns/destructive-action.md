# Destructive Action

Use this pattern for actions with destructive consequences. The user should understand what will be affected and what the action will do before choosing it. Product intent and consequence require human judgment; a component variant cannot prove them.

## Connected decision example

Consider the fictional action **Delete workspace**. Review the actual consequence and affected scope before choosing destructive treatment. Explain that consequence in Forma's [voice](../content/README.md#voice), and apply [action-label guidance](../content/README.md#action-labels) to the action itself.

[Clarity before density](../principles/README.md#clarity-before-density) informs which consequence information must be understandable. [Hierarchy communicates intent](../principles/README.md#hierarchy-communicates-intent) informs emphasis within the decision context.

Use [Button](../components/README.md#button) for the action and [Stack](../components/README.md#stack) to organize the explanation and choices when implementations exist. [Input](../components/README.md#input) is only relevant if the consequence warrants additional entry, such as a deliberate confirmation. That is a conditional relationship, not a requirement to add a text field to every destructive action.

The [destructive-intent rule](../rules/README.md#destructive-styling-requires-destructive-intent) governs whether destructive treatment is justified. The [single-primary-action rule](../rules/README.md#one-primary-action-per-decision-context) guides emphasis; it does not mechanically prescribe which choice must be dominant. [Explicit labels](../rules/README.md#explicit-action-labels) help communicate the outcome. [Reuse](../rules/README.md#reuse-governed-components) and [supported variants](../rules/README.md#unsupported-component-variants) constrain implementation once authoritative components and contracts exist.

## Human review

Review whether the explanation matches actual product consequences, whether the label names the action clearly, and whether hierarchy supports an informed choice. Decide whether added confirmation is warranted in this context. Do not equate a destructive-looking button, a typed confirmation, or a single prominent control with proof of safe or understandable UX.

The [registry](../registry.ts) records these semantic connections. No modal, deletion workflow, confirmation API, final styling, or executable composition is implemented here.
