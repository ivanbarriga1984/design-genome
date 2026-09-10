import tokens from "../foundations/tokens.json" with { type: "json" };

/** Paths follow the authoritative token tree; no visual values are copied here. */
type Paths<T> = T extends { $value: unknown } ? never : {
  [K in Exclude<keyof T, `$${string}`> & string]: T[K] extends { $value: unknown }
    ? K : `${K}.${Paths<T[K]>}`
}[Exclude<keyof T, `$${string}`> & string];
type TokenPath = Exclude<Paths<typeof tokens>, `reference.${string}`>;
export type SpacingToken = `spacing.${Exclude<keyof typeof tokens.spacing, "$type">}`;
export const spacingTokens = Object.keys(tokens.spacing)
  .filter(key => !key.startsWith("$"))
  .map(key => `spacing.${key}` as SpacingToken);

type Prop = {
  type: "enum" | "boolean" | "string" | "content" | "callback";
  values?: readonly string[];
  default?: string | boolean;
  required?: boolean;
};
interface ComponentContract {
  id: string;
  implementation: null;
  variants: readonly string[];
  states: readonly string[];
  api: Record<string, Prop>;
  tokenRoles: Record<string, TokenPath | readonly TokenPath[]>;
  semantics: Record<string, string | readonly string[]>;
  accessibility: { deterministic: readonly string[]; humanReview: string };
  unsupportedProps: readonly string[];
}

const buttonVariants = ["primary", "secondary", "destructive", "ghost"] as const;

