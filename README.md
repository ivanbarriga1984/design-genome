# Design Genome

Design Genome is a methodology for structuring an organization’s design intelligence so humans and AI can create from the same governed system.

It connects design intent, principles, foundations, components, patterns, constraints, implementations, and validation in forms that different people and tools can consume—while keeping that intelligence owned and governed by the design organization rather than any individual tool.

**Intent → Intelligence → Inheritance**

As more people and AI systems gain the ability to create interfaces, consistency can no longer depend primarily on everyone remembering how the organization designs. The system itself must carry that knowledge forward.

Design Genome is additive to traditional design systems. Human-facing documentation remains first-class; structured information, executable implementations, connectivity, governance, and validation connect to the same organizational design intelligence.

## Project status

The v0.1 methodology, public website, and Forma reference implementation are implemented. Production deployment remains a separate release step.

- [Specification v0.1](docs/specification-v0.1.md): definition, principles, capabilities, domains, boundaries, and intended reference scope.
- [Architecture v0.1](docs/architecture-v0.1.md): locked decisions, authority boundaries, lifecycle, and repository responsibilities.

The repository now includes the first authored [Forma Design Genome](genome/README.md): guidance, authored visual foundation tokens, specified component contracts, rule metadata, semantic relationships, and governance. Forma is the fictional reference organization. A local React showcase now demonstrates Button, Input, Card, and Stack with generated foundation CSS. Focused tests cover selected deterministic behavior; no comprehensive UI or accessibility compliance is claimed.

## Implementation direction

The reference implementation uses original examples for Forma, a fictional collaborative workflow-management SaaS product. Its current technical direction includes Markdown/MDX, established design-token conventions, TypeScript contracts and validation, and React with TypeScript. These are reference implementation choices, not requirements of the methodology.

Forma’s visual foundations, four executable components, compiled Genome, and first Codex context consumer are delivered. The public website includes Framework, Reference, and Build your own. The methodology documents retain clearly labeled foundation history; the Genome entry point describes the current organizational sources. Deployment remains to be configured.

## Independence

Do not use, copy, infer, or recreate proprietary FlavorCloud code, components, assets, internal schemas, product designs, confidential implementation details, or employer-specific material. All reference examples must be original.

## Local reference environment

Use Node.js 22.18+ (or a newer supported release) and npm. The scripts use Node's native TypeScript support. The public site and isolated Forma showcase use Vite + React + TypeScript with plain CSS.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite for the public Design Genome site. Visit `/reference/forma/` for the isolated component showcase, or `/reference` for the browsable Genome. The showcase exposes component variants, sizes, actual hover/focus interactions, disabled/loading/error examples, and a local project-creation composition. Inter is bundled locally through `@fontsource/inter` for the three governed normal weights; no remote font service is requested.

```sh
npm run build
npm run typecheck
npm run check
npm test
npm run tokens
```

`build` typechecks and produces ignored `dist/` output. `check` validates source integrity; `test` exercises token derivation and focused DOM component behavior using Node, tsx, and jsdom. No linter is configured. Vite generates token CSS before serving/building and updates it when authored tokens change. See [generated artifact responsibilities](generated/README.md). Do not edit generated CSS or treat it as design authority.

## Compiled Genome

The existing Forma authority can now be compiled into a generated JSON snapshot for deterministic machine consumption. It preserves structured contracts, relationships, governance and source-linked prose; it does not infer design intent or generate interfaces.

```sh
npm run genome:generate
npm run genome:check
npm run genome:query -- forma.patterns.destructive-action
```

See [compiled Genome architecture, query behavior and limitations](docs/compiled-genome.md). Human-readable design-system guidance remains first-class. Generated JSON is ignored by Git and must never be edited as authority.

## First Codex consumer

`npm run codex:context` creates an ignored, task-scoped destructive-action context packet from the compiled Genome. It does not call Codex or implement a feature. Run the upstream `genome:generate` / `genome:check` commands first. See the [Codex consumer and qualitative comparison protocol](adapters/codex/README.md) for explicit invocation, authority boundaries, validation and limitations.

## Disposable experiment preparation

The [experiment-export harness](experiments/README.md) exports the pinned consumer milestone into two self-contained implementation fixtures. It freezes runtime dependencies privately and supplies the approved context packet only to the Genome-informed condition. Export/verification commands prepare the experiment; they never run either implementation condition or alter the canonical Forma implementation.

## Licensing and reuse

The knowledge is licensed under **CC BY 4.0**; the software that operates on or implements it is licensed under **MIT**. This boundary follows the artifact’s role, not its file format. In particular, the entire authored `genome/` tree, including TypeScript contracts/records and JSON tokens, is CC BY 4.0.

See [LICENSE.md](LICENSE.md) for the path/role mapping, attribution, embedded content, generated material, and third-party exclusions. Copyright © 2026 Ivan Barriga. Third-party materials retain their own licenses.
