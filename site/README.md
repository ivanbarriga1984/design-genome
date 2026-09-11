# Public Design Genome website

This is the public website implementation, separate from the fictional Forma organization's Genome. Website variables are implementation conventions, not a second reference Genome or changes to the methodology.

## Applications and routes

- `/` — public homepage.
- `/framework`, `/reference`, `/build` — intentionally small section entry pages. Their full documentation trees are outside this pass.
- `/reference/forma/` — separate HTML entry loading the original `src/main.tsx` showcase, including its original styles and Inter font.
- Unmatched public paths — a page-not-found view.

`site/main.tsx` mounts React Router in declarative mode. `Site.tsx` owns navigation, route titles, route-change focus/scroll handling, and the shared footer. Future nested documentation routes can be added under the existing top-level routes without replacing the application architecture.

Vite builds two HTML entries. A future static host must serve real files first (especially `/reference/forma/index.html`) and then fall back to `/index.html` for public application routes. Hosting is not configured in this pass. Use the trailing-slash Forma URL.

## Public visual foundation

`foundation.css` defines the small website foundation: locally bundled Manrope (400/500/600/700, Latin), solid purple and selective blue, white and neutral surfaces, type, layout width, spacing, borders, radius, focus, and motion. `site.css` defines the actual editorial compositions and responsive behavior.

The public layout uses a 1,248px maximum content width with fluid gutters. The core model breaks out to the right viewport edge. Tablet layouts stack the major compositions; mobile navigation becomes an inline disclosure. At narrow widths the core model becomes a vertical connected sequence. No gradients, image libraries, WebGL, or animation dependencies are used. Interface SVGs follow Tabler Icons; their existing MIT license is retained in `src/tabler-icons.LICENSE`.

## Homepage modules

- Editorial hero and connected knowledge visual.
- The consistency problem and additive documentation-to-infrastructure shift.
- Interactive Intent → Intelligence → Inheritance explanation.
- Four complementary capabilities with cross-cutting governance.
- A curated live Forma reference showing guidance, contract values, and original components.
- Team ownership and consumer connections.
- Extending an existing system through a Minimum Viable Genome.
- Closing invitation to explore and build.

`ReferenceDemo.tsx` is a separate lazy-loaded module. It imports the original Button, Input, Card, and Stack and reads displayed button values from the existing contract. The demonstration is local React state only; it does not create or persist a real project. The reference component stylesheet is class-scoped. The showcase's broad global stylesheet is loaded only in its separate HTML entry. Public and Forma token namespaces remain separate.

The specification and architecture remain authoritative. Public copy does not establish new principles, promise AI compliance, or claim universal portability. The contract excerpt governs the component; the authored content rule guides the action label.

## Interaction and accessibility

Native links and buttons, a skip link, visible focus, current-route indication, descriptive SVG alternatives, labeled inputs, and live feedback are provided. The mobile menu supports Escape and returns focus to its trigger. Route changes close the menu, update the title, move focus to the main content, and return to the top. The model uses native toggle buttons with an announced explanation. Reduced-motion preferences disable public transitions. These measures alone are not an accessibility-compliance claim.

## Local review

Run `npm run dev`. Visit the homepage and `/reference/forma/` on the reported port. `npm run build` builds both entry points and typechecks the project. Existing `npm test`, `npm run check`, and `npm run genome:check` remain applicable.

Visual review should concentrate on headline line breaks, editorial pacing, the core-model interaction, and the distinct public/Forma identities before the design is extended into the documentation sections.
