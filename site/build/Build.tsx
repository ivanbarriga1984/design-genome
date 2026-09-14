import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { Icon } from "../Icon";
import { data, entityById, entityPath } from "../reference/data";
import "./build.css";

const sections = [
  ["starting-point", "Choose a meaningful starting point"],
  ["intent", "Preserve intent and judgment"],
  ["addressable", "Make intelligence addressable"],
  ["authority", "Make authority explicit"],
  ["context", "Supply relevant context"],
  ["inheritance", "Verify inheritance in use"],
] as const;
const pattern = entityById(data.machine.seed);
const button = entityById("forma.components.button");
const connection = data.relationships.find(edge => edge.from === pattern.id && edge.to === button.id)!;
const labelRule = data.rules.find(rule => rule.id === "forma.rules.explicit-action-labels")!;
const exception = data.exceptions.find(record => record.ruleId === labelRule.id)!;

function EvidenceLink({ to, children }: { to: string; children: ReactNode }) {
  return <a className="dg-text-link" href={to} target="_blank" rel="noopener">{children}<Icon name="external" /><span className="build-sr"> (opens in a new tab)</span></a>;
}
function Example({ children }: { children: ReactNode }) {
  return <aside className="build-example"><span className="build-label">Forma example</span>{children}</aside>;
}
function Chapter({ index, methodology, action, children }: { index: number; methodology: string; action: string; children: ReactNode }) {
  const [id, title] = sections[index];
  return <section id={id} className="build-chapter" aria-labelledby={`${id}-title`} tabIndex={-1}>
    <header className="build-chapter-heading"><span className="build-number">0{index + 1}</span><h2 id={`${id}-title`}>{title}</h2></header>
    <div className="build-chapter-body">
      <div className="build-method"><span className="build-label">Methodology</span><p>{methodology}</p></div>
      {children}
      <div className="build-next"><Icon /><div><span className="build-label">Your next action</span><p>{action}</p></div></div>
    </div>
  </section>;
}
export default function Build() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [hash]);
  return <article className="build-page">
    <header className="build-opening dg-wrap">
      <div className="build-publication"><span className="dg-eyebrow"><span className="dg-point" />Build your own</span><span>AN IMPLEMENTATION GUIDE / v0.1</span></div>
      <h1>Start with your system.<br /><span>Connect what matters.</span></h1>
      <div className="build-opening-bottom"><p className="dg-lead">You do not need to rebuild your design system. Start with one meaningful slice and make its knowledge easier to understand, connect, consume, and review.</p><div><span className="build-label">The model stays the same</span><p className="build-model">Intent <span aria-hidden="true">→</span> Intelligence <span aria-hidden="true">→</span> Inheritance</p><Link className="dg-text-link" to="/framework">Read the Framework<Icon /></Link></div></div>
    </header>
    <div className="build-orientation dg-wrap">
      <div><h2>A practical way in.</h2><p>The six sections below are a recommended implementation sequence, not canonical stages or a maturity model. Revisit earlier decisions as your first slice reveals what is missing.</p></div>
      <dl className="build-key"><div><dt>Methodology</dt><dd>The existing model, eight principles, additive approach, and authority boundaries.</dd></div><div><dt>Recommended practice</dt><dd>Suggested actions and review questions to adapt to your organization.</dd></div><div><dt>Forma example</dt><dd>Evidence from the fictional reference system. Its choices are not universal requirements.</dd></div></dl>
    </div>
    <div className="build-guide dg-wrap">
      <nav className="build-contents" aria-label="Implementation guide sections"><span className="build-label">In this guide</span><ol>{sections.map(([id, title], index) => <li key={id}><a href={`#${id}`}><span>0{index + 1}</span>{title}</a></li>)}</ol><p>Evidence links open in a new tab. Keep this guide open, inspect the reference, then return to continue.</p></nav>
      <div className="build-chapters">
        <Chapter index={0} methodology="Design Genome is additive. A Minimum Viable Genome is a small, coherent slice of connected design knowledge—not a requirement to replace the system you already have." action="Name one workflow, identify its relevant knowledge and owners, and record the gaps you will leave visible in this first slice.">
          <div className="build-practice"><span className="build-label">Recommended practice</span><h3>Choose a decision you can actually inspect.</h3><p>Pick a real workflow with a clear objective and a manageable boundary. Reuse the guidance, tokens, components, and constraints that already support it. Ask who owns each decision before you begin encoding it.</p><ul><li>What does this workflow need to carry forward?</li><li>Which sources already express those decisions?</li><li>Where is guidance missing, conflicting, or awaiting review?</li></ul><p>Keep an inventory suited to your team. This does not prescribe a repository, schema, or universal readiness checklist.</p></div>
          <Example><h3>A connected decision, not a whole product.</h3><p>Forma’s Destructive Action pattern connects consequence, content, components, and rules. It offers a bounded slice to inspect; it does not implement a deletion workflow.</p><EvidenceLink to={entityPath(pattern)}>Inspect Destructive Action</EvidenceLink></Example>
        </Chapter>
        <Chapter index={1} methodology="Intent over appearance. Human judgment stays upstream. Preserve why a decision exists and when it applies; human-readable guidance remains first-class design knowledge." action="Write the objective, context, consequence, and rationale for your chosen decision. Name the judgment that a consumer must not silently substitute.">
          <div className="build-practice"><span className="build-label">Recommended practice</span><h3>Capture the reason before the representation.</h3><p>Describe the outcome the person needs, the situation they are in, and the consequence of acting. Explain the rationale for the design response and the alternatives it rules out.</p><p>Separate a settled decision from a question that still needs a person. A screenshot can show a result; it cannot carry all of this judgment on its own.</p><ul><li>What must the person understand before acting?</li><li>Which contextual differences would change the decision?</li><li>Who resolves an ambiguous or conflicting interpretation?</li></ul></div>
          <Example><h3>Consequence determines the treatment.</h3><p>Forma asks reviewers to assess actual destructive consequences. Its Input relationship is conditional: additional entry is relevant only when the consequence warrants it. A typed confirmation is not required for every destructive action.</p><EvidenceLink to={`${entityPath(pattern)}#guidance`}>Read the pattern guidance</EvidenceLink></Example>
        </Chapter>
        <Chapter index={2} methodology="Encode, don’t merely describe. Reuse before invention. Make knowledge addressable and connect its meaning, using representations appropriate to the knowledge and its consumers." action="Give the selected knowledge stable identities, record the relationships that matter, and connect guidance to the contracts and constraints a consumer can inspect.">
          <div className="build-practice"><span className="build-label">Recommended practice</span><h3>Make the connections explicit.</h3><p>Use stable identities so a decision can be referenced independently of its current file location. Express allowed component behavior in contracts, reusable visual decisions in semantic token roles, and constraints in inspectable records where useful.</p><p>Keep rationale in guidance. Structured records should make relevant facts and relationships usable without duplicating every sentence or pretending that every rule is deterministic.</p><ul><li>Can a consumer find the authoritative contract from the guidance?</li><li>Do relationships express meaning beyond an import graph?</li><li>Which constraints can be checked, and which require review?</li></ul></div>
          <Example><h3>One relationship, with a usable destination.</h3><div className="build-edge"><code>{connection.from}</code><span>↓ {connection.relation}</span><code>{connection.to}</code></div><dl className="build-facts"><div><dt>Button contract role</dt><dd><code>primary.background</code> → <code>{data.machine.example.tokenRoles["primary.background"]}</code></dd></div><div><dt>Explicit action labels</dt><dd><strong>{labelRule.level}</strong> · {labelRule.validation.mode}<br />Checker: <code>{String(labelRule.validation.checker)}</code></dd></div></dl><p>These IDs, relationship terms, token roles, and records are Forma choices. They do not require your system to use TypeScript, React, or this file structure.</p><div className="build-evidence-links"><EvidenceLink to={`${entityPath(button)}#contract`}>Open the Button contract</EvidenceLink><EvidenceLink to={`${entityPath(pattern)}#relationships`}>Inspect registry relationships</EvidenceLink></div></Example>
        </Chapter>
        <Chapter index={3} methodology="Own your design intelligence. Governance is continuous. Guidance, contracts, implementation, and governance hold distinct, connected authority; availability is not approval." action="Record which source governs each decision, who owns it, its status and version context, and how a scoped exception returns for review.">
          <div className="build-practice"><span className="build-label">Recommended practice</span><h3>Make the review boundary visible.</h3><p>Identify where rationale lives, what defines allowed behavior, what is implemented, and who determines authority. These sources may live across your existing infrastructure; they do not all need to be in one repository.</p><p>Keep ownership, status, and version context inspectable. For an exception, record the affected rule, the narrow scope, the reason, and when it must be reassessed. A consumer should not interpret a draft or an available artifact as release approval.</p><p className="build-emphasis">Availability is not approval.</p></div>
          <Example><h3>A constraint with a review boundary.</h3><dl className="build-facts build-facts-inline"><div><dt>Exception status</dt><dd>{exception.status}</dd></div><div><dt>Owner</dt><dd>{exception.owner}</dd></div><div><dt>Genome version</dt><dd>{data.genome.version}</dd></div></dl><p>{exception.reason}</p><p>The exception applies only to that final embedded action. Review it when the integration changes or is replaced, including terminology or customization changes; retire it when the constraint ends. This draft grants no live approval.</p><EvidenceLink to={entityPath(entityById(exception.id))}>Review the embedded-workflow exception</EvidenceLink></Example>
        </Chapter>
        <Chapter index={4} methodology="One system, multiple consumers. Derived representations and adapters expose relevant governed knowledge; they do not become a separate policy authority." action="Choose one consumer and one explicit scope. Supply the relevant knowledge with its provenance, conditional context, and unresolved review boundaries intact.">
          <div className="build-practice"><span className="build-label">Recommended practice</span><h3>Supply what the task needs to know.</h3><p>Derive a consumer-appropriate representation from authoritative sources. Preserve where it came from and how its scope was selected. Decide which connected knowledge is required, what is conditional, and what remains outside the request.</p><p>A resolver selects relevant knowledge according to its defined policy. A consumer uses the supplied context to do work. Neither role silently acquires the organization’s authority to approve the result.</p><ul><li>Can you trace supplied facts back to their sources?</li><li>Is the derived representation current?</li><li>Are scope limits and unresolved questions visible to the consumer?</li></ul></div>
          <Example><h3>An explicit seed, a bounded result.</h3><span className="build-label build-record-label">Current Forma resolver seed</span><code className="build-seed">{data.machine.seed}</code><p>The approved compiler derives a snapshot from validated sources. The resolver follows encoded relationships from this explicit seed; the Codex consumer formats the resolved context. It does not classify free-text intent or implement an interface.</p><p>Conditional Input context remains separate. Source hashes provide provenance, not proof that a resulting interface complies.</p><EvidenceLink to="/reference/machine-context">Open Machine Context</EvidenceLink></Example>
        </Chapter>
        <Chapter index={5} methodology="Inheritance means carrying design decisions into the result. Constraints remain part of the system, and human judgment and continuous governance remain necessary when that result is reviewed." action="Review one implementation against the original objective and connected decisions. Record what passed, what still needs judgment, and what the first slice should improve next.">
          <div className="build-practice"><span className="build-label">Recommended practice</span><h3>Review the result, not just the supplied context.</h3><p>Implement using the existing governed primitives and contracts. Run the deterministic checks that actually exist, then inspect whether the outcome preserves the intended consequence, language, hierarchy, and behavior.</p><p>Keep unsupported requirements, unimplemented checkers, and unresolved gaps visible. Return missing or conflicting knowledge to its owners. Your organization retains release and acceptance authority.</p><ul><li>Did the implementation reuse the intended knowledge correctly?</li><li>Does the behavior match the real product consequence?</li><li>What did the checks establish—and what still requires judgment?</li></ul></div>
          <Example><h3>Checks have a defined reach.</h3><p>Forma has source-integrity checks, component tests, and compiled-artifact freshness checks. Rule records still distinguish validation intent from delivered checker availability. Passing those checks does not certify a new workflow.</p><p>The explicit-action-label rule is <strong>{labelRule.level}</strong>, with <strong>{labelRule.validation.mode}</strong> guidance and a <code>{String(labelRule.validation.checker)}</code> checker. A person still reviews whether the action label communicates its actual outcome.</p><div className="build-evidence-links"><EvidenceLink to={entityPath(entityById(labelRule.id))}>Inspect the action-label rule</EvidenceLink><EvidenceLink to="/reference/forma/">Open the executable Forma showcase</EvidenceLink></div></Example>
        </Chapter>
      </div>
    </div>
    <footer className="build-closing dg-wrap"><span className="dg-eyebrow">Put the first slice to work</span><h2>Start small.<br />Keep it connected.</h2><p className="dg-lead">Learn from what the first slice reveals.</p><div className="build-handoff"><div><h3>Inspect the reference again.</h3><p>Follow a decision through Forma’s guidance, contracts, relationships, and review boundaries.</p><Link className="dg-text-link" to="/reference">Explore Forma<Icon /></Link></div><div><h3>Begin with your own system.</h3><p>Choose the workflow and bring its existing knowledge and owners into view.</p><a className="dg-text-link" href="#starting-point">Choose your starting point<Icon /></a></div></div></footer>
  </article>;
}
