import { useEffect, useRef, useState } from "react";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "../../generated/forma-tokens.css";
import "../../src/components/components.css";
import { Button } from "../../src/components/Button";
import { Input } from "../../src/components/Input";
import { Card } from "../../src/components/Card";
import { Stack } from "../../src/components/Stack";
import { spacingTokens } from "../../genome/components/contracts";

export function Examples({ name }: { name: string }) {
  const [message, setMessage] = useState("Actions affect this example only.");
  const [busy, setBusy] = useState(false);
  const [value, setValue] = useState("Design operations");
  const [gap, setGap] = useState<(typeof spacingTokens)[number]>("spacing.4");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <section id="executable" className="ref-section">
    <div className="ref-section-heading"><h2>Executable example</h2><span>Original Forma components · local demonstration</span></div>
    {name === "stack" && <div className="ref-example-controls"><label htmlFor="stack-gap">Governed gap</label><select id="stack-gap" value={gap} onChange={e => setGap(e.target.value as typeof gap)}>{spacingTokens.map(t => <option key={t}>{t}</option>)}</select></div>}
    <div className="ref-example dg-forma-preview">
      {name === "button" && <Stack gap="spacing.6">
        <Stack direction="horizontal" gap="spacing.3" wrap>
          <Button onClick={() => setMessage("Create project activated in this example.")}>Create project</Button>
          <Button variant="secondary" onClick={() => setMessage("Changes discarded in this example.")}>Discard changes</Button>
          <Button variant="ghost" size="sm" onClick={() => setMessage("Details requested in this example.")}>View details</Button>
        </Stack>
        <Stack direction="horizontal" gap="spacing.3" wrap>
          <Button variant="destructive" onClick={() => setMessage("Destructive variant activated. No data was deleted.")}>Delete project</Button>
          <Button loading={busy} onClick={() => { setBusy(true); setMessage("Saving this local example…"); timer.current = setTimeout(() => { setBusy(false); setMessage("Example saved. No data was persisted."); }, 1200); }}>Save changes</Button>
          <Button disabled>Unavailable action</Button>
        </Stack>
        <p role="status" className="ref-example-feedback">{message}</p>
      </Stack>}
      {name === "input" && <Stack gap="spacing.6">
        <Input label="Project name" value={value} onChange={e => setValue(e.target.value)} helperText="Use a name your team will recognize." required />
        <Input label="Project URL" defaultValue="" errorMessage="Enter a project URL." type="url" />
        <Input label="Workspace" defaultValue="Forma workspace" disabled />
      </Stack>}
      {name === "card" && <Stack gap="spacing.6">
        <Card><Stack gap="spacing.4"><div><h3>Project brief</h3><p>Group related information around a clear purpose.</p></div><Button variant="secondary" onClick={() => setMessage("Project brief action activated in this example.")}>Open brief</Button></Stack></Card>
        <Card mode="link" href="/reference/forma/"><h3>Explore the Forma showcase</h3><p>A native link. No nested controls.</p></Card>
        <p role="status" className="ref-example-feedback">{message}</p>
      </Stack>}
      {name === "stack" && <Stack gap={gap} direction="horizontal" wrap><Button>Save changes</Button><Button variant="secondary">Discard changes</Button><Button variant="ghost">View details</Button></Stack>}
    </div>
    <p className="ref-caption">Curated states for inspection. These examples do not establish accessibility compliance or implement a product workflow.</p>
    <a className="dg-text-link" href="/reference/forma/">Open full Forma showcase <span aria-hidden="true">↗</span></a>
  </section>;
}
