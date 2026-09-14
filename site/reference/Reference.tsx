import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Icon } from "../Icon";
import { data, domains, entityById, entityPath, github, sourceLink, tokenPath, type ReferenceEntity } from "./data";
import { Guidance } from "./Guidance";
import { Examples } from "./Examples";
import { Geometry, TokenViews } from "./Foundations";
import "./reference.css";

function Meta({ entity }: { entity?: ReferenceEntity }) {
  return <div className="ref-meta"><span><i />{entity?.status ?? data.genome.status}</span><span>Genome v{data.genome.version}</span><span>{entity?.owner ?? data.genome.owner}</span></div>;
}
function Intro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <header className="ref-intro"><span className="ref-eyebrow">{eyebrow}</span><h1>{title}</h1>{children}</header>;
}
function EntityIndex({ domain }: { domain: string }) {
  const entries = data.entities.filter(e => e.domain === domain);
  return <div className="ref-entity-index">{entries.map((e,i) => <Link key={e.id} to={entityPath(e)}><span className="ref-index-number">{String(i+1).padStart(2,"0")}</span><div><strong>{e.title}</strong><code>{e.id}</code></div><span className="ref-index-status">{e.status}</span><Icon /></Link>)}</div>;
}
function Overview() {
  return <>
    <Intro eyebrow="Reference / Forma" title="A Genome you can inspect."><p className="ref-lead">Forma connects design guidance, governed contracts, and working code in one browsable reference.</p><Meta /></Intro>
    <div className="ref-overview-context"><div><span className="ref-eyebrow">THE REFERENCE ORGANIZATION</span><h2>Clear. Calm. Precise.</h2><p>Forma is a fictional collaborative workflow-management product. Its design knowledge is real and inspectable; the organization and product are illustrative.</p></div><div className="ref-scope"><div><strong>{data.entities.length}</strong><span>registered entities</span></div><div><strong>{data.relationships.length}</strong><span>explicit connections</span></div><div><strong>{data.contracts.length}</strong><span>working components</span></div></div></div>
    <section className="ref-section"><div className="ref-section-heading"><h2>Browse the Genome</h2><span>Guidance first. Structure when you need it.</span></div><div className="ref-domain-list">{domains.map((d,i) => <Link key={d.slug} to={`/reference/${d.slug}`}><span className="ref-index-number">0{i+1}</span><div><h3>{d.name}</h3><p>{d.description}</p></div><span>{data.entities.filter(e=>e.domain===d.slug).length}</span><Icon /></Link>)}</div></section>
    <section className="ref-connected-start"><span className="ref-eyebrow">FOLLOW ONE CONNECTION</span><h2>A pattern carries more than a layout.</h2><p>Inspect Destructive Action, follow its explicit-label rule, and see how a component contract carries the decision into code.</p><div><Link to="/reference/patterns/destructive-action">Destructive Action</Link><Icon /><Link to="/reference/rules/explicit-action-labels">Explicit action labels</Link><Icon /><Link to="/reference/components/button">Button</Link></div><p className="ref-caption">An editorial reading path. Encoded relationships are identified separately on each detail.</p></section>
    <div className="ref-overview-paths"><Link to="/reference/machine-context"><span className="ref-eyebrow">STRUCTURED</span><h2>Inspect machine context <Icon /></h2><p>See what the compiler and resolver actually supply.</p></Link><a href="/reference/forma/"><span className="ref-eyebrow">EXECUTABLE</span><h2>Open Forma showcase <Icon /></h2><p>Explore the original components in their own visual identity.</p></a></div>
    <aside className="ref-boundary"><strong>Availability is not approval.</strong><p>All current entities remain draft. This is a representative v0.1 slice, not a complete product system. Source integrity and working examples do not certify design judgment or accessibility.</p><Link to="/reference/governance">Inspect governance →</Link></aside>
  </>;
}
function Domain({ slug }: { slug: string }) {
  const domain = domains.find(d=>d.slug===slug)!;
  return <><Intro eyebrow="Forma / Domain" title={domain.name}><p className="ref-lead">{domain.description}</p><Meta /></Intro>
    {slug === "foundations" && <p className="ref-domain-note">Forma’s semantic tokens define its distinct visual identity: Inter, restrained slate neutrals, and indigo actions. Browse the authored roles, inspect their resolved values, and follow them into components.</p>}
    {slug === "components" && <p className="ref-domain-note">Each detail pairs human guidance with the actual contract and a curated live example. The APIs are deliberately closed; contextual design decisions still require review.</p>}
    {slug === "patterns" && <p className="ref-domain-note">Patterns explain when knowledge belongs together. They do not supply a universal workflow, a confirmation requirement, or an automated product decision.</p>}
    {slug === "content" && <p className="ref-domain-note">The current content slice covers voice and action labels. It does not claim a complete content-design system.</p>}
    {slug === "rules" && <div className="ref-boundary"><strong>Classification is not a delivered checker.</strong><p>Levels and validation modes below are authored metadata. Every current checker is null. Wording and review rationale remain in the linked guidance.</p></div>}
    {slug === "governance" && <div className="ref-boundary"><strong>Availability is not approval.</strong><p>Draft, active, and deprecated describe review status. Executable availability is separate. The Genome version applies across this reference; individual IDs do not encode independent versions.</p></div>}
    {slug === "rules" ? <div className="ref-rules-index">{data.rules.map(rule=><Link key={rule.id} to={entityPath(entityById(rule.id))}><span>{rule.level}</span><div><strong>{entityById(rule.id).title}</strong><small>{rule.validation.mode} · no checker</small></div><Icon /></Link>)}</div> : <EntityIndex domain={slug} />}
    {slug === "foundations" && <Geometry />}
    {slug === "governance" && <section className="ref-section"><h2>Connected authority, distinct responsibilities.</h2><div className="ref-authority-roles"><div><h3>Guidance</h3><p>Markdown owns why and when.</p></div><div><h3>Contracts</h3><p>Structured records own their deterministic surface.</p></div><div><h3>Implementation</h3><p>Executable sources own actual behavior.</p></div><div><h3>Registry</h3><p>Discovery and semantic connections.</p></div></div><Link className="dg-text-link" to="/reference/machine-context">Follow the compiled representation <Icon /></Link></section>}
  </>;
}
function Relationships({ entity }: { entity: ReferenceEntity }) {
  const edges = data.relationships.filter(e=>e.from===entity.id || e.to===entity.id);
  return <section id="relationships" className="ref-section"><div className="ref-section-heading"><h2>Relationships</h2><span>{edges.length} encoded connections · direction preserved</span></div>
    <p className="ref-caption">Read each row in its authored direction. Dashed associations are conditional, not required dependencies.</p>
    <div className="ref-relationships">{edges.map((edge,i)=>{
      const incoming = edge.to === entity.id, other = entityById(incoming ? edge.from : edge.to);
      return <Link key={i} to={entityPath(other)} className="ref-relationship" data-conditional={edge.relation==="related-to"}>
        <span className="ref-relation-direction">{incoming ? "Incoming" : "Outgoing"}<span aria-hidden="true">{incoming ? "←" : "→"}</span></span>
        <div><span className="ref-relation-sentence">{incoming ? other.title : entity.title} <b>{edge.relation}</b> {incoming ? entity.title : other.title}</span><span className="ref-caption">{other.domain} / {other.id}</span>{"note" in edge && <p>{edge.note}</p>}</div><Icon />
      </Link>;
    })}</div>{!edges.length && <p className="ref-caption">No semantic edges are encoded for this entity. Source references below are provenance, not inferred relationships.</p>}
  </section>;
}
function Contract({ entity }: { entity: ReferenceEntity }) {
  const contract = data.contracts.find(c=>c.id===entity.id)!;
  return <section id="contract" className="ref-section"><div className="ref-section-heading"><h2>Governed contract</h2><span>Read directly from the component contract</span></div>
    <div className="ref-contract-summary"><div><span>Variants</span><p>{contract.variants.length ? contract.variants.join(" · ") : "No variant API"}</p></div><div><span>States</span><p>{contract.states.join(" · ")}</p></div></div>
    <h3 className="ref-subheading">API & defaults</h3><div className="ref-table-wrap"><table><thead><tr><th>Prop</th><th>Type / allowed values</th><th>Default / required</th></tr></thead><tbody>{Object.entries(contract.api).map(([name, prop])=><tr key={name}><td><code>{name}</code></td><td>{prop.type}{"values" in prop && <small>{prop.values.join(" · ")}</small>}</td><td>{"default" in prop ? String(prop.default) : "required" in prop && prop.required ? "Required" : "—"}</td></tr>)}</tbody></table></div>
    <p className="ref-caption">Unsupported props: {contract.unsupportedProps.join(", ")}. No arbitrary styling hooks.</p>
    <details className="ref-disclosure"><summary>Semantics & accessibility responsibilities</summary><dl className="ref-record-list">{Object.entries(contract.semantics).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{Array.isArray(value) ? value.join(" → ") : value}</dd></div>)}</dl><h3>Deterministic responsibilities</h3><ul>{contract.accessibility.deterministic.map(t=><li key={t}>{t}</li>)}</ul><p>Human review remains in the <a href="#guidance">authored guidance</a>. These requirements do not certify a composition.</p></details>
    <details className="ref-disclosure"><summary>Token roles · {Object.keys(contract.tokenRoles).length} mappings</summary><dl className="ref-record-list">{Object.entries(contract.tokenRoles).map(([role, paths])=><div key={role}><dt><code>{role}</code></dt><dd>{(typeof paths === "string" ? [paths] : paths).map((path: string)=><Link key={path} to={tokenPath(path)}>{path}</Link>)}</dd></div>)}</dl></details>
    <details className="ref-disclosure"><summary>Inspect complete structured contract</summary><pre tabIndex={0} aria-label="Structured data"><code>{JSON.stringify(contract,null,2)}</code></pre></details>
    <Link className="dg-text-link" to="/reference/machine-context">How this reaches a consumer <Icon /></Link>
  </section>;
}
function Provenance({ entity }: { entity: ReferenceEntity }) {
  return <section id="source" className="ref-section ref-provenance"><h2>Source & provenance</h2><p className="ref-caption">Guidance is reproduced from its registered source. Structured values are a validated build-time projection; authored authority remains upstream.</p><dl className="ref-record-list">{Object.entries({...entity.authority, ...(entity.guidanceRef ? {guidance:entity.guidanceRef} : {})}).map(([role,ref])=><div key={role}><dt>{role}</dt><dd><a href={sourceLink(ref)}>{ref} ↗</a></dd></div>)}</dl><details className="ref-disclosure"><summary>Inspect registry record & source hashes</summary><pre tabIndex={0} aria-label="Structured data"><code>{JSON.stringify({id:entity.id,status:entity.status,owner:entity.owner,authority:entity.authority,sources:Object.fromEntries(Object.values({...entity.authority,...(entity.guidanceRef ? {guidance:entity.guidanceRef} : {})}).map(ref=>{const path=new URL("genome/"+ref,github).href.slice(github.length).split("#")[0];return [path,data.sources[path]];}))},null,2)}</code></pre></details></section>;
}
function Detail({ entity }: { entity: ReferenceEntity }) {
  const rule = data.rules.find(r=>r.id===entity.id), exception = data.exceptions.find(e=>e.id===entity.id);
  return <>
    <Intro eyebrow={`Forma / ${entity.domain}`} title={entity.title}><code className="ref-stable-id">{entity.id}</code><Meta entity={entity} /></Intro>
    <nav className="ref-page-nav" aria-label="On this entity">{entity.guidance && <a href="#guidance">Guidance</a>}{entity.domain==="components" && <><a href="#executable">Executable</a><a href="#contract">Contract</a></>}{entity.domain==="foundations" && <a href="#values">Values</a>}<a href="#relationships">Relationships</a><a href="#source">Source</a></nav>
    {entity.guidance && <section id="guidance" className="ref-section ref-guidance"><div className="ref-section-heading"><h2>Guidance</h2><span>Authored source excerpt</span></div><Guidance text={entity.guidance} source={entity.source!} /></section>}
    {entity.domain==="components" && <><Examples key={entity.id} name={entity.slug} /><Contract entity={entity} /></>}
    {entity.domain==="foundations" && <TokenViews group={entity.slug} />}
    {rule && <section className="ref-section"><h2>Rule metadata</h2><dl className="ref-record-list"><div><dt>Level</dt><dd>{rule.level}</dd></div><div><dt>Validation classification</dt><dd>{rule.validation.mode}</dd></div><div><dt>Checker</dt><dd>None implemented (null)</dd></div></dl><p className="ref-caption">Scope and rationale are defined by the wording above. Registry connections show encoded applicability; they are not a complete compliance boundary.</p><details className="ref-disclosure"><summary>Inspect structured rule</summary><pre tabIndex={0} aria-label="Structured data"><code>{JSON.stringify(rule,null,2)}</code></pre></details></section>}
    {exception && <section className="ref-section"><div className="ref-boundary"><strong>Draft example. No live approval.</strong><p>The stable ID retains its original name. Its current scope is an externally controlled embedded workflow.</p></div><dl className="ref-record-list"><div><dt>Referenced rule</dt><dd><Link to={entityPath(entityById(exception.ruleId))}>{entityById(exception.ruleId).title}</Link></dd></div>{(["reason","scope","review"] as const).map(k=><div key={k}><dt>{k}</dt><dd>{exception[k]}</dd></div>)}</dl><details className="ref-disclosure"><summary>Inspect exception record</summary><pre tabIndex={0} aria-label="Structured data"><code>{JSON.stringify(exception,null,2)}</code></pre></details></section>}
    <Relationships entity={entity} /><Provenance entity={entity} />
  </>;
}
function Machine() {
  return <>
    <Intro eyebrow="Forma / Machine context" title="Knowledge supplied. Authority retained."><p className="ref-lead">The same authored system can be read by people and resolved into scoped context for a consumer.</p><Meta /></Intro>
    <div className="ref-machine-flow">{[["Authored Genome","Guidance, contracts, tokens, and governance."],["Compiler","Validates source integrity; preserves records and prose."],["Compiled Genome","A generated snapshot with source provenance."],["Resolver / consumer","Follows an explicit seed and encoded relationships."],["Supplied context","Relevant guidance, constraints, and conditional context."],["Implementation","Separate work requiring judgment, reuse, and review."]].map(([title,description],i)=><div key={title}><span>0{i+1}</span><div><h2>{title}</h2><p>{description}</p></div>{i<5 && <Icon />}</div>)}</div>
    <section className="ref-section"><div className="ref-section-heading"><h2>Inspect one real resolution</h2><span>Approved resolver · build-time result</span></div><p>The caller explicitly selects Destructive Action. The resolver does not infer this selection from a free-text request.</p><div className="ref-seed"><span className="ref-eyebrow">EXPLICIT SEED</span><Link to="/reference/patterns/destructive-action"><code>{data.machine.seed}</code> <Icon /></Link></div><p className="ref-caption">{data.machine.policy}</p>
    <div className="ref-machine-results"><div><h3>Selected component contracts</h3>{data.machine.contracts.map(id=><Link key={id} to={entityPath(entityById(id))}>{entityById(id).title}<Icon /></Link>)}</div><div><h3>Conditional context</h3>{data.machine.conditional.map(({edge})=><div key={edge.to}><Link to={entityPath(entityById(edge.to))}>{entityById(edge.to).title}<Icon /></Link><p>{"note" in edge ? edge.note : "Conditional association."}</p></div>)}</div></div>
    <details className="ref-disclosure"><summary>Resolved entities · {data.machine.entities.length}</summary><div className="ref-compact-links">{data.machine.entities.map(id=><Link key={id} to={entityPath(entityById(id))}>{entityById(id).title}<code>{id}</code></Link>)}</div></details>
    <details className="ref-disclosure"><summary>Original rule levels and checker availability</summary><pre tabIndex={0} aria-label="Structured data"><code>{JSON.stringify(data.machine.rules,null,2)}</code></pre></details>
    <details className="ref-disclosure"><summary>Referenced exception · review context only</summary><p>The external-workflow exception does not waive labels for project deletion.</p><Link to={entityPath(entityById(data.exceptions[0].id))}>Inspect reason, scope, and review conditions →</Link></details></section>
    <section className="ref-technical"><span className="ref-eyebrow">CURATED CONTRACT EXCERPT</span><h2>A structured decision, with its identity intact.</h2><pre tabIndex={0} aria-label="Structured data"><code>{JSON.stringify(data.machine.example,null,2)}</code></pre><p>An excerpt from the actual Button contract. The full API remains available on its detail page.</p><Link to="/reference/components/button#contract">Open Button contract →</Link></section>
    <section id="relationships" className="ref-section"><h2>Inspect the compiled representation</h2><p>The compiler preserves directional relationships, contracts, rule levels, draft status, and provenance. It does not normalize prose into new requirements or prove that an implementation follows them.</p><details className="ref-disclosure"><summary>Generated metadata & destructive-action relationships</summary><pre tabIndex={0} aria-label="Structured data"><code>{data.compiledExcerpt}</code></pre></details><div className="ref-source-links"><a href={github+"docs/compiled-genome.md"}>Compiler architecture ↗</a><a href={github+"scripts/query-genome.ts"}>Query implementation ↗</a><a href={github+"adapters/codex/README.md"}>Codex consumer & invocation ↗</a></div></section>
    <aside className="ref-boundary"><strong>Supplied context does not certify the result.</strong><p>Tools do not become design authorities. Product consequences, exception applicability, accessibility, and UX quality remain matters for implementation and human review.</p><Link to="/framework">Return to the Framework →</Link></aside>
  </>;
}
export default function Reference() {
  const location=useLocation(), path=location.pathname.replace(/\/$/,"").split("/").slice(2);
  const domain=domains.find(d=>d.slug===path[0]);
  const entity=path.length===2 ? data.entities.find(e=>e.domain===path[0]&&e.slug===path[1]) : undefined;
  const [navOpen,setNavOpen]=useState(false);
  const trigger=useRef<HTMLButtonElement>(null);
  const valid=!path.length || (path.length===1 && (!!domain || path[0]==="machine-context")) || !!entity;
  const title=entity?.title ?? domain?.name ?? (path[0]==="machine-context" ? "Machine context" : !path.length ? "Overview" : "Page not found");
  useEffect(()=>{
    setNavOpen(false);
    // Shared shell updates first; apply the entity-specific title after its effect.
    const frame=requestAnimationFrame(()=>{
      document.title=`${title} — Forma Reference — Design Genome`;
      if(location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
    });
    return ()=>cancelAnimationFrame(frame);
  },[location.pathname,location.hash,title]);
  return <div className="ref-shell dg-wrap">
    <aside className="ref-rail" onKeyDown={e=>{if(e.key==="Escape"){setNavOpen(false);trigger.current?.focus();}}}>
      <Link className="ref-brand" to="/reference"><span>forma<span>.</span></span><small>DESIGN GENOME REFERENCE</small></Link>
      <button ref={trigger} className="ref-nav-toggle" aria-expanded={navOpen} aria-controls="reference-navigation" onClick={()=>setNavOpen(!navOpen)}>Browse Reference <Icon name={navOpen?"close":"menu"}/></button>
      <nav id="reference-navigation" aria-label="Reference navigation" data-open={navOpen}><NavLink end to="/reference">Overview</NavLink><span className="ref-nav-label">GENOME DOMAINS</span>{domains.map(d=><NavLink key={d.slug} to={`/reference/${d.slug}`}>{d.name}<span>{data.entities.filter(e=>e.domain===d.slug).length}</span></NavLink>)}<span className="ref-nav-label">INSPECT & USE</span><NavLink to="/reference/machine-context">Machine context</NavLink><a href="/reference/forma/">Forma showcase <Icon name="external"/></a><Link to="/framework">Framework <Icon /></Link></nav>
      <div className="ref-rail-status"><span className="dg-point"/>v{data.genome.version} · {data.genome.status}</div>
    </aside>
    <div className="ref-content">
      <nav className="ref-breadcrumbs" aria-label="Breadcrumb"><Link to="/reference">Reference</Link>{domain && <><span>/</span>{entity ? <Link to={`/reference/${domain.slug}`}>{domain.name}</Link>:<span aria-current="page">{domain.name}</span>}</>}{entity && <><span>/</span><span aria-current="page">{entity.title}</span></>}{path[0]==="machine-context"&&<><span>/</span><span aria-current="page">Machine context</span></>}</nav>
      {!valid ? <Intro eyebrow="Reference / 404" title="This entity is not in the reference."><Link className="dg-text-link" to="/reference">Browse the current Genome →</Link></Intro> : entity ? <Detail key={entity.id} entity={entity}/> : domain ? <Domain key={domain.slug} slug={domain.slug}/> : path[0]==="machine-context" ? <Machine/> : <Overview/>}
      <footer className="ref-local-footer"><span>Forma is fictional. Its sources are inspectable.</span><a href={github+"genome/README.md"}>Open authored Genome ↗</a></footer>
    </div>
  </div>;
}
