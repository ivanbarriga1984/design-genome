import { useEffect, useId, useRef, useState } from "react";
import { Button } from "../../src/components/Button";
import { Input } from "../../src/components/Input";
import { Stack } from "../../src/components/Stack";
import { Card } from "../../src/components/Card";

const project = "Design operations";
export function DeletePreview({ additionalEntry = false, trace = false, baseline = false }: { additionalEntry?: boolean; trace?: boolean; baseline?: boolean }) {
  const [name, setName] = useState("");
  const [result, setResult] = useState("");
  const descriptionId = useId();
  const ready = !additionalEntry || name === project;
  return <div className="dg-forma-preview wk-preview">
    <span className="wk-preview-brand">forma <span>PROJECT</span></span>
    <form onSubmit={event => { event.preventDefault(); if (ready) setResult("Project deleted."); }}>
      <Stack gap="spacing.6">
        <div><h3>Delete project</h3><p id={descriptionId}>{trace && <span className="wk-marker" aria-label="Decision 1">1</span>}{baseline ? <>Are you sure you want to delete “{project}”? This action cannot be undone.</> : <>Deleting “{project}” removes this project and its tasks. It cannot be recovered in this fictional scenario.</>}</p></div>
        {additionalEntry && <Input label="Project name" value={name} onChange={event => { setName(event.target.value); setResult(""); }} helperText={`Enter ${project} exactly to enable deletion.`} required />}
        {trace && <p className="wk-preview-trace"><span className="wk-marker">2</span> Action label <span className="wk-marker">3</span> Destructive treatment</p>}
        <Stack direction="horizontal" gap="spacing.3" wrap>
          <Button type="submit" variant="destructive" aria-describedby={descriptionId} disabled={!ready || !!result}>{baseline ? "Delete" : "Delete project"}</Button>
          <Button variant="secondary" onClick={() => { setName(""); setResult("Deletion cancelled. The project is unchanged."); }}>Cancel</Button>
          {result && <Button variant="ghost" onClick={() => { setName(""); setResult(""); }}>Reset preview</Button>}
        </Stack>
        <p role="status" className="wk-feedback">{result}</p>
      </Stack>
    </form>
  </div>;
}

export function CreatePreview({ baseline = false }: { baseline?: boolean }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState({ name: "", url: "" });
  const [success, setSuccess] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const prefix = useId();
  useEffect(() => { if (success && baseline) successHeading.current?.focus(); }, [success, baseline]);
  function validate() {
    let urlError = "";
    if (url.trim()) {
      try { if (!/^https?:\/\//i.test(url.trim())) throw new Error(); const parsed = new URL(url.trim()); if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(); }
      catch { urlError = "Enter a complete URL beginning with http:// or https://."; }
    }
    const next = { name: name.trim() ? "" : "Enter a project name.", url: urlError };
    setErrors(next);
    if (next.name || next.url) {
      setSuccess(false);
      form.current?.querySelector<HTMLInputElement>(next.name ? '[name="project-name"]' : '[name="project-url"]')?.focus();
    } else setSuccess(true);
  }
  const fields = <Stack gap="spacing.6">
    {baseline && <h4>Project details</h4>}
    <Input id={`${prefix}-name`} name="project-name" label="Project name" value={name} required helperText="Choose a name your team will recognize." errorMessage={errors.name} onChange={event => { setName(event.target.value); setSuccess(false); }} />
    <Input id={`${prefix}-url`} name="project-url" type="url" label="Project URL (optional)" value={url} helperText="Add a complete http:// or https:// address, or leave this blank." errorMessage={errors.url} onChange={event => { setUrl(event.target.value); setSuccess(false); }} />
    <p className="wk-preview-note">* Required field</p>
    <div><Button type="submit">Create project{baseline && <span aria-hidden="true"> →</span>}</Button></div>
  </Stack>;
  return <div className={`dg-forma-preview wk-preview wk-create ${baseline ? "wk-create-baseline" : ""}`}>
    {baseline && <div className="wk-workspace"><strong>forma</strong><span>Workspace / Projects</span></div>}
    {baseline && success ? <Stack gap="spacing.6"><h3 tabIndex={-1} ref={successHeading}>Project created</h3><p>“{name.trim()}” is ready.</p><div><Button variant="secondary" onClick={() => { setSuccess(false); setName(""); setUrl(""); setErrors({ name: "", url: "" }); }}>Create another project</Button></div></Stack> : <>
      <div className="wk-preview-intro">{baseline && <span className="wk-preview-note">PROJECTS</span>}<h3>Create a project</h3><p>{baseline ? "Give your team a place to organize its work. Add a name and an optional project link to get started." : "Name your project and add a link if you have one."}</p></div>
      <form ref={form} noValidate onSubmit={event => { event.preventDefault(); validate(); }}>{baseline ? <Card>{fields}</Card> : fields}</form>
      <p role="status" className="wk-feedback">{success ? `“${name.trim()}” was created.` : errors.name || errors.url ? "Check the highlighted fields." : ""}</p>
    </>}
  </div>;
}

const metrics = [["Total shipments", "1,284"], ["Delivery success rate", "96.8%"], ["Average delivery time", "2.4 days"], ["Exceptions requiring attention", "17"]] as const;
export function AnalyticsPreview({ baseline = false }: { baseline?: boolean }) {
  const reportId = useId();
  const [report, setReport] = useState(false);
  const reportHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (report) reportHeading.current?.focus(); }, [report]);
  return <div className={`dg-forma-preview wk-preview wk-analytics ${baseline ? "wk-analytics-baseline" : ""}`}>
    <Stack gap="spacing.6">
      <div><span className="wk-preview-note">SHIPPING OPERATIONS</span><h3>Analytics summary</h3><p>Shipment volume, delivery performance and exceptions.</p></div>
      <div className="wk-metrics">{metrics.map(([label, value]) => <Card key={label}><Stack gap="spacing.2"><span className="wk-metric-label">{label}</span><strong className="wk-metric-value">{value}</strong></Stack></Card>)}</div>
      <a className="wk-report-link" href={`#${reportId}`} onClick={() => setReport(true)}>View full report <span aria-hidden="true">→</span></a>
      {report && <section id={reportId} className="wk-report"><h4 ref={reportHeading} tabIndex={-1}>Full report</h4><p>This exercise ends at report navigation. A real report destination, reporting period and metric definitions need product decisions.</p></section>}
    </Stack>
  </div>;
}
