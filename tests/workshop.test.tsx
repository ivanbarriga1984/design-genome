import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import { act } from "react";
import { workshopProjection } from "../site/workshop/projection.ts";
import { compileGenome, canonicalJson } from "../scripts/compile-genome.ts";
import { resolveContext } from "../scripts/query-genome.ts";
import { excerpt } from "../adapters/codex/context.ts";
import { authorityPath } from "../scripts/authorities.ts";
import { scenarios, analyticsRoots } from "../site/workshop/scenarios.ts";
import { Workshop } from "../site/workshop/Workshop.tsx";
import { pageMetadata } from "../site/metadata.ts";
import { metadataHtml } from "../site/metadata-plugin.ts";

const data = await workshopProjection();
test("workshop preserves resolved authority, source evidence and conditional contracts", async () => {
  const compiled = await compileGenome();
  const { guidance, ...primary } = data.primary;
  const { sources, ...resolved } = resolveContext(compiled, "forma.patterns.destructive-action");
  assert.deepEqual(primary, resolved);
  assert.equal(data.compiledSha256, createHash("sha256").update(canonicalJson(compiled)).digest("hex"));
  assert.ok(!primary.contracts.some(c => c.id === "forma.components.input"));
  assert.ok(data.additionalEntry.context.contracts.some(c => c.id === "forma.components.input"));
  assert.deepEqual(data.additionalEntry.relationship, primary.conditional.find(c => c.entity?.id === "forma.components.input")!.edge);
  for (const item of [...guidance, ...data.additionalEntry.context.guidance]) {
    const source = authorityPath(item.reference);
    assert.equal(item.text, excerpt(sources[source.path].text!, source.fragment));
    assert.equal(item.sha256, sources[source.path].sha256);
  }
  assert.equal(primary.rules.find(r => r.id === "forma.rules.explicit-action-labels")?.level, "SHOULD");
  assert.equal(primary.exceptions[0].status, "draft");
});

test("workshop route metadata normalizes both forms in delivered HTML", async () => {
  const shell = await readFile(new URL("../index.html", import.meta.url), "utf8");
  for (const path of ["/workshop", "/workshop/"]) {
    assert.equal(pageMetadata(path).title, "Workshop — Design Genome");
    const dom = new JSDOM(metadataHtml(shell, path));
    assert.equal(dom.window.document.querySelector('link[rel="canonical"]')?.getAttribute("href"), "https://design-genome.com/workshop");
    assert.equal(dom.window.document.querySelector('meta[property="og:url"]')?.getAttribute("content"), "https://design-genome.com/workshop");
    dom.window.close();
  }
});


test("all teaching traces are supplied; analytics uses explicit roots without a pattern", async () => {
  assert.deepEqual(data.analytics.roots.map(r => r.id).sort(), [...analyticsRoots].sort());
  assert.ok(!data.analytics.entities.some(e => e.id.startsWith("forma.patterns.")));
  assert.ok(!data.analytics.contracts.some(c => c.id === "forma.components.button"));
  assert.ok(!data.form.contracts.some(c => c.id === "forma.components.card"));
  const compiled = await compileGenome();
  for (const [key, context] of [["create", data.form], ["delete", data.primary], ["analytics", data.analytics]] as const) {
    for (const trace of scenarios[key].traces) {
      assert.ok(context.guidance.some(item => item.id === trace.id), `${key}: missing trace ${trace.id}`);
      assert.ok(context.entities.some(item => item.id === trace.related), `${key}: missing supporting source`);
    }
    for (const item of context.guidance) {
      const source = authorityPath(item.reference);
      assert.equal(item.text, excerpt(compiled.sources[source.path].text!, source.fragment));
      assert.equal(item.sha256, compiled.sources[source.path].sha256);
    }
    for (const edge of context.relationships) assert.ok(compiled.relationships.some(e => JSON.stringify(e) === JSON.stringify(edge)));
  }
});

