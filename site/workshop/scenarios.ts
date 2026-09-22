// Workshop teaching copy and explicit caller selection; never canonical authority.
export type ScenarioId = "create" | "delete" | "analytics";
export const analyticsRoots = [
  "forma.components.card", "forma.components.stack", "forma.foundations.typography",
  "forma.principles.clarity-before-density", "forma.principles.hierarchy-communicates-intent",
  "forma.content.voice", "forma.content.action-labels", "forma.rules.explicit-action-labels",
  "forma.rules.one-primary-action-per-decision-context", "forma.rules.reuse-governed-components",
] as const;
export const scenarios = {
  create: {
    name: "Create a project", theme: "Patterns + components",
    description: "See how connected form and component knowledge reduces local invention.",
    task: "Create a project form with a required project name, an optional project URL, and a clear creation action. Show useful feedback when supplied information is invalid.",
    knowledge: ["forma.patterns.form", "forma.components.input", "forma.content.action-labels"],
    traces: [
      { id: "forma.patterns.form", decision: "A coordinated form", why: "The authored Form pattern connects Input, Button and Stack with labels, feedback and the forward action. The specific layout remains local.", related: "forma.components.stack" },
      { id: "forma.components.input", decision: "Visible labels and associated feedback", why: "The Input contract connects labels, help and errors to their field. The implementer supplies useful messages and decides when errors appear.", related: "forma.components.input" },
      { id: "forma.content.action-labels", decision: "“Create project”", why: "Both results name the outcome clearly. In the informed result this choice is also traceable to explicit, verb-led action guidance.", related: "forma.rules.explicit-action-labels" },
    ],
    carried: "Connected Form guidance, governed Input / Button / Stack, label and feedback associations, explicit action guidance.",
    shared: "Both forms have clear labels, field-specific validation, first-invalid-field focus and an explicit creation action.",
    local: "Header, card, exact layout and copy, dedicated versus inline success, and HTTP/HTTPS validation are implementation choices. Both examples assume complete HTTP/HTTPS URLs; Forma does not establish that policy.",
    review: "People still decide which project information is needed, the URL policy, useful validation timing and whether the flow works in context.",
  },
  delete: {
    name: "Delete a project", theme: "Behavior + governance",
    description: "See how behavioral guidance and human judgment work together.",
    task: "Create a flow for deleting a project called 'Design operations.' Deleting the project also deletes its tasks and cannot be undone.",
    knowledge: ["forma.patterns.destructive-action", "forma.content.action-labels", "forma.rules.destructive-styling-requires-destructive-intent"],
    traces: [
      { id: "forma.patterns.destructive-action", decision: "Consequence explanation", why: "Destructive Action guidance asks for understandable consequences and affected scope. The task itself supplies the project-and-tasks facts; the Genome does not discover them.", related: "forma.components.stack" },
      { id: "forma.content.action-labels", decision: "“Delete project”", why: "The explicit verb and object carry action-label guidance into this task. Exact surrounding wording remains an implementation choice.", related: "forma.rules.explicit-action-labels" },
      { id: "forma.rules.destructive-styling-requires-destructive-intent", decision: "Destructive treatment", why: "Both results use destructive treatment. In the informed result that reasonable choice is additionally traceable to this rule and the Button contract. People still review the actual consequence.", related: "forma.components.button" },
    ],
    carried: "Explain consequences, name the action, reserve destructive treatment for destructive intent, reuse supported Button and Stack behavior.",
    shared: "Both identify the project, warn that deletion cannot be undone, offer cancellation and use destructive treatment.",
    local: "Exact wording, layout and confirmation mechanics remain local. Project-and-task deletion is already in the shared task; making that scope explicit is not evidence that only Genome-informed systems can do it.",
    review: "People must verify consequences and decide whether this context warrants additional entry. A destructive-looking button does not prove safety.",
  },
  analytics: {
    name: "Analytics summary", theme: "Foundations + composition",
    description: "See what the Genome carries forward—and what it cannot know yet.",
    task: "Create an analytics summary for a shipping operations dashboard. Show total shipments, delivery success rate, average delivery time, and exceptions requiring attention. Include a way to view the full report.",
    knowledge: ["forma.components.card", "forma.foundations.typography", "forma.principles.hierarchy-communicates-intent"],
    traces: [
      { id: "forma.components.card", decision: "Related information, governed primitives", why: "Static Card groups related information; Stack offers governed spacing and grouping. Neither defines an analytics layout. Report navigation is a native link, not a Button with an invented href API.", related: "forma.components.stack" },
      { id: "forma.foundations.typography", decision: "A semantic type hierarchy", why: "The supplied typography foundation carries Inter and complete semantic text styles. Which metric deserves prominence still needs contextual judgment.", related: "forma.principles.hierarchy-communicates-intent" },
      { id: "forma.content.action-labels", decision: "“View full report”", why: "The label names the destination in both results. Its wording is consistent with supplied action guidance; the actual report destination remains a product decision.", related: "forma.rules.explicit-action-labels" },
    ],
    carried: "Foundations, governed Card and Stack, hierarchy principles, calm content and explicit action guidance.",
    shared: "Both show the same four supplied values and offer a native link to the report. Both are plausible summaries.",
    local: "Metric composition and ordering, dashboard semantics, reporting period, thresholds, visualization strategy and responsive analytics behavior are not defined. This exercise supplies no period or threshold and invents neither as a fact.",
    review: "People must decide what the metrics mean, which exceptions need attention and whether the composition supports the operational decision.",
  },
} as const;
