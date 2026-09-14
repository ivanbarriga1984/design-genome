import { Link, useLocation } from "react-router";
import { useEffect, type ReactNode } from "react";
import { Icon } from "../Icon";
import { CoreModel, KnowledgeMap } from "./FrameworkVisuals";
import "./framework.css";
const repo = "https://github.com/ivanbarriga1984/design-genome/blob/main/";
function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <span className="dg-eyebrow fw-label">
      <span>{number}</span>
      {children}
    </span>
  );
}
export default function Framework() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash)
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ block: "start" });
  }, [hash]);
  return (
    <article className="fw-page">
      <header className="fw-opening dg-wrap">
        <div className="fw-publication">
          <span className="dg-eyebrow">
            <span className="dg-point" />
            The Framework
          </span>
          <span>DESIGN GENOME / v0.1</span>
        </div>
        <h1>
          Design knowledge.
          <br />
          <span>Built to carry forward.</span>
        </h1>
        <div className="fw-opening-bottom">
          <p className="dg-lead">
            A methodology for structuring an organization’s design intelligence
            so humans and AI can create from the same governed system.
          </p>
          <div>
            <span className="fw-small">THE CENTRAL QUESTION</span>
            <p>
              What infrastructure should designers own when everyone can
              generate interfaces?
            </p>
            <a href="#core-model" className="dg-text-link">
              Start with the model
              <Icon />
            </a>
          </div>
        </div>
        <nav className="fw-contents" aria-label="On this page">
          <a href="#the-shift">The shift</a>
          <a href="#core-model">The model</a>
          <a href="#connected-knowledge">The connections</a>
          <a href="#knowledge-travels">In practice</a>
          <a href="#minimum-genome">Your starting point</a>
        </nav>
      </header>
      <section id="the-shift" className="fw-section dg-wrap fw-editorial">
        <SectionLabel number="01">The shift</SectionLabel>
        <div>
          <h2>
            Creation got easier.
            <br />
            <span className="fw-muted">Consistency didn’t.</span>
          </h2>
          <div className="fw-prose-pair">
            <p className="dg-lead">
              A component can tell you what is possible. It cannot, on its own,
              tell you what is appropriate.
            </p>
            <div>
              <p>
                Generating an interface is increasingly accessible. The harder
                question is whether the result reflects the organization’s
                purpose, content, composition logic, and constraints.
              </p>
              <p>
                Documentation and components already carry valuable design
                knowledge. Giving a tool access to them does not automatically
                bring the relevant rationale, exceptions, or governance into a
                particular decision.
              </p>
            </div>
          </div>
          <p className="fw-pull-line">
            The gap is between <strong>available knowledge</strong> and{" "}
            <strong>applicable knowledge.</strong>
          </p>
        </div>
      </section>
      <section className="fw-additive">
        <div className="dg-wrap">
          <SectionLabel number="02">An additive architecture</SectionLabel>
          <div className="fw-split-heading">
            <h2>
              Keep the system.
              <br />
              Extend its reach.
            </h2>
            <p className="dg-lead">
              Human-readable documentation stays first-class. The Genome gives
              the same design knowledge additional ways to operate.
            </p>
          </div>
          <div
            className="fw-infrastructure"
            aria-label="Documentation remains connected to structured intelligence, executable implementation, and consumers."
          >
            <div className="fw-retained">
              <span className="fw-small">THE KNOWLEDGE PEOPLE RELY ON</span>
              <h3>
                Design <br />
                documentation
              </h3>
              <p>Rationale. Guidance. Examples.</p>
              <span className="fw-retained-note">
                <span className="dg-point" />
                Remains part of the system
              </span>
            </div>
            <div className="fw-extension">
              <div>
                <span aria-hidden="true">+</span>
                <h3>Structured intelligence</h3>
                <p>Decisions tools can inspect.</p>
              </div>
              <div>
                <span aria-hidden="true">+</span>
                <h3>Executable implementation</h3>
                <p>Decisions embodied in working code.</p>
              </div>
              <div>
                <span aria-hidden="true">+</span>
                <h3>Connections to consumers</h3>
                <p>Relevant knowledge, supplied in context.</p>
              </div>
            </div>
          </div>
          <div className="fw-infrastructure-caption">
            <span>Together: design infrastructure</span>
            <p>
              Not a new container for everything. Connected sources with
              distinct responsibilities.
            </p>
          </div>
        </div>
      </section>
      <section id="core-model" className="fw-section fw-core">
        <div className="dg-wrap">
          <SectionLabel number="03">The core model</SectionLabel>
          <div className="fw-split-heading">
            <h2>
              Three ideas.
              <br />
              One continuous relationship.
            </h2>
            <p className="dg-lead">
              Start with an objective. Bring relevant intelligence into context.
              Carry applicable decisions into what gets made.
            </p>
          </div>
        </div>
        <CoreModel />
      </section>
      <section id="connected-knowledge" className="fw-section dg-wrap">
        <SectionLabel number="04">What the Genome connects</SectionLabel>
        <div className="fw-split-heading">
          <h2>
            More than artifacts.
            <br />
            <span className="fw-muted">The relationships between them.</span>
          </h2>
          <p>
            Foundations describe reusable decisions. Contracts define allowed
            behavior. Patterns explain when they apply. Explicit relationships
            make that knowledge discoverable from a meaningful starting point.
          </p>
        </div>
        <KnowledgeMap />
        <div className="fw-domain-index">
          <span className="fw-small">SEVEN OPERATIONAL DOMAINS</span>
          <p>
            Principles <i /> Foundations <i /> Components <i /> Patterns <i />{" "}
            Content <i /> Rules <i /> Governance
          </p>
          <small>
            Intent crosses the domains. Relationships connect their entities.
            Exceptions belong to governance.
          </small>
        </div>
      </section>
      <section className="fw-capabilities">
        <div className="dg-wrap">
          <SectionLabel number="05">
            Four complementary capabilities
          </SectionLabel>
          <div className="fw-split-heading">
            <h2>
              Different ways to use it.
              <br />
              The same connected system.
            </h2>
            <p className="dg-lead">
              These are capabilities, not maturity levels. People do not
              graduate out of documentation when machines begin consuming the
              system.
            </p>
          </div>
          <div className="fw-capability-matrix">
            <div className="fw-governance-band">
              <span className="dg-point" />
              <strong>Governance & context</strong>
              <span>Authority · ownership · status · exceptions · review</span>
            </div>
            <div className="fw-capability-rows">
              {[
                [
                  "Human-readable",
                  "Understand why and when.",
                  "People browse principles, rationale, UX guidance, patterns, and examples. Judgment has a place; it does not have to become a field in a schema.",
                  "A designer reads why a pattern is appropriate.",
                ],
                [
                  "Machine-readable",
                  "Inspect what is allowed.",
                  "Tools consume semantic tokens, component contracts, rule metadata, and explicit relationships. Structured information makes decisions addressable.",
                  "A tool resolves a pattern to its rules and components.",
                ],
                [
                  "Executable",
                  "Use what actually exists.",
                  "Real components and compositions embody design decisions. When an authoritative implementation fits the task, consumers reuse it before inventing an approximation.",
                  "An implementation imports the governed Button.",
                ],
                [
                  "Connectable",
                  "Bring knowledge into context.",
                  "Replaceable adapters and interfaces deliver relevant intelligence to human, development, design, and AI environments. Consumers do not become new design authorities.",
                  "An adapter supplies a task-scoped context packet.",
                ],
              ].map(([title, summary, description, example], i) => (
                <div className="fw-capability-row" key={title}>
                  <span className="fw-small">0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <strong>{summary}</strong>
                  </div>
                  <p>{description}</p>
                  <p className="fw-capability-example">
                    <span>IN PRACTICE</span>
                    {example}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="fw-governance-note">
            <h3>Availability is not approval.</h3>
            <p>
              Status, ownership, and scope travel with the knowledge. A draft
              exception is review context, not permission. A deterministic check
              can validate a contract; it cannot decide whether a product
              consequence is acceptable.
            </p>
          </div>
        </div>
      </section>
      <section id="knowledge-travels" className="fw-section dg-wrap">
        <SectionLabel number="06">How knowledge travels</SectionLabel>
        <div className="fw-split-heading">
          <h2>
            Follow one real path.
            <br />
            See where judgment stays.
          </h2>
          <p className="dg-lead">
            Forma’s existing destructive-action consumer makes the distinction
            tangible: knowledge is resolved and supplied; implementation remains
            a separate responsibility.
          </p>
        </div>
        <div className="fw-brief">
          <span className="fw-small">THE EXISTING CONSUMER’S BRIEF</span>
          <blockquote>
            “Add a destructive action allowing a user to delete a project.”
          </blockquote>
          <p>
            The caller explicitly selects the destructive-action pattern. The
            reference does not infer intent from this sentence.
          </p>
        </div>
        <div className="fw-journey">
          <div>
            <span className="fw-journey-number">01</span>
            <span className="fw-journey-transfer" aria-hidden="true">
              <Icon />
            </span>
            <span className="fw-small">WHAT THE GENOME KNOWS</span>
            <h3>Connected decisions</h3>
            <p>
              The destructive-action pattern uses Button, Stack, and
              action-label guidance. Explicit labels and destructive intent are
              among its governing rules.
            </p>
            <div className="fw-evidence">
              Input is conditional.
              <br />
              Confirmation is a contextual decision.
            </div>
            <a
              href={`${repo}genome/patterns/destructive-action.md`}
              className="dg-text-link"
            >
              Read the pattern
              <Icon name="external" />
            </a>
          </div>
          <div>
            <span className="fw-journey-number">02</span>
            <span className="fw-journey-transfer" aria-hidden="true">
              <Icon />
            </span>
            <span className="fw-small">WHAT THE CONSUMER RECEIVES</span>
            <h3>Scoped context</h3>
            <p>
              The compiled Genome’s relationships resolve the relevant guidance,
              contracts, token mappings, and governance into a task-scoped
              packet.
            </p>
            <div className="fw-evidence">
              Original rule levels and draft status remain.
              <br />
              Conditional context stays separate.
            </div>
            <a
              href={`${repo}adapters/codex/README.md`}
              className="dg-text-link"
            >
              Inspect the consumer
              <Icon name="external" />
            </a>
          </div>
          <div>
            <span className="fw-journey-number">03</span>
            <span className="fw-small">WHAT STILL HAS TO HAPPEN</span>
            <h3>Implementation & review</h3>
            <p>
              A separately authorized implementation must reuse the components,
              respect their APIs, explain the actual consequence, and test the
              resulting behavior.
            </p>
            <div className="fw-evidence">
              The consumer does not delete a project.
              <br />
              Supplied context does not certify the result.
            </div>
            <a href="/reference/forma/" className="dg-text-link">
              Inspect the components
              <Icon />
            </a>
          </div>
        </div>
        <div className="fw-lifecycle">
          <div><span>Author</span><Icon /><span>Validate & derive</span></div>
          <div><Icon /><span>Consume</span></div>
          <div><Icon /><span>Implement & review</span></div>
        </div>
        <p className="fw-note">
          The reference compiler validates source integrity before publishing
          its snapshot. The adapter reads that snapshot; it does not redefine
          the authored system.
        </p>
      </section>
      <section id="minimum-genome" className="fw-minimum">
        <div className="dg-wrap fw-minimum-layout">
          <div>
            <SectionLabel number="07">Minimum Viable Genome</SectionLabel>
            <h2>
              Start small.
              <br />
              <span>Keep it connected.</span>
            </h2>
            <p className="dg-lead">
              A focused slice can make the architecture useful and inspectable
              before the whole system is connected.
            </p>
            <p>
              Choose a meaningful use case. Connect its rationale, constraints,
              contracts, implementation, and governance. Make that slice usable
              by a person and a consumer, then learn from what it reveals.
            </p>
          </div>
          <div className="fw-minimum-detail">
            <span className="fw-small">THE FORMA REFERENCE SLICE</span>
            <dl>
              <div>
                <dt>Knowledge</dt>
                <dd>
                  Representative principles, foundations, content, and rules.
                </dd>
              </div>
              <div>
                <dt>Use</dt>
                <dd>
                  Form and Destructive Action patterns; Button, Input, Card, and
                  Stack.
                </dd>
              </div>
              <div>
                <dt>Accountability</dt>
                <dd>
                  Ownership, version, status, an exception, and explicit review
                  boundaries.
                </dd>
              </div>
              <div>
                <dt>Consumption</dt>
                <dd>
                  Working components, focused checks, and one reproducible
                  consumer.
                </dd>
              </div>
            </dl>
            <p>
              A representative scope to test the methodology—not a required
              inventory for every organization.
            </p>
          </div>
        </div>
      </section>
      <section className="fw-section dg-wrap fw-editorial">
        <SectionLabel number="08">Own your intelligence</SectionLabel>
        <div>
          <h2>
            Your knowledge.
            <br />
            Your infrastructure.
          </h2>
          <div className="fw-prose-pair">
            <p className="dg-lead">
              Tools can change.
              <br />
              They should not be the sole authority for how your organization
              designs.
            </p>
            <div>
              <p>
                Keep authored guidance, contracts, executable behavior, and
                governance connected in infrastructure your team controls. Each
                source has a responsibility; no single file has to contain the
                entire system.
              </p>
              <p>
                The reference uses Markdown, TypeScript, React, and a Codex
                consumer. These are implementation choices, not requirements of
                the methodology. Different consumers still need compatible
                interfaces and deliberate integration.
              </p>
            </div>
          </div>
          <div
            className="fw-ownership"
            aria-label="Organization-controlled design authority exposes relevant knowledge through interfaces and adapters to replaceable consumers and tools."
          >
            <div className="fw-owned-sources">
              <span className="fw-small">OWNED DESIGN AUTHORITY</span>
              <div className="fw-authority">
                <span>
                  Guidance<small>Why & when</small>
                </span>
                <span>
                  Contracts<small>What is allowed</small>
                </span>
                <span>
                  Implementation<small>What exists</small>
                </span>
                <span>
                  Governance<small>What is authoritative</small>
                </span>
              </div>
              <p>Connected sources, controlled by your organization.</p>
            </div>
            <div className="fw-authority-delivery">
              <div className="fw-authority-interface">
                <span className="fw-small">EXPOSE RELEVANT KNOWLEDGE</span>
                <strong>Interfaces & adapters</strong>
              </div>
              <span className="fw-authority-connector" aria-hidden="true">
                <Icon />
              </span>
              <div className="fw-authority-consumers">
                <span className="fw-small">REPLACEABLE</span>
                <strong>Consumers & tools</strong>
              </div>
            </div>
          </div>
          <a
            className="dg-text-link"
            href={`${repo}docs/specification-v0.1.md#eight-principles`}
          >
            Read the eight methodology principles
            <Icon name="external" />
          </a>
        </div>
      </section>
      <section className="fw-next">
        <div className="dg-wrap">
          <SectionLabel number="09">From understanding to use</SectionLabel>
          <h2>
            Now follow it
            <br />
            <span>into a real system.</span>
          </h2>
          <div className="fw-next-links">
            <Link to="/reference">
              <span className="fw-small">INSPECT</span>
              <strong>Explore the reference Genome</strong>
              <Icon />
              <p>See the ideas connected in Forma.</p>
            </Link>
            <Link to="/build">
              <span className="fw-small">APPLY</span>
              <strong>Build your own</strong>
              <Icon />
              <p>Extend the system you already have.</p>
            </Link>
          </div>
          <p className="fw-source-note">
            Based on the{" "}
            <a href={`${repo}docs/specification-v0.1.md`}>v0.1 specification</a>{" "}
            and{" "}
            <a href={`${repo}docs/architecture-v0.1.md`}>
              reference architecture
            </a>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
