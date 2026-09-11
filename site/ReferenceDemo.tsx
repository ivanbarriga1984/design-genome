import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "../generated/forma-tokens.css";
import "../src/components/components.css";
import { useState } from "react";
import { Button } from "../src/components/Button";
import { Input } from "../src/components/Input";
import { Card } from "../src/components/Card";
import { Stack } from "../src/components/Stack";
import { contracts } from "../genome/components/contracts";
import { Icon } from "./Icon";

const button = contracts[0];
export default function ReferenceDemo() {
  const [name, setName] = useState("Design operations");
  const [created, setCreated] = useState("");
  return (
    <div className="dg-reference-visual">
      <div className="dg-reference-source">
        <div className="dg-window-title">
          <span className="dg-point" />
          Inside the reference Genome<span>FORMA / v0.1</span>
        </div>
        <div className="dg-source-step">
          <span className="dg-step">01 / DESIGN DECISION</span>
          <h3>Say what the action does.</h3>
          <p>
            Forma’s explicit-action-label rule connects a small content choice
            to the outcome a person expects.
          </p>
          <div className="dg-label-example">
            <s>Submit</s>
            <Icon />
            <strong>Create project</strong>
          </div>
        </div>
        <div className="dg-source-step">
          <span className="dg-step">02 / STRUCTURED CONTRACT</span>
          <pre aria-label="Excerpt from the actual Forma button contract">
            <code>
              <span className="dg-code-key">id</span> {button.id}
              {"\n\n"}
              <span className="dg-code-key">variant.default</span> "
              {button.api.variant.default}"{"\n"}
              <span className="dg-code-key">primary.background</span>
              {"\n"} "{button.tokenRoles["primary.background"]}"
            </code>
          </pre>
          <a href="https://github.com/ivanbarriga1984/design-genome/blob/main/genome/components/contracts.ts">
            Inspect the source contract
            <Icon name="external" />
          </a>
        </div>
      </div>
      <div className="dg-reference-result">
        <div className="dg-result-caption">
          <span className="dg-step">03 / EXECUTABLE RESULT</span>
          <span className="dg-live">
            <i />
            Live component
          </span>
        </div>
        <div className="dg-forma-preview">
          <div className="dg-forma-brand">
            forma<span>Workspace</span>
          </div>
          <Card>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (name.trim()) setCreated(name.trim());
              }}
            >
              <Stack gap="spacing.6">
                <div>
                  <h3>Create a project</h3>
                  <p>Bring your team’s work together.</p>
                </div>
                <Input
                  label="Project name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setCreated("");
                  }}
                  helperText="Use a name your team will recognize."
                  required
                />
                <Stack direction="horizontal" gap="spacing.3">
                  <Button type="submit" disabled={!name.trim()}>
                    Create project
                  </Button>
                </Stack>
                <p className="dg-demo-feedback" role="status">
                  {created
                    ? `“${created}” created in this local demo.`
                    : "Try it. This example stays in your browser."}
                </p>
              </Stack>
            </form>
          </Card>
        </div>
        <p className="dg-result-note">
          The existing Button, Input, Card, and Stack.
          <br />
          Their governed contracts. Their own visual identity.
        </p>
      </div>
    </div>
  );
}
