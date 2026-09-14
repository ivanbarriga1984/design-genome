import { useState } from "react";
import { relationships, entities } from "../../genome/registry";
import { Icon } from "../Icon";
const model = [
  {
    name: "Intent",
    question: "What are we trying to accomplish?",
    text: "An objective gives design knowledge a reason to be relevant. It includes the purpose and context of the work, whether the request comes from a person or a machine.",
    terms: ["Objective", "Context", "Consequence"],
    example: "A team needs a way to delete a project.",
    judgment:
      "Establish what deletion actually affects before choosing the interaction.",
  },
  {
    name: "Intelligence",
    question: "What governed design knowledge applies?",
    text: "The relevant principles, patterns, content, rules, contracts, and constraints come together through explicit relationships—with their authority and review context intact.",
    terms: ["Guidance", "Contracts", "Governance"],
    example:
      "Resolve the destructive-action pattern to its connected knowledge.",
    judgment:
      "Keep conditional associations conditional. Do not turn a draft exception into approval.",
  },
  {
    name: "Inheritance",
    question: "What decisions should carry forward?",
    text: "The implementation carries applicable organizational decisions forward instead of rediscovering them independently. Consumers must actually use the supplied knowledge and the implementations it identifies.",
    terms: ["Reuse", "Apply", "Review"],
    example:
      "Reuse the governed Button and communicate the actual destructive consequence.",
    judgment:
      "Review the resulting interface. Structured context does not make AI deterministic.",
  },
];
export function CoreModel() {
  const [selected, setSelected] = useState(0);
  const phase = model[selected];
  return (
    <div className="fw-core-field">
      <div className="dg-wrap">
        <div className="fw-core-index">
          <span className="fw-small">INTENT → INTELLIGENCE → INHERITANCE</span>
          <span>Select a concept to explore it</span>
        </div>
        <div className="fw-core-select" aria-label="Core model concepts">
          {model.map((item, i) => (
            <button
              type="button"
              key={item.name}
              aria-pressed={selected === i}
              aria-controls="fw-core-explanation"
              onClick={() => setSelected(i)}
            >
              <span className="fw-core-dot">0{i + 1}</span>
              <span>{item.name}</span>
              {i < 2 && <Icon />}
            </button>
          ))}
        </div>
        <div
          id="fw-core-explanation"
          className="fw-core-explanation"
          aria-live="polite"
        >
          <div className="fw-core-definition">
            <span className="fw-small">
              {phase.name.toUpperCase()} / IN THE MODEL
            </span>
            <h3>{phase.question}</h3>
            <p>{phase.text}</p>
            <div className="fw-core-terms">
              {phase.terms.map((term) => (
                <span key={term}>{term}</span>
              ))}
            </div>
          </div>
          <div className="fw-core-context">
            <span className="fw-small">IN THE FORMA EXAMPLE</span>
            <p>{phase.example}</p>
            <div>
              <span className="fw-small">WHERE JUDGMENT REMAINS</span>
              <p>{phase.judgment}</p>
            </div>
          </div>
        </div>
        <p className="fw-core-foot">
          A relationship between creation and knowledge. Not a promise of
          autonomous compliance.
        </p>
      </div>
    </div>
  );
}
const seed = "forma.patterns.destructive-action";
const paths = [
  {
    from: "forma.principles.clarity-before-density",
    to: seed,
    title: "Clarity before density",
    domain: "Principle",
    explanation:
      "This principle informs which consequence information must be understandable. The relationship points from the principle to the pattern.",
  },
  {
    from: seed,
    to: "forma.content.action-labels",
    title: "Action labels",
    domain: "Content",
    explanation:
      "The pattern uses content guidance to communicate what the action will do, in context.",
  },
  {
    from: seed,
    to: "forma.rules.explicit-action-labels",
    title: "Explicit action labels",
    domain: "Rule",
    explanation:
      "The rule governs the pattern. Whether a label communicates the outcome still requires contextual review.",
  },
  {
    from: seed,
    to: "forma.components.button",
    title: "Button",
    domain: "Component",
    explanation:
      "The pattern uses the existing Button. Its contract defines the supported API; its implementation defines actual behavior.",
  },
  {
    from: seed,
    to: "forma.components.input",
    title: "Input",
    domain: "Conditional association",
    explanation:
      "The related-to edge is conditional: additional entry is relevant only when the consequence warrants it. It is not required for every destructive action.",
  },
].map((path) => {
  const edge = relationships.find(
    (edge) => edge.from === path.from && edge.to === path.to,
  );
  if (!edge)
    throw new Error(
      `Framework example relationship missing: ${path.from} → ${path.to}`,
    );
  const entity = entities.find(
    (entity) => entity.id === (path.from === seed ? path.to : path.from),
  );
  if (!entity) throw new Error("Framework example entity missing");
  return { ...path, edge, status: entity.status, owner: entity.owner };
});
export function KnowledgeMap() {
  const [selected, setSelected] = useState(0);
  const path = paths[selected];
  return (
    <div className="fw-map">
      <div className="fw-map-heading">
        <span className="fw-small">A REAL SUBSET OF FORMA’S RELATIONSHIPS</span>
        <span>Select a connection</span>
      </div>
      <div className="fw-map-layout">
        <div className="fw-map-root">
          <span className="fw-small">PATTERN / STARTING POINT</span>
          <h3>
            Destructive
            <br />
            Action
          </h3>
          <code>{seed}</code>
          <span className="fw-map-root-foot">
            Relevant knowledge,
            <br />
            connected by meaning.
          </span>
        </div>
        <div className="fw-map-branches">
          {paths.map((item, i) => (
            <button
              type="button"
              key={item.to + item.from}
              aria-pressed={selected === i}
              aria-controls="fw-relationship-detail"
              onClick={() => setSelected(i)}
              data-conditional={item.edge.relation === "related-to"}
            >
              <span className="fw-edge-type">
                {item.from === seed ? "→" : "←"} {item.edge.relation}
              </span>
              <span>
                <small>{item.domain}</small>
                <strong>{item.title}</strong>
              </span>
              <span className="fw-branch-node" />
            </button>
          ))}
        </div>
      </div>
      <div
        className="fw-map-detail"
        id="fw-relationship-detail"
        aria-live="polite"
      >
        <div>
          <span className="fw-small">SELECTED RELATIONSHIP</span>
          <p>{path.explanation}</p>
        </div>
        <div>
          <p>
            <span className="fw-metadata-label">Source</span> {path.status} · {path.owner}
          </p>
          <a href="https://github.com/ivanbarriga1984/design-genome/blob/main/genome/registry.ts">
            Inspect the registry
            <Icon name="external" />
          </a>
        </div>
      </div>
    </div>
  );
}
