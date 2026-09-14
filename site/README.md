# Public Design Genome website

This is the public website implementation, separate from the fictional Forma organization's Genome. Website variables are implementation conventions, not a second reference Genome or changes to the methodology.

## Applications and routes

- `/` — public homepage.
- `/framework` — editorial methodology chapter with an expanded core model, registry-backed relationship explorer, and the Forma consumer example.
- `/reference` — browsable Forma reference: seven domain indexes, 27 registered entity details, and `/reference/machine-context`.
- `/build` — six-part practical implementation guide, with contextual Forma evidence and explicit methodology / recommended practice / example distinctions.
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

## Framework chapter

`framework/Framework.tsx` is loaded separately at `/framework`. Its stylesheet is scoped to the chapter and its `fw-` classes. The approved homepage and public foundation are unchanged. `FrameworkVisuals.tsx` presents the core model and reads selected actual registry relationships, ownership, and status for the interactive connection map; it does not generate context or run an implementation. The nine sections expand the additive thesis, core model, connected knowledge, capabilities, consumer journey, minimum scope, ownership, and next steps. Fragment links work on direct entry as well as within the chapter.

## Forma Reference browser

`reference/Reference.tsx` provides overview, domain indexes, entity details, and Machine Context under `/reference/*`. The restrained local rail collapses into a native button disclosure on small screens. Entity breadcrumbs, section anchors, source links, and directional relationship links keep the current context visible. Unregistered paths show a scoped not-found view. `/reference/forma/` remains the original separate showcase entry and is reached with a document navigation.

The Vite virtual module in `reference/plugin.ts` calls the existing compiler and resolver through `reference/projection.ts`. It runs source integrity checks and produces an in-memory presentation projection from current canonical sources, without authoring or editing generated Genome files. It reuses the approved consumer’s excerpt function for exact registered Markdown scope. The token transformer supplies resolved CSS display values; original token records and aliases remain available. Production builds derive fresh data rather than requiring a checked-in generated snapshot. Imported TypeScript authority changes restart Vite through its config dependencies; watched Markdown/token changes invalidate the Reference module.

`Guidance.tsx` renders the limited Markdown constructs present in the canonical guides as React elements (no raw HTML). Registered guidance links route to the corresponding detail, domain links route to indexes, and other references retain their source locations. Excerpts are labeled authored; site framing is explanatory. Older milestone wording is preserved in authored excerpts rather than silently rewritten. Current executable availability is shown separately through actual imports and contracts.

`Examples.tsx` imports the original four Forma components and their class-scoped stylesheet; it does not import the showcase’s global styles. Inter and Forma tokens stay separate from the public Manrope/purple identity. Examples are local only, without persistence or product workflows. Foundations visualize the actual semantic color, typography, spacing, radius, shadow, and motion records. Border/focus geometry is supporting information, not a fabricated registry entity.

Machine Context shows the approved destructive-action resolver result and small real structured excerpts. It preserves the conditional Input association, original rule levels/null checkers, draft exception scope, and implementation/review boundaries. It does not run Codex or supply an entire context packet by default. Source hashes are build-time provenance, not proof of compliance.

Validation: the existing build/typecheck, test, source-integrity and compiled-freshness commands apply. Two focused Reference tests check guidance scope, navigable endpoints, unchanged contracts/relationships, conditional context, and token derivation. Review overview → foundations → component → pattern → showcase, and governance → machine context → Framework in the browser. Search, CMS, backend, and new rules/components remain deferred.

## Build guide

`build/Build.tsx` is lazy-loaded at `/build`, with chapter-scoped `build.css`. Its six sections follow the recommended sequence: choose a meaningful starting point; preserve intent and judgment; make intelligence addressable; make authority explicit; supply relevant context; verify inheritance in use. This is practical application guidance, not canonical stages or a maturity model. Each section labels Methodology, Recommended practice, and Forma example separately and ends with a practical next action.

The guide reuses the existing Reference projection for displayed IDs, relationships, contract token roles, rule validation metadata, and exception ownership/status. Reference evidence opens in a separately labeled tab so readers retain their place. A compact anchor index supports direct section entry; native links, shared focus styles, and responsive layouts keep the guide usable without completion tracking or new interaction dependencies.

Review `/build` at desktop and mobile widths, section anchors (including direct entry), keyboard navigation, and evidence links into Reference. Existing build/typecheck, tests, source-integrity, and compiled-freshness checks apply. No new methodology, universal schema, scaffolding tool, free-text resolver, certification mechanism, or release workflow is introduced.
