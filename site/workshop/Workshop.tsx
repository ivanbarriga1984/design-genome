import { useEffect, useRef, useState } from "react";
import type { WorkshopData } from "./projection";
import { scenarios, type ScenarioId } from "./scenarios";
import { CreatePreview, DeletePreview, AnalyticsPreview } from "./previews";
import { Evidence, Traces } from "./Evidence";

type Step = "intent" | "baseline" | "knowledge" | "informed" | "inheritance" | "reflection";
function Result({ scenario, baseline = false }: { scenario: ScenarioId; baseline?: boolean }) {
  return scenario === "create" ? <CreatePreview baseline={baseline} /> : scenario === "delete" ? <DeletePreview baseline={baseline} trace={!baseline} /> : <AnalyticsPreview baseline={baseline} />;
}
export function Workshop({ data }: { data: WorkshopData }) {
  const [scenario, setScenario] = useState<ScenarioId>("create");
  const [step, setStep] = useState<Step>("intent");
  const [review, setReview] = useState<"no" | "yes" | null>(null);
  const chooser = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef(`${scenario}:${step}`);
  const reviewGroup = useRef<HTMLFieldSetElement>(null);
  const current = scenarios[scenario];
  const context = scenario === "create" ? data.form : scenario === "delete" ? data.primary : data.analytics;
  const stage = step === "intent" ? 1 : ["baseline", "knowledge", "informed"].includes(step) ? 2 : 3;
  const titles: Record<Step, string> = { intent: "What will you create?", baseline: "Looks reasonable. That’s the point.", knowledge: "Same task. More to work from.", informed: "See what carries forward.", inheritance: scenario === "delete" ? "Knowledge informs. You still decide." : "Where does the knowledge stop?", reflection: "Same intent. Different amount of organizational knowledge." };
  useEffect(() => {
    const key = `${scenario}:${step}`;
    if (previous.current !== key) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView?.({ block: "start", behavior: "instant" });
      previous.current = key;
    }
  }, [scenario, step]);
  function choose(id: ScenarioId) { setScenario(id); setReview(null); setStep("intent"); }
  function restart() { setReview(null); setStep("intent"); }
  const next = (label: string, target: Step) => <button className="wk-next" onClick={() => setStep(target)}>{label}<span aria-hidden="true"> →</span></button>;
  return <div className="wk-page dg-wrap">
    <header className="wk-intro"><span className="dg-eyebrow">DDX / Design Genome workshop</span><h1>Same task. <span>More knowledge to work from.</span></h1><p>Without organizational intelligence, the system has to make reasonable guesses. With the Genome, fewer organizational decisions are guesses.</p><p className="wk-note">Explore the same task with different amounts of organizational knowledge.</p></header>
    <div ref={chooser} tabIndex={-1} className="wk-chooser" role="group" aria-label="Choose a task">{(Object.keys(scenarios) as ScenarioId[]).map(id => <button key={id} aria-pressed={scenario === id} onClick={() => choose(id)}><span className="wk-kicker">{scenarios[id].theme}</span><strong>{scenarios[id].name}</strong><span>{scenarios[id].description}</span><span className="wk-choice-mark" aria-hidden="true">{scenario === id ? "Selected" : "Explore →"}</span></button>)}</div>
    <ol className="wk-progress" aria-label="Workshop stages">{["Intent", "Intelligence", "Inheritance"].map((name, index) => <li key={name} aria-current={stage === index + 1 ? "step" : undefined}><span>0{index + 1}</span> {name}{index < 2 && <span className="wk-arrow" aria-hidden="true">→</span>}</li>)}</ol>
    <section className="wk-stage" aria-labelledby="wk-stage-title" key={`${scenario}:${step}`}>
      <div className="wk-stage-heading"><div><span className="dg-eyebrow">0{stage} / {current.theme}</span><h2 id="wk-stage-title" ref={heading} tabIndex={-1}>{titles[step]}</h2></div><div className="wk-stage-tools"><button className="wk-reset" onClick={() => { chooser.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus({ preventScroll: true }); chooser.current?.scrollIntoView({ block: "start", behavior: "instant" }); }}>Change task</button>{step !== "intent" && <button className="wk-reset" onClick={restart}>Start again</button>}</div></div>
      <div className="wk-prompt"><span className="wk-kicker">{step === "intent" ? "Your task" : "Same task"}</span><p>{current.task}</p>{scenario === "analytics" && <p className="wk-note">Shared values: 1,284 shipments · 96.8% delivery success · 2.4 days average delivery · 17 exceptions</p>}<span className="wk-context-state">{["knowledge", "informed", "inheritance", "reflection"].includes(step) ? "+ Organizational intelligence supplied" : "Task + available Forma components"}</span></div>
      <p className="wk-sandbox-note">Workshop sandbox · Actions do not create or delete real data.</p>
      {step === "intent" && <><p className="wk-lead">Start with the task and the available components. Inspect the result, then supply relevant organizational knowledge.</p><div className="wk-actions">{next("Generate result", "baseline")}</div></>}
      {step === "baseline" && <>
        <div className="wk-result-heading"><span className="wk-kicker">Without supplied Genome knowledge</span><span>Inspect and try the result</span></div><div className="wk-single"><Result scenario={scenario} baseline /></div>
        <p className="wk-lesson">A plausible result still contains local decisions.</p><p className="wk-lead">The existing components already carry design decisions. Without additional organizational guidance, the implementation still chooses how to compose them, explain the task and handle feedback.</p>
        <div className="wk-actions">{next("Supply Design Genome", "knowledge")}</div>
      </>}
      {step === "knowledge" && <>
        <div className="wk-transfer"><span>Same task</span><b aria-hidden="true">+</b><span>Organizational intelligence</span><b aria-hidden="true">→</b><span>More decisions with a source</span></div>
        <p className="wk-lead">The request stays the same. These are excerpts from the relevant Forma knowledge supplied to the creation environment.</p>
        {scenario === "analytics" && <p className="wk-boundary">Explicit selection, not an analytics pattern. Card, Stack, typography, principles, content and rules were selected individually.</p>}
        <div className="wk-knowledge-grid">{current.knowledge.map(id => { const item = context.guidance.find(item => item.id === id)!; return <div key={id}><span className="wk-kicker">{item.level ?? "Authored guidance"} · {item.status}</span><h3>{item.title}</h3><p>{item.summary}</p></div>; })}</div>
        {scenario === "analytics" && <details className="wk-evidence"><summary>Why these sources?</summary><p>Caller-curated roots. Selection does not create semantic relationships between them.</p><ul>{data.analytics.roots.map(root => <li key={root.id}><code>{root.id}</code></li>)}</ul></details>}
        <Evidence context={context} label="Inspect supplied knowledge and provenance" /><div className="wk-actions">{next("Generate with Genome", "informed")}<button className="wk-reset" onClick={() => setStep("baseline")}>Back to result</button></div>
      </>}
      {step === "informed" && <>
        <div className="wk-result-heading"><span className="wk-kicker">With Design Genome</span><span>Same request. Additional context.</span></div>
        <div className="wk-inherited"><Result scenario={scenario} /><Traces scenario={scenario} context={context} /></div>
        <details className="wk-evidence"><summary>Compare without supplied Genome knowledge</summary><div className="wk-single"><Result scenario={scenario} baseline /></div></details>
        <div className="wk-breakdown">{[["Carried forward", current.carried], ["Already reasonable", current.shared], [scenario === "analytics" ? "Still invented locally" : "Still implementation judgment", current.local]].map(([label, explanation]) => <details key={label}><summary>{label}</summary><p>{explanation}</p></details>)}</div>
        <div className="wk-actions">{next(scenario === "delete" ? "Make a review decision" : "Explore the boundary", "inheritance")}<button className="wk-reset" onClick={() => setStep("knowledge")}>Revisit supplied knowledge</button></div>
      </>}
      {step === "inheritance" && <>
        {scenario === "delete" ? <>
          <p className="wk-lead">Make a provisional review decision for this exercise. It does not edit the Forma Genome.</p>
          <fieldset ref={reviewGroup} className="wk-review"><legend>Does this scenario warrant additional entry before deletion?</legend><label><input type="radio" name="review" checked={review === "no"} onChange={() => setReview("no")} />No — explanation and explicit action are enough for this exercise</label><label><input type="radio" name="review" checked={review === "yes"} onChange={() => setReview("yes")} />Yes — try an additional entry step</label></fieldset>
          <p className="wk-review-result" aria-live="polite">{review === null ? "Choose an option, then try the resulting flow." : review === "yes" ? "Your decision made Input knowledge relevant. Try entering the project name below." : "Input remains conditional and inactive. Try the action or cancel."}</p>
          {review && <><div className="wk-inherited"><DeletePreview key={review} additionalEntry={review === "yes"} /><div><h3>What changed—and why</h3><dl><dt>Your judgment</dt><dd>{review === "yes" ? "You chose additional entry for this scenario." : "You chose to proceed without additional entry."} This is provisional human review.</dd><dt>Genome knowledge</dt><dd>{review === "yes" ? "The authored conditional Input relationship is relevant now. Its separately resolved contract and guidance are supplied." : "Input stays inactive. Consequence explanation, explicit action and cancellation remain."}</dd><dt>Implementation choice</dt><dd>Matching the project name exactly is this exercise’s chosen mechanism—not a Forma-wide requirement.</dd></dl>{review === "yes" && <Evidence context={data.additionalEntry.context} label="Inspect the conditional Input context" />}<p className="wk-note">Additional friction does not prove safety or accessibility.</p></div></div><button className="wk-reset" onClick={() => { setReview(null); reviewGroup.current?.querySelector<HTMLInputElement>("input")?.focus(); }}>Reset review decision</button></>}
        </> : <><div className="wk-takeaway"><h3>{scenario === "analytics" ? "The Genome can’t carry forward knowledge your organization never put into it." : "A component contract is not a complete product decision."}</h3><p>{scenario === "analytics" ? "Forma has no analytics or dashboard pattern. The foundations travel; the dashboard composition still needs to be designed." : "The Form pattern connects the pieces. It does not choose your validation policy, exact layout or success experience."}</p></div><p className="wk-lead">{current.review}</p><details className="wk-evidence"><summary>What can be checked—and what needs review?</summary><p>Component implementations reject unsupported properties and enum values. Input associates its label and descriptions; Stack restricts gap values. Those are bounded checks, not proof that this composition is usable or accessible.</p><p>{current.local}</p></details></>}
        <div className="wk-actions">{(scenario !== "delete" || review !== null) && next("Reflect on the exercise", "reflection")}<button className="wk-reset" onClick={() => setStep("informed")}>Back to informed result</button></div>
      </>}
      {step === "reflection" && <><p className="wk-kicker">Exercise complete</p><ol className="wk-reflection-questions"><li>What was inherited?</li><li>What did the implementation still have to decide?</li><li>What would you review before shipping?</li></ol><div className="wk-takeaway"><h3>The model is not the source of organizational design authority.</h3><p>The Genome carries authored organizational knowledge into the creation environment. People still implement, review and decide.</p></div><p className="wk-lesson">The Genome can’t carry forward knowledge your organization never put into it.</p><details className="wk-evidence"><summary>What this exercise can—and cannot—show</summary><p>Traceability makes organizational guidance inspectable. It does not establish compliance. A visual difference alone does not establish its cause or prove better model performance.</p></details><div className="wk-actions">{(Object.keys(scenarios) as ScenarioId[]).filter(id => id !== scenario).map(id => <button className="wk-next" key={id} onClick={() => choose(id)}>Try {scenarios[id].name.toLowerCase()} →</button>)}<button className="wk-reset" onClick={restart}>Restart this task</button></div><details className="wk-evidence"><summary>Build provenance</summary><p className="wk-hash">Compiled Genome SHA-256: {data.compiledSha256}</p><p>Resolved at build time from canonical sources. All three scenarios use the same compiled snapshot. Selection is explicit; no natural-language routing occurs.</p><Evidence context={context} label="Inspect this task’s sources" /></details></>}
    </section>
  </div>;
}
