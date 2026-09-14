import assert from "node:assert/strict";
import test from "node:test";
import { referenceProjection } from "../site/reference/projection.ts";
import { entities, relationships } from "../genome/registry.ts";
import { contracts } from "../genome/components/contracts.ts";
import { readFile } from "node:fs/promises";
import { excerpt } from "../adapters/codex/context.ts";
import { authorityPath } from "../scripts/authorities.ts";

test("Reference preserves registered guidance scope, source records, and all navigable endpoints", async () => {
  const view = await referenceProjection();
  assert.deepEqual(view.contracts, contracts);
  assert.deepEqual(view.relationships, relationships);
  assert.equal(view.entities.length, entities.length);
  const routes = view.entities.map(e => `${e.domain}/${e.slug}`);
  assert.equal(new Set(routes).size, routes.length);
  for (const e of view.entities) {
    const source = entities.find(record => record.id === e.id)!;
    assert.deepEqual(e.authority, source.authority);
    assert.equal(e.status, source.status);
    assert.ok(e.title);
    if (e.guidanceRef) {
      const {path, fragment} = authorityPath(e.guidanceRef);
      const original = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
      assert.equal(e.guidance, excerpt(original, fragment).replace(/^#+ .+\n*/, ""));
      assert.match(view.sources[path].sha256, /^[a-f0-9]{64}$/);
    }
  }
  for (const edge of view.relationships) for (const id of [edge.from,edge.to]) assert.ok(view.entities.some(e=>e.id===id));
});

test("Reference machine example preserves conditional context and resolved token geometry", async () => {
  const view = await referenceProjection();
  assert.ok(!view.machine.contracts.includes("forma.components.input" as never));
  assert.equal(view.machine.conditional[0].edge.to, "forma.components.input");
  assert.ok(view.machine.rules.every(r=>r.validation.checker===null));
  assert.equal(view.exceptions[0].status, "draft");
  assert.match(view.exceptions[0].scope, /third-party embedded/);
  assert.equal(view.cssValues["--forma-border-width-default"], "1px");
  assert.equal(view.cssValues["--forma-focus-ring-width"], "2px");
  assert.equal(view.cssValues["--forma-focus-ring-offset"], "2px");
  for (const path of Object.keys(view.tokens).filter(p=>!p.startsWith("reference."))) assert.ok(view.cssValues[`--forma-${path.replaceAll(".","-")}`]);
});