/** Finalized v0.1 contract proposals. Runtime components remain unimplemented. */
export const contracts = [
  {
    id: "forma.components.button",
    implementation: null,
    variants: buttonVariants,
    states: ["default", "hover", "focus-visible", "disabled", "loading"],
    api: {
      variant: { type: "enum", values: buttonVariants, default: "primary" },
      size: { type: "enum", values: ["sm", "md"], default: "md" },
      type: { type: "enum", values: ["button", "submit", "reset"], default: "button" },
      children: { type: "content", required: true },
      disabled: { type: "boolean", default: false },
      loading: { type: "boolean", default: false },
      iconOnly: { type: "boolean", default: false },
      "aria-label": { type: "string" },
      "aria-describedby": { type: "string" },
      id: { type: "string" },
      name: { type: "string" },
      value: { type: "string" },
      onClick: { type: "callback" },
    },
    tokenRoles: {
      borderWidth: "border.width.default", focusWidth: "focus.ring.width", focusOffset: "focus.ring.offset",
      typography: "typography.label", radius: "radius.default",
      "primary.background": "color.action.primary", "primary.hoverBackground": "color.action.primary-hover",
      "primary.text": "color.text.on-color",
      "secondary.background": "color.background.canvas", "secondary.hoverBackground": "color.background.hover",
      "secondary.text": "color.text.primary", "secondary.border": "color.border.control",
      "destructive.background": "color.action.destructive", "destructive.hoverBackground": "color.action.destructive-hover",
      "destructive.text": "color.text.on-color",
      "ghost.hoverBackground": "color.background.hover", "ghost.text": "color.text.primary",
      "disabled.background": "color.background.disabled", "disabled.text": "color.text.disabled",
      "disabled.border": "color.border.default", focus: "color.focus.ring",
      "sm.paddingBlock": "spacing.1", "sm.paddingInline": "spacing.3",
      "md.paddingBlock": "spacing.2", "md.paddingInline": "spacing.4",
      "iconOnly.sm.padding": "spacing.1", "iconOnly.md.padding": "spacing.2", iconGap: "spacing.2",
    },
    semantics: {
      element: "button",
      loading: "Keep the existing accessible name and content; set aria-busy=true and aria-disabled=true; suppress click and form activation while retaining focus. Do not require a spinner.",
      disabled: "Set native disabled; suppress activation. Explicit disabled takes precedence over loading focus retention.",
      statePriority: ["disabled", "loading", "hover", "default"],
      focus: "Use :focus-visible for the governed ring; it is additive when focusable, including loading. Preserve visible separation of the focus ring from filled backgrounds.",
      ghost: "No resting fill or border; underlying surface must support the mapped foreground. Hover uses the governed fill.",
      activation: "onClick receives the native React button mouse event; native keyboard activation is preserved. Do not call it while disabled or loading.",
    },
    accessibility: {
      deterministic: ["iconOnly=true requires a nonempty aria-label.", "Keep accessible-name content during loading; do not replace it with an unnamed icon.", "Use native button keyboard semantics and expose a visible focus indicator."],
      humanReview: "components/README.md#button",
    },
    unsupportedProps: ["style", "className", "color", "background", "as", "href"],
  },
  {
    id: "forma.components.input",
    implementation: null,
    variants: [],
    states: ["default", "hover", "focus", "disabled", "error"],
    api: {
      type: { type: "enum", values: ["text", "email", "password", "search", "tel", "url"], default: "text" },
      label: { type: "string", required: true },
      id: { type: "string" }, name: { type: "string" },
      value: { type: "string" }, defaultValue: { type: "string" }, onChange: { type: "callback" },
      placeholder: { type: "string" }, helperText: { type: "string" }, errorMessage: { type: "string" },
      invalid: { type: "boolean", default: false }, disabled: { type: "boolean", default: false },
      required: { type: "boolean", default: false }, autoComplete: { type: "string" },
    },
    tokenRoles: {
      borderWidth: "border.width.default", focusWidth: "focus.ring.width", focusOffset: "focus.ring.offset",
      typography: "typography.body", label: "typography.label", supportingText: "typography.body-small",
      text: "color.text.primary", placeholder: "color.text.muted", helperText: "color.text.muted",
      background: "color.background.canvas", border: "color.border.control", hoverBorder: "color.border.control-hover",
      focus: "color.focus.ring", errorBorder: "color.feedback.danger.foreground", errorText: "color.feedback.danger.foreground",
      disabledBackground: "color.background.disabled", disabledText: "color.text.disabled", disabledBorder: "color.border.default",
      radius: "radius.default", paddingBlock: "spacing.2", paddingInline: "spacing.3", labelGap: "spacing.2", messageGap: "spacing.1",
    },
    semantics: {
      element: "input",
      label: "Render a nonempty visible label with htmlFor matching the input id; generate a stable unique id if absent. No hidden-label mode in v0.1.",
      value: "value and defaultValue are mutually exclusive. A defined value requires onChange; remain controlled or uncontrolled for the mounted lifetime. onChange receives the React input change event.",
      error: "invalid=true or a nonempty errorMessage sets aria-invalid=true. Associate all rendered helper/error text IDs through aria-describedby. Do not render empty descriptions.",
      disabled: "Use native disabled. Disabled visual treatment wins over error/hover, but preserve invalid state and associated messages.",
      focus: "Prefer :focus-visible for the governed ring, including when an error is present. Error border wins over hover. No automatic live-region or validation-timing behavior is implied.",
    },
    accessibility: {
      deterministic: ["Require nonempty label; placeholder cannot replace it.", "Use matching label/input IDs and resolving description IDs.", "Reflect required and disabled with native attributes; invalid with aria-invalid."],
      humanReview: "components/README.md#input",
    },
    unsupportedProps: ["style", "className", "variant", "size", "color", "as", "children"],
  },
  {
    id: "forma.components.card",
    implementation: null,
    variants: [],
    states: ["default", "hover", "focus-visible"],
    api: {
      mode: { type: "enum", values: ["static", "link"], default: "static" },
      children: { type: "content", required: true }, href: { type: "string" }, id: { type: "string" },
    },
    tokenRoles: {
      borderWidth: "border.width.default", focusWidth: "focus.ring.width", focusOffset: "focus.ring.offset",
      background: "color.background.canvas", border: "color.border.default", text: "color.text.primary",
      radius: "radius.large", padding: "spacing.6", "link.hoverBackground": "color.background.subtle", focus: "color.focus.ring",
    },
    semantics: {
      static: "Render div; no added role, tabIndex, hover treatment or click handler. Static cards may contain actual controls.",
      link: "Render a with a nonempty href; href is forbidden in static mode. Preserve native navigation, focus and keyboard behavior. Hover and :focus-visible ring treatment apply only in link mode.",
      content: "Link cards require an understandable accessible name from their contents and must not contain nested links, buttons, inputs, or other interactive descendants.",
      action: "Use a Button within a static Card for actions; no whole-card action mode in v0.1.",
      surface: "No shadow or selectable/disabled card mode.",
    },
    accessibility: {
      deterministic: ["Link mode requires href and an anchor; static mode has no interactive role.", "Do not nest interactive descendants inside a link card."],
      humanReview: "components/README.md#card",
    },
    unsupportedProps: ["style", "className", "variant", "onClick", "tabIndex", "role", "shadow", "color", "radius", "as"],
  },
  {
    id: "forma.components.stack",
    implementation: null,
    variants: [],
    states: ["default"],
    api: {
      children: { type: "content", required: true },
      direction: { type: "enum", values: ["vertical", "horizontal"], default: "vertical" },
      gap: { type: "enum", values: spacingTokens, default: "spacing.4" },
      align: { type: "enum", values: ["start", "center", "end", "stretch", "baseline"], default: "stretch" },
      justify: { type: "enum", values: ["start", "center", "end", "between"], default: "start" },
      wrap: { type: "boolean", default: false }, id: { type: "string" },
    },
    tokenRoles: { gap: spacingTokens },
    semantics: {
      element: "div", layout: "flex",
      direction: "vertical maps to column; horizontal maps to row. No reverse direction.",
      alignment: "align maps start/end to flex-start/flex-end and otherwise passes its enum value; justify maps start/end to flex-start/flex-end, center to center and between to space-between.",
      wrap: "false maps to nowrap; true maps to wrap. No wrap-reverse.",
      order: "Keep DOM reading order; no reorder, responsive-prop, margin, padding, or arbitrary gap API.",
    },
    accessibility: {
      deterministic: ["Do not add interactive roles or keyboard handlers to a layout container.", "Do not reverse visual order independently of DOM order."],
      humanReview: "components/README.md#stack",
    },
    unsupportedProps: ["style", "className", "margin", "padding", "as", "order"],
  },
] as const satisfies readonly ComponentContract[];
