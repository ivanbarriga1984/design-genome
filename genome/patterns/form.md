# Form

A Form coordinates labels, inputs, actions, validation, hierarchy, layout, and content so the user understands what information is needed and what happens next.

Use this pattern when the user provides information toward a shared outcome. Keep the common workflow focused; introduce advanced controls when relevant. Review labels and feedback together with their inputs rather than treating validation as disconnected copy.

Use [Input](../components/README.md#input) for entry, [Button](../components/README.md#button) for actions, and [Stack](../components/README.md#stack) for deliberate grouping once implementations exist. Apply [action-label guidance](../content/README.md#action-labels) to the forward action.

Human review should determine the decision context, whether emphasis makes the next step clear, and whether advanced controls are introduced at a useful time. A count of buttons cannot resolve those questions. API behavior, validation timing, and final layout are not specified in this pass.

The [registry](../registry.ts) encodes the relevant principles, component uses, content guidance, and governing rules.
