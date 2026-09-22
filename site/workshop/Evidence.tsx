import type { WorkshopData } from "./projection";
import { scenarios, type ScenarioId } from "./scenarios";
export type WorkshopContext = WorkshopData["primary"] | WorkshopData["analytics"];
function referenceLink(id: string) { return `/reference/${id.split(".")[1]}/${id.split(".").slice(2).join(".")}`; }
export function Evidence({ context, label }: { context: WorkshopContext; label: string }) {
  return <details className="wk-evidence"><summary>{label}</summary>
    <p>Authored source excerpts and derived contracts. Status and ownership are preserved; supplied context does not approve an implementation.</p>
    {context.guidance.map(item => <details key={item.id}><summary>{item.title}{item.level && ` · ${item.level}`}</summary>
      <p>{item.status} · {item.owner}</p><pre className="wk-source">{item.text}</pre>
      <a href={`https://github.com/ivanbarriga1984/design-genome/blob/main/${item.path}${item.reference.includes("#") ? `#${item.reference.split("#")[1]}` : ""}`}>Source: {item.reference}</a>
      <p className="wk-hash">Build source SHA-256: {item.sha256}</p>
    </details>)}
    <details><summary>Selected component contracts</summary>{context.contracts.map(contract => <div key={contract.id} className="wk-contract"><a href={referenceLink(contract.id)}>{contract.id}</a><p>Supported properties: {Object.keys(contract.api).join(", ")}</p><p>Human review: {contract.accessibility.humanReview}</p></div>)}</details>
    <details><summary>Authored relationships</summary><ul>{context.relationships.map(edge => <li key={`${edge.from}-${edge.relation}-${edge.to}`}><code>{edge.from}</code> → {edge.relation} → <code>{edge.to}</code></li>)}</ul></details>
    {context.exceptions.length > 0 && <details><summary>Scoped governance exceptions</summary><p>These records are not permission to deviate in this exercise.</p>{context.exceptions.map(item => <div key={item.id}><p><strong>{item.id}</strong> · {item.status} · {item.owner}</p><p>{item.scope}</p><p>{item.reason}</p><p>{item.review}</p></div>)}</details>}
  </details>;
}
export function Traces({ scenario, context }: { scenario: ScenarioId; context: WorkshopContext }) {
  return <div className="wk-traces"><h3>Trace the decision</h3>{scenarios[scenario].traces.map((trace, index) => {
    const item = context.guidance.find(item => item.id === trace.id)!;
    return <details key={trace.id}><summary><span className="wk-marker">{index + 1}</span>{trace.decision}</summary>
      <p><strong>{item.title}</strong> · {item.level ?? "Guidance"} · {item.status}</p><p>{trace.why}</p><p className="wk-source-summary">{item.summary}</p>
      <p className="wk-note">Owner: {item.owner}</p><a href={referenceLink(item.id)}>Inspect {item.title} →</a><a href={referenceLink(trace.related)}>Inspect supporting source →</a>
    </details>;
  })}<p className="wk-note">Knowledge can inform a decision, confirm a reasonable choice, or leave the judgment to a person. A trace is not a compliance certificate.</p></div>;
}
