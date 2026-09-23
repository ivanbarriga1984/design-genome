import { Link } from "react-router";
import { Icon } from "./Icon";
import { lazy, Suspense } from "react";
import { Model } from "./Model";
const ReferenceDemo = lazy(() => import("./ReferenceDemo"));

export function EncodedVisual() {
  return (
    <div
      className="dg-encoded"
      role="img"
      aria-label="Design decisions connect through a structured Genome to human and machine consumers."
    >
      <svg
        className="dg-dot-field"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hero-dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>
      <div className="dg-encoded-label">DESIGN KNOWLEDGE / CONNECTED</div>
      <div className="dg-gene gene-one">
        <i />
        <span>Intent</span>
        <small>What matters.</small>
      </div>
      <div className="dg-gene gene-two">
        <i />
        <span>Decisions</span>
        <small>Made explicit.</small>
      </div>
      <div className="dg-gene gene-three">
        <i />
        <span>Governance</span>
        <small>With context.</small>
      </div>
      <svg
        className="dg-wires"
        viewBox="0 0 520 470"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="dg-flow-in"
          pathLength="1"
          vectorEffect="non-scaling-stroke"
          d="M133 105H218V235H275 M133 235H275 M133 365H218V235"
        />
        <path
          className="dg-flow-out"
          pathLength="1"
          vectorEffect="non-scaling-stroke"
          d="M350 235H402V175H457 M402 235V305H457"
        />
        <circle cx="218" cy="235" r="5" />
        <circle cx="402" cy="235" r="5" />
      </svg>
      <div className="dg-genome-core">
        <div className="dg-core-pixels" aria-hidden="true">
          {Array.from({ length: 25 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <span>Genome</span>
      </div>
      <div className="dg-output out-human">
        For people<span>Understand & use</span>
      </div>
      <div className="dg-output out-machine">
        For machines<span>Consume & apply</span>
      </div>
      <span className="dg-encoded-foot">
        The same knowledge. More ways forward.
      </span>
    </div>
  );
}
export function Home() {
  return (
    <>
      <section className="dg-hero dg-wrap">
        <div className="dg-hero-copy">
          <div className="dg-eyebrow">
            <span className="dg-point" />
            The Design Genome
          </div>
          <h1>
            Build design systems for humans <span>and the AI era 2026.</span>
          </h1>
          <p>
            Design systems help people create consistently.
            <br className="dg-desktop-break" /> The next generation must help
            machines do the same.
          </p>
          <div className="dg-actions">
            <Link className="dg-action" to="/framework">
              Explore the framework
              <Icon />
            </Link>
            <Link className="dg-text-link" to="/reference">
              View the reference Genome
              <Icon />
            </Link>
          </div>
        </div>
        <EncodedVisual />
      </section>
      <div className="dg-hero-note dg-wrap">
        <span>A methodology + reference architecture</span>
        <span>Built on design-system practice. Extended for what’s next.</span>
        <span>
          v0.1 <span className="dg-point" />
        </span>
      </div>
      <section className="dg-problem dg-wrap dg-section">
        <div className="dg-section-label">
          <span className="dg-eyebrow">01 / A new context</span>
        </div>
        <div className="dg-problem-content">
          <h2>
            Creation got easier.
            <br />
            <span>Consistency didn’t.</span>
          </h2>
          <div className="dg-problem-columns">
            <p className="dg-lead">
              AI makes it dramatically easier to create interfaces. It also
              makes it easier to create them inconsistently.
            </p>
            <p>
              Access to components and documentation is a start. It does not
              automatically communicate organizational intent, composition
              logic, constraints, exceptions, or governance.
            </p>
          </div>
        </div>
      </section>
      <section className="dg-shift">
        <div className="dg-wrap">
          <span className="dg-eyebrow">An additive shift</span>
          <div className="dg-shift-title">
            <span>Documentation</span>
            <Icon />
            <h2>
              Design <br />
              infrastructure
            </h2>
          </div>
          <div className="dg-shift-bottom">
            <p>
              Keep the knowledge people rely on.
              <br />
              Give it more ways to work.
            </p>
            <p>
              <strong>Human-readable documentation,</strong>{" "}
              <span>
                connected to structured intelligence, executable implementation,
                and the mechanisms that bring it to consumers.
              </span>
            </p>
          </div>
        </div>
      </section>
      <section className="dg-section dg-core-section">
        <div className="dg-wrap dg-section-intro">
          <span className="dg-eyebrow">02 / How knowledge carries forward</span>
          <h2>
            From what you mean.
            <br />
            To what gets made.
          </h2>
          <p className="dg-lead">
            A connected model for bringing design intent into the decisions
            behind an implementation.
          </p>
        </div>
        <div className="dg-breakout">
          <Model />
        </div>
      </section>
      <section className="dg-capabilities dg-wrap dg-section">
        <div className="dg-capabilities-intro">
          <span className="dg-eyebrow">03 / Four capabilities</span>
          <h2>
            One system.
            <br />
            Working together.
          </h2>
          <p>
            Complementary capabilities—not a maturity ladder. Each gives the
            same design knowledge a different way to be useful.
          </p>
          <Link className="dg-text-link" to="/framework">
            Explore the framework
            <Icon />
          </Link>
        </div>
        <div className="dg-capabilities-table">
          <div className="dg-governance">
            <span className="dg-point" />
            Governance across every capability<span aria-hidden="true">↔</span>
          </div>
          {[
            [
              "01",
              "Human-readable",
              "People can browse, understand, and manually use the system.",
            ],
            [
              "02",
              "Machine-readable",
              "Tools can consume structured design intelligence.",
            ],
            [
              "03",
              "Executable",
              "Real components and implementations embody design decisions.",
            ],
            [
              "04",
              "Connectable",
              "Adapters and interfaces bring relevant governed context to consumers.",
            ],
          ].map(([number, title, text]) => (
            <div className="dg-capability" key={title}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="dg-reference-section">
        <div className="dg-wrap dg-reference-intro">
          <div>
            <span className="dg-eyebrow">04 / See it working</span>
            <h2>
              Meet Forma.
              <br />
              Follow a decision.
            </h2>
          </div>
          <div>
            <p className="dg-lead">
              A fictional B2B workflow product.
              <br />A functioning reference Genome.
            </p>
            <p>
              Trace a design choice from authored guidance, through a structured
              representation, to the component a person actually uses.
            </p>
            <a className="dg-text-link" href="/reference/forma/">
              Explore the Forma showcase
              <Icon />
            </a>
          </div>
        </div>
        <div className="dg-wrap">
          <Suspense
            fallback={
              <div className="dg-demo-loading" role="status">
                Loading the Forma reference…
              </div>
            }
          >
            <ReferenceDemo />
          </Suspense>
          <p className="dg-reference-footnote">
            A curated reference example. The content rule guides the label; the
            component contract governs the implementation. This is not a
            demonstration of automatic AI compliance.
          </p>
        </div>
      </section>
      <section className="dg-ownership dg-wrap dg-section">
        <div
          className="dg-ownership-visual"
          role="img"
          aria-label="Team-owned design intelligence connects to people, design tools, and AI consumers through interfaces."
        >
          <div className="dg-owner-caption">AUTHORITY STAYS WITH YOUR TEAM</div>
          <div className="dg-owned">
            <span className="dg-point" />
            Your design intelligence<small>Owned. Maintained. Governed.</small>
          </div>
          <div className="dg-owner-connector" />
          <div className="dg-consumers">
            <span>People</span>
            <span>Design tools</span>
            <span>AI consumers</span>
          </div>
          <span className="dg-owner-note">
            Connections can change.
            <br />
            The knowledge remains yours to maintain.
          </span>
        </div>
        <div>
          <span className="dg-eyebrow">05 / Own the intelligence</span>
          <h2>
            Your knowledge.
            <br />
            Your infrastructure.
          </h2>
          <p className="dg-lead">
            Connect to the tools you use.
            <br />
            Keep authority over what they receive.
          </p>
          <p>
            Design Genome is not tied to Figma, Codex, Claude, or another
            commercial product. Teams can maintain their design intelligence in
            infrastructure they control.
          </p>
          <p>
            The goal is to avoid one proprietary platform becoming the sole
            authority—not to promise zero dependencies or guaranteed
            portability.
          </p>
        </div>
      </section>
      <section className="dg-build-section dg-wrap">
        <div>
          <span className="dg-eyebrow">06 / Build your own</span>
          <h2>
            Extend what exists.
            <br />
            <span>Connect what matters.</span>
          </h2>
          <p className="dg-lead">
            Start with a Minimum Viable Genome: a focused, connected slice of
            your system that can be used, inspected, and evolved.
          </p>
          <Link className="dg-text-link" to="/build">
            Find your starting point
            <Icon />
          </Link>
        </div>
        <div className="dg-existing">
          <div>
            <span>Tokens</span>
            <small>remain tokens.</small>
          </div>
          <div>
            <span>Components</span>
            <small>remain components.</small>
          </div>
          <div>
            <span>Documentation</span>
            <small>remains documentation.</small>
          </div>
          <p>
            The Genome connects intent, knowledge, implementation, governance,
            and consumers.
          </p>
        </div>
      </section>
      <section className="dg-closing">
        <div className="dg-wrap">
          <span className="dg-eyebrow">Design knowledge, carried forward.</span>
          <h2>
            Build a system
            <br />
            that goes with you.
          </h2>
          <div className="dg-actions">
            <Link className="dg-action" to="/framework">
              Explore the framework
              <Icon />
            </Link>
            <Link className="dg-text-link" to="/build">
              Build your own
              <Icon />
            </Link>
          </div>
          <div className="dg-closing-nodes" aria-hidden="true">
            {Array.from({ length: 64 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
