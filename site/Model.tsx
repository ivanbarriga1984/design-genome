import { useState } from "react";
import { Icon } from "./Icon";
const phases = [
  {
    title: "Intent",
    question: "What are we trying to accomplish?",
    detail:
      "Start with the outcome and the context. The system needs to understand the work before relevant design knowledge can be applied.",
    example: "Help a team create a project.",
  },
  {
    title: "Intelligence",
    question: "What governed design knowledge applies?",
    detail:
      "Bring together relevant principles, patterns, content, rules, and component contracts—including their governance context.",
    example: "Use explicit action labels and governed components.",
  },
  {
    title: "Inheritance",
    question: "What decisions should carry forward into the implementation?",
    detail:
      "Carry applicable decisions into the result, with a connection back to the knowledge that informed them. Review still matters.",
    example: "A “Create project” action using the Forma Button.",
  },
];
export function Model() {
  const [selected, setSelected] = useState(1);
  return (
    <div className="dg-model" data-selected={selected}>
      <div className="dg-model-meta">
        <span>THE CORE MODEL</span>
        <span>01 — 03 / CONNECTED BY DESIGN</span>
      </div>
      <div className="dg-model-phases" aria-label="Explore the core model">
        {phases.map((phase, i) => (
          <button
            key={phase.title}
            aria-pressed={selected === i}
            aria-controls="model-detail"
            onClick={() => setSelected(i)}
            className="dg-model-phase"
          >
            <span className="dg-model-node">0{i + 1}</span>
            <span className="dg-model-title">{phase.title}</span>
            <span className="dg-model-question">{phase.question}</span>
            {i < 2 && <Icon />}
          </button>
        ))}
      </div>
      <div className="dg-model-detail" id="model-detail" aria-live="polite">
        <div>
          <span className="dg-step">
            {phases[selected].title} / IN PRACTICE
          </span>
          <p>{phases[selected].detail}</p>
        </div>
        <div className="dg-model-example">
          <span>For example</span>
          <p>{phases[selected].example}</p>
        </div>
      </div>
    </div>
  );
}
