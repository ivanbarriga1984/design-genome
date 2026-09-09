# Forma foundations

Forma is clear, calm, and precise: restrained, crisp, highly legible B2B workflow software with moderately spacious density. These foundations support forms, dashboards, settings, tables, and workflow-heavy interfaces. Avoid gradients, glassmorphism, futuristic styling, excessive decoration, gratuitous rounding, oversized everyday typography, and arbitrary visual values.

Forma and Design Genome have separate visual identities. The future public site's Manrope/purple/blue direction is not inherited by Forma.

## Authority and representation

[tokens.json](tokens.json) is the authored authority for deterministic foundation values. This guide owns why and when; the [registry](../registry.ts) identifies authority, status, and ownership under the existing foundation IDs. The values are the first real foundation proposal for review; entity status remains draft. No executable behavior is claimed.

The token file follows [DTCG Format 2025.10](https://www.designtokens.org/tr/2025.10/format/) concepts: `$type`, `$value`, typed sRGB color objects, dimension objects, typography composites, and curly-brace aliases. It is an authored source, not generated output or a proprietary Genome format. Source locations use JSON Pointer fragments to identify the four groups within it.

Consumers use `color.*`, `typography.*`, `spacing.*`, and `radius.*`. `reference.*` is internal and contains only the shared font-family value. There is no raw color palette. Literal colors are authored directly into semantic roles; aliases reuse a deliberately shared decision. Edit the referenced source to change all roles sharing that decision. The normalized sRGB components are authoritative; there is no separately maintained hex palette.

## Color

Use semantic color roles rather than selecting arbitrary raw values. Cool/slate neutrals support reading and grouping; deep indigo carries the primary action. Blue is reserved for restrained informational use. Success, warning, and danger communicate their respective meanings. Destructive treatment still requires human review of the consequence.

| Token group | Intended use |
| --- | --- |
| `color.text` | Primary and supporting text, text on filled actions, and disabled text. |
| `color.background` | Canvas, subtle surfaces, neutral hover, and disabled surfaces. |
| `color.border` | Subtle separators and stronger identifying control boundaries, including hover. |
| `color.action` | Primary and destructive filled actions and their hover treatment. |
| `color.focus` | Focus-ring color. |
| `color.feedback` | Success, warning, danger/error, and information foregrounds paired with their own subtle backgrounds. |

Use `text.primary` and `text.muted` on canvas, subtle, or neutral-hover backgrounds. Use `text.on-color` on the primary and destructive action fills, including their hover fills. Use each feedback foreground with its corresponding background or with canvas/subtle surfaces. Informational blue is not a second primary action color. Do not assume arbitrary foreground/background combinations are supported.

The locked subtle border is for grouping and separators. Use `border.control` when a boundary is needed to identify an input; `border.control-hover` strengthens that boundary on hover. A faint separator is not sufficient merely because it is tokenized.

Use the focus-ring color against canvas/subtle surfaces with visible separation from filled actions. A same-colored ring touching a primary fill may disappear. Indicator geometry and behavior must be resolved and tested with actual components. Disabled roles identify an unavailable state; their colors do not implement disabling behavior. Feedback must also be communicated through content or other appropriate cues rather than color alone.

The [semantic-color rule](../rules/README.md#semantic-colors-only) now has an authoritative inventory. It still has no executable enforcement.

## Typography

Use the semantic typography composites as complete text styles. The shared reference specifies Inter with a generic sans-serif fallback. Font assets and loading are later implementation work; no font has been downloaded or bundled here.

`heading-2`, `heading-3`, `body`, `body-small`, `label`, and `caption` form the ordinary application hierarchy. Reserve `heading-1` for rare high-level contexts. Use body small for supporting or denser workflow content without replacing the main reading hierarchy; captions are secondary annotations, not a way to shrink primary tasks. Labels distinguish control names with modest weight rather than decorative emphasis.

Font sizes use rem units to respect the user's root font size. Line heights are unitless multipliers; letter spacing remains normal. Exact values belong only in the token source. Visual style names do not dictate HTML heading levels or replace semantic document structure.

## Spacing

Use the governed `spacing.*` dimension tokens for supported padding, margins, and gaps. Numeric token names count base units; their values are authoritative in the token source. This is a shared spacing scale, not a set of component-specific presets.

Group related labels and controls closely, provide breathing room within forms and cards, and reserve larger gaps for distinct sections. Moderately spacious density should support workflow comprehension without turning every table or settings view into a sparse presentation. Contextual density remains a human decision; no density modes or arbitrary intermediate steps are added.

The [spacing rule](../rules/README.md#spacing-tokens-only) now resolves to a concrete scale. It does not yet define every component's spacing mapping or enforce usage.

## Radius

Use `radius.small`, `radius.default`, and `radius.large` purposefully according to the role and scale of a surface or control. The foundation provides restrained choices; component mappings remain later work.

Pill/full rounding is reserved for semantics such as status indicators, tags, or chips. None are in the initial component scope, so no full-rounding token is added now. Do not approximate pill shapes by misusing the largest available radius.
