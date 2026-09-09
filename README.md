# Design Genome

Design Genome is a methodology for structuring an organization’s design intelligence so humans and AI can create from the same governed system.

It connects design intent, principles, foundations, components, patterns, constraints, implementations, and validation in forms that different people and tools can consume—while keeping that intelligence owned and governed by the design organization rather than any individual tool.

**Intent → Intelligence → Inheritance**

As more people and AI systems gain the ability to create interfaces, consistency can no longer depend primarily on everyone remembering how the organization designs. The system itself must carry that knowledge forward.

Design Genome is additive to traditional design systems. Human-facing documentation remains first-class; structured information, executable implementations, connectivity, governance, and validation connect to the same organizational design intelligence.

## Project status

This is the foundation of an independent public methodology and reference implementation. The v0.1 documents establish the project’s scope and architecture; they do not indicate that a working v0.1 implementation has shipped.

- [Specification v0.1](docs/specification-v0.1.md): definition, principles, capabilities, domains, boundaries, and intended reference scope.
- [Architecture v0.1](docs/architecture-v0.1.md): locked decisions, authority boundaries, lifecycle, and future repository responsibilities.

The repository now includes the first authored [Forma Design Genome](genome/README.md): guidance, authored visual foundation tokens, draft component contract structure, rule metadata, semantic relationships, and governance. Forma is the fictional reference organization. There is no executable application, dependency installation, build, or automated UI rule enforcement yet.

## Implementation direction

The reference implementation uses original examples for Forma, a fictional collaborative workflow-management SaaS product. Its current technical direction includes Markdown/MDX, established design-token conventions, TypeScript contracts and validation, and React with TypeScript. These are reference implementation choices, not requirements of the methodology.

Forma’s first visual foundations are encoded for review. Executable components, the public site, consumer adapter, and deployment remain future work. The methodology documents preserve the original foundation scope; the Genome entry point describes the current organizational sources.

## Independence

Do not use, copy, infer, or recreate proprietary FlavorCloud code, components, assets, internal schemas, product designs, confidential implementation details, or employer-specific material. All reference examples must be original.
