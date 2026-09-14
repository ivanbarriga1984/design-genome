import { Link } from "react-router";
import { data, github, tokenValue, tokenVariable } from "./data";
import { Guidance } from "./Guidance";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";

export function TokenViews({ group }: { group: string }) {
  const entries = Object.entries(data.tokens).filter(([path]) => path.startsWith(group + "."));
  return <section id="values" className="ref-section">
    <div className="ref-section-heading"><h2>Governed values</h2><span>{entries.length} tokens · derived from authored values</span></div>
    <div className={`ref-tokens ref-tokens-${group}`}>
      {entries.map(([path, token]) => <div className="ref-token" id={path.replaceAll(".", "-")} key={path}>
        <div className="ref-token-visual" aria-hidden="true">
          {group === "color" && <span className="ref-swatch" style={{ background: `var(${tokenVariable(path)})` }} />}
          {group === "typography" && <span style={{font: `var(${tokenVariable(path)})`, letterSpacing:`var(${tokenVariable(path)}-letter-spacing)`}}>Clear work. Shared purpose.</span>}
          {group === "spacing" && <span className="ref-space-bar" style={{width:`var(${tokenVariable(path)})`}} />}
          {group === "radius" && <span className="ref-radius-sample" style={{borderRadius:`var(${tokenVariable(path)})`}} />}
          {group === "shadow" && <span className="ref-shadow-sample" style={{boxShadow:`var(${tokenVariable(path)})`}}>Card surface</span>}
          {group === "motion" && <span className="ref-motion-mark">{path.includes("duration") ? "Duration" : "Easing"}</span>}
        </div>
        <div className="ref-token-info"><code>{path}</code><span className="ref-token-value">{tokenValue(path)}</span>
          {typeof token.value === "string" && <span className="ref-caption">Alias → <a href={`#${token.value.slice(1,-1).replaceAll(".", "-")}`}>{token.value.slice(1,-1)}</a></span>}
        </div>
        <a className="ref-source-token" href={github + token.source}>Source <span aria-hidden="true">↗</span></a>
      </div>)}
    </div>
    {group === "motion" && <div className="ref-motion-demo"><div className="ref-example dg-forma-preview"><Card mode="link" href="/reference/components/card"><h3>Linked Card feedback</h3><p>Hover or focus this real Card. Follow it to inspect the contract.</p></Card><Button variant="secondary">Button state feedback</Button></div><p className="ref-caption">User-triggered state feedback from the real components. Reduced-motion preferences suppress transitions; the Button detail demonstrates loading on request.</p></div>}
    {group === "typography" && <p className="ref-caption">Forma uses locally bundled Inter. The surrounding Design Genome website uses Manrope.</p>}
    <details className="ref-disclosure"><summary>Inspect authored token records</summary><pre tabIndex={0} aria-label="Structured data"><code>{JSON.stringify(Object.fromEntries(entries), null, 2)}</code></pre></details>
    <div className="ref-next-inline"><Link to="/reference/components/button">Inspect Button’s token roles →</Link></div>
  </section>;
}
export function Geometry() {
  const entries = Object.entries(data.tokens).filter(([path]) => /^(border|focus)\./.test(path));
  return <section id="geometry" className="ref-section">
    <div className="ref-section-heading"><h2>Border & focus geometry</h2><span>Supporting dimensions · not separate registry entities</span></div>
    <Guidance text={data.geometry.replace(/^## .+\n*/, "")} source="genome/foundations/README.md" />
    <dl className="ref-record-list">{entries.map(([path]) => <div key={path}><dt><a href={github + data.tokens[path].source}><code>{path}</code></a></dt><dd>{tokenValue(path)}</dd></div>)}</dl>
    <div className="ref-example dg-forma-preview"><Button variant="secondary">Focus to inspect the ring</Button></div>
  </section>;
}
