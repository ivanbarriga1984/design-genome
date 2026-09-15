import { useEffect, useRef, useState } from "react";
import { Button } from "./components/Button.tsx";
import { Input } from "./components/Input.tsx";
import { Card } from "./components/Card.tsx";
import { Stack } from "./components/Stack.tsx";
import { buttonContract, inputContract, stackContract } from "./components/contract.ts";

// Tabler plus and arrow-right SVGs, MIT; see tabler-icons.LICENSE.
const workflow = [
  { tone: "information", stage: "Plan", title: "Project brief", detail: "3 tasks" },
  { tone: "warning", stage: "Review", title: "Design review", detail: "2 awaiting" },
  { tone: "success", stage: "Complete", title: "Launch checklist", detail: "12 of 12 complete" },
];

export function Showcase() {
  const [active, setActive] = useState(() => window.location.hash.slice(1) || "buttons");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState({ name: "", url: "" });
  const [status, setStatus] = useState("");
  const [activity, setActivity] = useState("Ready to inspect. Actions affect this demo only.");
  const [draftVisible, setDraftVisible] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const submitting = useRef(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    let frame = 0;
    const nav = navRef.current!;
    const sync = () => {
      const height = nav.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--showcase-nav-height", `${height}px`);
      setStuck(nav.getBoundingClientRect().top <= 0);
      const sections = [...document.querySelectorAll<HTMLElement>("main > section")];
      // The last heading to cross below the sticky nav owns the active state.
      // A bottom-of-document fallback covers the shorter final section.
      const threshold = height + parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--forma-spacing-8") || "0");
      let current = sections[0]?.id || "buttons";
      for (const section of sections) if (section.getBoundingClientRect().top <= threshold) current = section.id;
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1) current = "composition";
      setActive(current);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(sync); };
    if (typeof requestAnimationFrame === "function") {
      sync(); window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule);
    }
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(schedule) : undefined;
    observer?.observe(nav);
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); observer?.disconnect(); if (frame) cancelAnimationFrame(frame); document.documentElement.style.removeProperty("--showcase-nav-height"); clearTimeout(timer.current); };
  }, []);
  return <>
    <header className="showcase-header">
      <div><span className="eyebrow">Forma / component reference</span><h1>Component reference</h1>
        <p>Reference components for clear, calm, precise workflows.</p></div>
      <div className="reference-meta"><span>Internal reference</span><span>Version 0.1</span></div>
    </header>
    <div ref={navRef} className="section-nav" data-stuck={stuck || undefined}><nav aria-label="Showcase sections">{[["buttons", "Button"], ["inputs", "Input"], ["cards", "Card"], ["stacks", "Stack"], ["composition", "Composition"]].map(([id, label]) =>
      <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}>{label}</a>)}</nav></div>
    <main>
      <section id="buttons" aria-labelledby="button-heading">
        <div className="section-heading"><span className="section-number">01</span><div><h2 id="button-heading">Actions with intent</h2><p>Button · A clear hierarchy for the next decision.</p></div></div>
        <div className="section-body">
          {buttonContract.api.size.values.map(size => <div className="specimen-row" key={size}>
            <div className="specimen-label"><h3>{size === "sm" ? "Small" : "Medium"}</h3><p>{size === "sm" ? "Compact actions within a workflow." : "The default for forms and decisions."}</p></div>
            <Stack direction="horizontal" align="center" wrap>
              {buttonContract.variants.map(variant => <Button key={variant} variant={variant} size={size}
                disabled={variant === "destructive" && !draftVisible}
                onClick={() => { if (variant === "destructive") { setDraftVisible(false); setActivity("Local draft removed. Reset the demo to restore it."); } else setActivity(`${variant} / ${size} activated.`); }}>
                {variant === "destructive" ? "Delete draft" : variant === "primary" ? "Create project" : variant === "secondary" ? "Save draft" : "View details"}
              </Button>)}
            </Stack>
          </div>)}
          <div className="specimen-row">
            <div className="specimen-label"><h3>State & feedback</h3><p>Unavailable, in progress, and named icon actions.</p></div>
            <Stack direction="horizontal" align="start" gap="spacing.6" wrap>
              <Stack gap="spacing.2"><Button disabled>Create project</Button><span className="note">Disabled</span></Stack>
              <Stack gap="spacing.2"><Button loading aria-describedby="loading-description">Create project</Button><span id="loading-description" className="note">Loading · label retained</span></Stack>
              <Stack gap="spacing.2"><Button variant="secondary" iconOnly aria-label="Add project" onClick={() => setActivity("Add project activated.")}><svg className="forma-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg></Button><span className="note">Icon-only</span></Stack>
            </Stack>
          </div>
          <div className="demo-feedback"><p className="note" role="status">{activity}</p><Button variant="ghost" size="sm" onClick={() => { setDraftVisible(true); setActivity("Demo reset."); }}>Reset demo</Button></div>
          <p className="reference-note">Hover to inspect feedback. Use Tab to review the governed focus ring.</p>
        </div>
      </section>
      <section id="inputs" aria-labelledby="input-heading">
        <div className="section-heading"><span className="section-number">02</span><div><h2 id="input-heading">Clarity at the point of entry</h2><p>Input · Visible labels, useful guidance, restrained feedback.</p></div></div>
        <div className="section-body"><div className="specimen-grid input-examples">
          <Input label="Project name" placeholder="e.g. Quarterly planning" helperText="Choose a name your team will recognize." />
          <Input label="Workspace name" defaultValue="Design Operations" disabled helperText="Managed by your workspace administrator." />
          <Input label="Project URL" type="url" defaultValue="not-a-url" helperText="Use the full project address." errorMessage="Enter a URL beginning with https://." />
          <Input label="Reference code" invalid helperText="Explicit invalid state, without an error message." />
        </div>
        <details><summary>Reference: all supported input types</summary><div className="specimen-grid">
          {inputContract.api.type.values.map(type => <Input key={type} label={`${type.charAt(0).toUpperCase()}${type.slice(1)} input`} type={type} />)}
        </div></details></div>
      </section>
      <section id="cards" aria-labelledby="card-heading">
        <div className="section-heading"><span className="section-number">03</span><div><h2 id="card-heading">A surface with a purpose</h2><p>Card · Group related information. Make the destination clear.</p></div></div>
        <div className="section-body"><div className="specimen-grid">
          <div className="specimen"><h3 className="specimen-caption">Static / workspace context</h3><Card><Stack gap="spacing.4">
            <span className="eyebrow">Workspace</span><div><h3>Design Operations</h3><p className="supporting">A shared place for project briefs, reviews, and release checklists.</p></div>
            <div className="card-facts"><span>Project visibility</span><span>Workspace members</span></div>
          </Stack></Card></div>
          <div className="specimen"><h3 className="specimen-caption">Linked / one destination</h3><Card mode="link" href="#composition">
            <span className="eyebrow">Project setup</span><h3>From brief to shared workflow</h3><p className="supporting">Name the project, connect its source, and place it in the right workspace.</p><span className="link-hint">Review project creation <svg className="forma-icon link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" /></svg></span>
          </Card></div>
        </div></div>
      </section>
      <section id="stacks" aria-labelledby="stack-heading">
        <div className="section-heading"><span className="section-number">04</span><div><h2 id="stack-heading">Order without excess</h2><p>Stack · The same governed spacing, in the context of real work.</p></div></div>
        <div className="section-body">
          <div className="workflow-example"><div className="specimen-label"><h3>Across a workflow</h3><p>Horizontal · spacing.6 · wrapping</p></div>
            <Stack direction="horizontal" gap="spacing.6" wrap>{workflow.map(item => <div className="workflow-fragment" key={item.stage}><span className="eyebrow">{item.stage}</span><h3>{item.title}</h3><span className="workflow-status" data-tone={item.tone}>{item.detail}</span></div>)}</Stack>
          </div>
          <div className="workflow-example"><div className="specimen-label"><h3>Within a project</h3><p>Vertical · spacing.4 · aligned metadata</p></div>
            <Stack gap="spacing.4">{workflow.map(item => <div className="workflow-line" key={item.stage}><Stack direction="horizontal" justify="between" align="baseline" wrap><div><h3>{item.title}</h3><span className="note">{item.stage}</span></div><span className="workflow-status" data-tone={item.tone}>{item.detail}</span></Stack></div>)}</Stack>
          </div>
          <details><summary>Reference: governed gaps and alignment controls</summary>
            {stackContract.api.gap.values.map(gap => <div className="specimen" key={gap}><h3 className="specimen-caption">{gap}</h3><Stack direction="horizontal" gap={gap} wrap><span className="workflow-term">Brief</span><span className="workflow-term">Review</span><span className="workflow-term">Release</span></Stack></div>)}
            <div className="specimen-grid">{stackContract.api.align.values.map(align => <div className="specimen" key={align}><h3 className="specimen-caption">Align: {align}</h3><Stack direction="horizontal" align={align}><span className="workflow-term">Project brief</span><span className="workflow-term">Design review<br />2 awaiting</span></Stack></div>)}</div>
            {stackContract.api.justify.values.map(justify => <div className="specimen" key={justify}><h3 className="specimen-caption">Justify: {justify}</h3><Stack direction="horizontal" justify={justify}><span className="workflow-term">Project brief</span><span className="workflow-term">3 tasks</span></Stack></div>)}
          </details>
        </div>
      </section>
      <section id="composition" aria-labelledby="composition-heading">
        <div className="section-heading"><span className="section-number">05</span><div><h2 id="composition-heading">Together in a workflow</h2><p>Composition · Button, Input, Card, and Stack, inheriting the same decisions.</p></div></div>
        <div className="section-body composition-layout">
          <form noValidate onSubmit={event => {
            event.preventDefault(); if (submitting.current) return;
            const next = { name: name.trim() ? "" : "Enter a project name.", url: "" };
            if (url.trim()) { try { const address = new URL(url.trim()); if (address.protocol !== "https:" || !address.hostname) throw new Error(); } catch { next.url = "Enter a full URL beginning with https://, or leave this optional field empty."; } }
            setErrors(next); setStatus("");
            if (next.name || next.url) { document.getElementById(next.name ? "create-project-name" : "create-project-url")?.focus(); return; }
            setBusy(true); submitting.current = true; setStatus("Creating your project in Design Operations…");
            timer.current = setTimeout(() => { setBusy(false); submitting.current = false; setStatus(`Project “${name.trim()}” created in Design Operations. This is a local preview; no data was saved.`); }, 1200);
          }}><Stack gap="spacing.6">
            <div className="form-intro"><span className="eyebrow">New project</span><h3>Create a project</h3><p className="supporting">Give the work a clear starting point. Add a name and a source your team can return to.</p></div>
            <Input id="create-project-name" label="Project name" required value={name} disabled={busy} onChange={e => setName(e.target.value)} errorMessage={errors.name} helperText="Use a specific name, such as Website accessibility review." />
            <Input id="create-project-url" label="Project URL (optional)" type="url" value={url} disabled={busy} onChange={e => setUrl(e.target.value)} errorMessage={errors.url} placeholder="https://" helperText="Link to the project brief or source document." />
            <div className="specimen"><span className="field-caption">Workspace</span><Card><Stack gap="spacing.3"><span className="eyebrow">Shared workspace</span><h3>Design Operations</h3><p className="supporting">The project will be available to workspace members. Workspace access remains unchanged.</p></Stack></Card></div>
            <Stack direction="horizontal" align="center" wrap><Button type="submit" loading={busy}>Create project</Button><Button variant="ghost" disabled={busy} onClick={() => { setName(""); setUrl(""); setErrors({ name: "", url: "" }); setStatus(""); }}>Clear form</Button></Stack>
            <p className="completion" role="status">{status || "Ready when you are. Nothing leaves this local preview."}</p>
          </Stack></form>
          <aside className="composition-note"><span className="eyebrow">Review the inheritance</span><p>One primary action. Explicit labels. Governed spacing. Feedback connected to the field that needs attention.</p><p className="note">This example runs locally. It does not create a real project or send the supplied URL anywhere.</p></aside>
        </div>
      </section>
    </main>
    <footer>Forma · Internal component reference <span>v0.1 / Interactive example</span></footer>
  </>;
}
