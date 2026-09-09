# Design Genome Specification v0.1

Status: foundational specification. The reference implementation described here is planned, not implemented.

This document defines the methodology and intended v0.1 scope. [Architecture v0.1](architecture-v0.1.md) records the locked technical and authority decisions for realizing it.

## Definition

Design Genome is a methodology for structuring an organization’s design intelligence so humans and AI can create from the same governed system.

It connects design intent, principles, foundations, components, patterns, constraints, implementations, and validation in forms that different people and tools can consume—while keeping that intelligence owned and governed by the design organization rather than any individual tool.

## Core thesis

As more people and AI systems gain the ability to create interfaces, consistency can no longer depend primarily on everyone remembering how the organization designs. The system itself must carry that knowledge forward.

The central question is: **What infrastructure should designers own when everyone—including AI—can generate interfaces?**

The organization should own its design intelligence; creation tools should be replaceable consumers.

## Core model: Intent → Intelligence → Inheritance

- **Intent:** A human or machine has an objective.
- **Intelligence:** Design Genome supplies relevant organizational design intelligence: principles, foundations, components, patterns, content, constraints, accessibility guidance, governance, and executable implementations.
- **Inheritance:** The resulting interface inherits the organization’s design decisions.

This model describes the intended relationship between creation and organizational knowledge. It does not imply that structured context makes AI deterministic.

## Relationship to design systems

Design Genome is additive to traditional design systems, not a replacement for them. Human-facing documentation remains first-class. Designers should still be able to browse foundations, inspect components, understand variants, read rationale and accessibility guidance, and learn patterns.

Design Genome adds structured machine consumption, connectivity, rules, governance, and validation around the same organizational design intelligence. It does not replace Atomic Design.

## Eight principles

### 1. Own your design intelligence

The organization owns its design knowledge. Tools consume it; tools do not define it.

### 2. Encode, don’t merely describe

Important design decisions should be represented in forms appropriate to how they need to be consumed. This does not mean forcing all design knowledge into JSON or other structured data.

### 3. Reuse before invention

When an authoritative component, pattern, token, or behavior exists, consumers should use it before approximating or recreating it.

### 4. Intent over appearance

A useful system communicates why and when something should be used, alternatives, behavior, and purpose—not only visual properties.

### 5. Constraints are part of the system

Allowed, discouraged, prohibited, and exceptional behaviors are part of design intelligence. Constraints enable coherent creation rather than opposing creativity.

### 6. One system, multiple consumers

Humans, applications, AI systems, and design tools should consume connected authoritative sources rather than independently maintained interpretations.

### 7. Human judgment stays upstream

Humans define and evolve intent, principles, quality standards, governance, and exceptions.

### 8. Governance is continuous

Ownership, versioning, validation, exceptions, deprecation, and evolution apply throughout the system at an appropriate scale.

## Four capabilities

These are capabilities, not sequential maturity layers. Governance is cross-cutting across all four.

| Capability | Scope |
| --- | --- |
| Human-readable | Principles, rationale, UX/accessibility guidance, component documentation, examples, dos/don’ts, patterns, content guidance, and governance. |
| Machine-readable | Structured deterministic information such as semantic tokens, component contracts, variants, states, allowed/disallowed values, rules, relationships, and pattern metadata. |
| Executable | Actual reusable implementations such as components, layout primitives, and compositions. Consumers should reuse authoritative implementations instead of recreating approximations when those implementations exist. |
| Connectable | Consumption by multiple AI, development, and design environments through replaceable adapters or other interfaces. The methodology must not depend on Codex, Claude, Figma, MCP, React, or any individual vendor. |

## Seven operational domains

- Principles
- Foundations
- Components
- Patterns
- Content
- Rules
- Governance

Intent is cross-cutting and is not a standalone repository domain. Governance is both an operational domain for governance knowledge and a concern across every capability.

## Intended minimum v0.1 reference Genome

The reference implementation should contain a small representative subset sufficient to test the methodology. The following is future scope, not a list of delivered features.

| Area | Intended representative scope |
| --- | --- |
| Principles | At least three representative principles. |
| Foundations | Color, typography, spacing, and radius. |
| Components | Button, Input, Card, and a simple Layout primitive. |
| Patterns | Form and Destructive Action. |
| Content | Basic voice guidance and action-label guidance. |
| Rules | Approximately 6–10 representative rules across MUST, SHOULD, and MUST NOT, including both deterministic and human-review examples. |
| Governance | Version, authority, status, ownership where appropriate, and one documented exception example. |
| Executable | The representative components and at least one meaningful composition. |
| Connectable | One reproducible AI consumer/adapter first. |
| Validation | Representative real deterministic checks, without pretending subjective UX judgment can be automated. |

The methodology’s eight principles above are distinct from the representative organizational principles that will be authored for the fictional reference Genome.

## Positioning boundaries

Do not claim that:

- Existing design systems are not machine-readable.
- Traditional design systems only document while Design Genome uniquely encodes.
- AI becomes deterministic because context is structured.
- Infrastructure eliminates organizational adoption problems.
- Negative knowledge itself is novel.
- One AI before/after demo universally proves the methodology.
- Design Genome replaces Atomic Design.
- Design Genome requires React, JSON, Codex, Claude, Figma, or MCP.

## Reference implementation and IP boundary

This is an independent public project. Do not use, copy, infer, or recreate proprietary FlavorCloud code, components, assets, internal schemas, product designs, confidential implementation details, or employer-specific material.

The reference implementation will use an original fictional product/company and original examples. No fictional brand is established in this foundation pass.

## Deferred public site and deployment

The eventual public site will live at **design-genome.com** and will itself be built using the Design Genome reference implementation.

The recorded visual direction for that later work is:

- Stripe as primary inspiration for elegance, pacing, and boldness; Vercel as secondary reference.
- Primarily white, purple as primary, and selective blue accents; no gradients.
- Manrope as the intended primary/single font family.
- Extremely strong navigation and UX, with a “DG” placeholder logo initially.
- Subtle faint dotted genomic/gene-like background fields, never gimmicky DNA imagery.
- Sleek coded diagrams and component visuals.
- Selected visual compositions extending beyond the primary content grid toward viewport edges.
- A premium, restrained, technical, modern, design-leadership-oriented character; no AI-neon/cyberpunk aesthetic.

Hosting will use Render. The later target production workflow is:

VS Code + Codex → commit/push to GitHub main → automatic Render production deployment → design-genome.com.

These site and hosting choices do not impose tool dependencies on the methodology. Building the site or configuring Render is outside the foundation assignment.