test("three tasks progress independently, preserve exact intent, and retain conditional human review", async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost/workshop" });
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true });
  const container = document.getElementById("root")!;
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(container);
  const click = async (text: string) => {
    const button = [...container.querySelectorAll('button')].find(b => b.textContent?.startsWith(text));
    assert.ok(button, `Missing action: ${text}`); await act(async () => button.click());
  };
  const choose = async (index: number) => { await act(async () => container.querySelectorAll<HTMLButtonElement>('.wk-chooser button')[index].click()); };
  const heading = () => container.querySelector('h2')!;
  const set = async (input: HTMLInputElement, value: string) => {
    const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value')!.set!;
    await act(async () => { setter.call(input, value); input.dispatchEvent(new dom.window.Event('input', { bubbles: true })); });
  };
  try {
    await act(async () => root.render(<Workshop data={data} />));
    assert.equal(container.querySelector('.wk-preview'), null);
    for (const informed of [false, true]) {
      await click(informed ? 'Generate with Genome' : 'Generate result');
      assert.equal(document.activeElement, heading());
      assert.equal(container.querySelector('.wk-prompt > p')!.textContent, scenarios.create.task);
      const preview = container.querySelector('.wk-preview')!;
      const form = preview.querySelector('form')!;
      const [name, url] = preview.querySelectorAll<HTMLInputElement>('input');
      await act(async () => form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })));
      assert.equal(document.activeElement, name);
      assert.equal(name.getAttribute('aria-invalid'), 'true');
      assert.ok(name.getAttribute('aria-describedby')!.includes('error'));
      await set(name, 'Design operations'); await set(url, 'ftp://example.com');
      await act(async () => form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })));
      assert.equal(document.activeElement, url);
      await set(url, 'https:example.com');
      await act(async () => form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })));
      assert.equal(url.getAttribute('aria-invalid'), 'true');
      await set(url, '');
      await act(async () => form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })));
      assert.match(preview.textContent!, informed ? /was created/ : /is ready/);
      assert.equal(!!preview.querySelector('form'), informed);
      if (!informed) { assert.equal(document.activeElement, preview.querySelector('h3')); await click('Supply Design Genome'); }
    }
    assert.equal(container.querySelectorAll('.wk-traces > details').length, 3);
    const summaries = container.querySelectorAll<HTMLDetailsElement>('.wk-breakdown details');
    assert.equal(summaries.length, 3);
    assert.ok([...summaries].every(item => !item.open));
    assert.deepEqual([...summaries].map(item => item.querySelector('p')!.textContent), [scenarios.create.carried, scenarios.create.shared, scenarios.create.local]);
    for (const item of summaries) {
      await act(async () => item.querySelector('summary')!.click());
      assert.equal(item.open, true);
      await act(async () => item.querySelector('summary')!.click());
      assert.equal(item.open, false);
    }
    assert.ok(!container.textContent!.includes('A visual difference alone'));

    await click('Explore the boundary'); await click('Reflect on the exercise');
    assert.match(container.textContent!, /The model is not the source/);
    assert.match(container.textContent!, /It does not establish compliance/);
    await choose(1); assert.equal(container.querySelector('.wk-preview'), null);
    await click('Generate result'); assert.equal(container.querySelector('button[type="submit"]')!.textContent, 'Delete');
    await click('Supply Design Genome'); assert.ok(!container.querySelector('input'));
    await click('Generate with Genome'); await click('Make a review decision');
    const [no, yes] = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    await act(async () => no.click()); assert.equal(container.querySelector('.wk-inherited input'), null);
    await click('Reset review decision'); assert.equal(document.activeElement, no);
    await act(async () => yes.click());
    const input = container.querySelector<HTMLInputElement>('.wk-inherited input')!;
    const submit = container.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    assert.ok(submit.disabled);
    await set(input, 'Wrong name'); assert.ok(submit.disabled);
    await set(input, 'Design operations'); assert.equal(submit.disabled, false);
    await act(async () => submit.click()); assert.match(container.querySelector('[role="status"]')!.textContent!, /Project deleted/);
    await click('Reflect on the exercise'); await click('Start again');
    await click('Generate result'); await click('Supply Design Genome'); await click('Generate with Genome'); await click('Make a review decision');
    assert.ok([...container.querySelectorAll<HTMLInputElement>('input[type="radio"]')].every(i => !i.checked));
    await choose(2); await click('Generate result');
    for (const text of ['1,284', '96.8%', '2.4 days', '17']) assert.ok(container.querySelector('.wk-preview')!.textContent!.includes(text));
    await click('Supply Design Genome'); assert.match(container.textContent!, /Explicit selection, not an analytics pattern/);
    await click('Generate with Genome');
    const link = container.querySelector<HTMLAnchorElement>('.wk-report-link')!;
    assert.equal(link.tagName, 'A'); assert.ok(link.getAttribute('href')!.startsWith('#'));
    assert.equal(container.querySelectorAll('.wk-preview button').length, 0);
    await act(async () => link.click()); assert.equal(document.activeElement, container.querySelector('.wk-report h4'));
    await click('Explore the boundary'); assert.match(container.textContent!, /Forma has no analytics or dashboard pattern/);
    await click('Reflect on the exercise'); assert.equal(container.querySelectorAll('.wk-reflection-questions li').length, 3);
    await choose(0); assert.equal(container.querySelector('.wk-preview'), null);
  } finally { await act(async () => root.unmount()); dom.window.close(); }
});
