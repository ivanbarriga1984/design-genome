import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { compileGenome, canonicalJson } from '../scripts/compile-genome.ts';
import { resolveContext } from '../scripts/query-genome.ts';
import { resolveSelection } from '../scripts/select-context.ts';
import { formatCodexContext } from '../adapters/codex/format.ts';
import { renderContext, request } from '../adapters/codex/context.ts';

const compiled = await compileGenome();
const text = canonicalJson(compiled);
const deletionRoot = { id: 'forma.patterns.destructive-action', reason: 'The task deletes a project.' };
const initial = resolveSelection(text, { roots: [deletionRoot] });
const analyticsIds = ['forma.components.card','forma.components.stack','forma.foundations.typography',
  'forma.principles.clarity-before-density','forma.principles.hierarchy-communicates-intent',
  'forma.content.voice','forma.content.action-labels','forma.rules.explicit-action-labels',
  'forma.rules.one-primary-action-per-decision-context','forma.rules.reuse-governed-components'];
const roots = analyticsIds.map(id => ({ id, reason: `Caller selected ${id} for this summary; no analytics pattern is asserted.` }));

test('single-root selection preserves resolution, excerpts and scoped provenance', () => {
  const resolved = resolveContext(compiled, deletionRoot.id);
  assert.deepEqual(initial.entities.map(e=>e.id).sort(), resolved.entities.map(e=>e.id).sort());
  assert.deepEqual(initial.roots, [deletionRoot]);
  assert.ok(initial.inclusion.entities.find(e=>e.id===deletionRoot.id)?.explicit.length);
  assert.ok(initial.inclusion.entities.find(e=>e.id==='forma.components.button')?.resolvedFrom.includes(deletionRoot.id));
  assert.ok(initial.inclusion.contracts.some(c=>c.id==='forma.components.button'));
  assert.ok(initial.inclusion.tokens.some(t=>t.path==='color.action.destructive'));
  assert.ok(!initial.contracts.some(c=>c.id==='forma.components.input'));
  assert.equal(initial.conditional[0].active, false);
  assert.ok(!('components/README.md#input' in initial.guidance));
  assert.ok(Object.values(initial.sources).every(source=>Object.keys(source).join() === 'sha256'));
  assert.ok(!initial.sources['docs/specification-v0.1.md']);
  for (const excerpt of Object.values(initial.guidance)) {
    assert.equal(excerpt.sha256, compiled.sources[excerpt.path].sha256);
    assert.ok(compiled.sources[excerpt.path].text!.includes(excerpt.text));
  }
  assert.ok(renderContext(text).includes(request));
});

test('Form and analytics selections stay honest, deterministic and free of synthetic relationships', () => {
  const form = resolveSelection(text, { roots: [{id:'forma.patterns.form', reason:'Project creation requires entry.'}] });
  assert.deepEqual(form.contracts.map(c=>c.id), ['forma.components.button','forma.components.input','forma.components.stack']);
  assert.ok(!form.entities.some(e=>['forma.components.card','forma.content.voice'].includes(e.id)));
  const analytics = resolveSelection(text, { roots });
  assert.deepEqual(analytics, resolveSelection(text, { roots: [...roots].reverse().concat(roots[0]) }));
  assert.deepEqual(analytics.contracts.map(c=>c.id), ['forma.components.card','forma.components.stack']);
  assert.ok(!analytics.entities.some(e=>e.id.startsWith('forma.patterns.')));
  assert.equal(new Set(analytics.entities.map(e=>e.id)).size, analytics.entities.length);
  for (const edge of analytics.relationships) assert.ok(compiled.relationships.some(e=>JSON.stringify(e)===JSON.stringify(edge)));
  const packet = formatCodexContext({task:'Show the supplied shipping metrics and a link to the full report. Metric values are exercise facts.',context:analytics});
  assert.ok(packet.includes('Co-selection creates no authored relationship, scenario pattern or governed composition'));
  assert.ok(packet.includes(roots[0].reason));
  assert.ok(packet.includes('"mode"'));
  assert.ok(packet.includes('Do not nest interactive descendants'));
  assert.ok(packet.includes('Implementation choices and human review'));
  assert.ok(packet.includes('"level":"SHOULD"'));
  assert.ok(packet.includes('draft exceptions cannot authorize'));
  assert.ok(!packet.includes('"implementation":"src/components/Button.tsx"'));
});

test('conditional Input activation requires a recorded decision and the same snapshot', () => {
  const activation = {from:deletionRoot.id,to:'forma.components.input',reason:'Local human review warrants additional entry.'};
  const selection = {roots:[deletionRoot],activations:[activation],expectedCompiledSha256:initial.compiledSha256};
  const replacement = resolveSelection(text, selection);
  assert.equal(replacement.compiledSha256, initial.compiledSha256);
  assert.deepEqual(replacement.activations,[activation]);
  assert.ok(replacement.contracts.some(c=>c.id===activation.to));
  assert.equal(replacement.conditional[0].active,true);
  assert.equal(replacement.conditional[0].edge.relation,'related-to');
  assert.ok(!replacement.relationships.some(e=>e.from===activation.from && e.to===activation.to && e.relation==='uses'));
  const packet = formatCodexContext({task:'Delete the fictional project. Use additional entry following local review.',context:replacement});
  assert.ok(packet.includes(activation.reason));
  assert.ok(packet.includes('Selected target context is supplied above.'));
  assert.ok(!packet.includes('Target contract is not active;'));
  assert.throws(()=>resolveSelection(text,{roots:[deletionRoot],activations:[activation]}),/snapshot hash/);
  assert.throws(()=>resolveSelection(text+' ',selection),/Incompatible compiled snapshot/);
  assert.throws(()=>resolveSelection(text,{...selection,activations:[{...activation,to:'forma.components.card'}]}),/authored related-to/);
  assert.throws(()=>resolveSelection(text,{...selection,activations:[{...activation,reason:''}]}),/decision reason/);
  const explicit = resolveSelection(text,{roots:[deletionRoot,{id:activation.to,reason:'Caller explicitly included entry.'}]});
  assert.equal(explicit.conditional[0].active,true);
  assert.deepEqual(explicit.activations,[]); // explicit selection is not invented human activation
});

test('conflicting roots, compiled duplicates, missing context and incompatible snapshots fail closed', () => {
  assert.throws(()=>resolveSelection(text,{roots:[deletionRoot,{...deletionRoot,reason:'conflicting reason'}]}),/Conflicting duplicate/);
  assert.throws(()=>resolveSelection(text,{roots:[]}),/explicit root/);
  assert.throws(()=>resolveSelection(text,{roots:[{id:'forma.patterns.analytics',reason:'not authored'}]}),/Unknown intent entity/);
  assert.throws(()=>resolveSelection(text,{roots:[deletionRoot],expectedCompiledSha256:'0'.repeat(64)}),/snapshot/);
  const duplicate={...compiled, contracts:[...compiled.contracts, compiled.contracts[0]]};
  assert.throws(()=>resolveSelection(JSON.stringify(duplicate),{roots:[deletionRoot]}),/Duplicate compiled records/);
  const edges:any=structuredClone(compiled);
  edges.relationships.push({...edges.relationships[0],note:'Conflicting note'});
  assert.throws(()=>resolveSelection(JSON.stringify(edges),{roots:[deletionRoot]}),/Conflicting duplicate/);
});

test('formatter runs with only a serialized selection envelope, no authority or resolver files', async () => {
  const dir=await mkdtemp(join(tmpdir(),'dg-pure-formatter-'));
  try {
    const task='Create a project with a required name. Treat this as an exercise fact.';
    const context=resolveSelection(text,{roots:[{id:'forma.patterns.form',reason:'A data-entry task.'}]});
    await writeFile(join(dir,'package.json'),'{"type":"module"}');
    await writeFile(join(dir,'format.ts'),await readFile(new URL('../adapters/codex/format.ts',import.meta.url)));
    await writeFile(join(dir,'selection.json'),JSON.stringify({task,context}));
    await writeFile(join(dir,'run.mjs'),`import {readFile} from 'node:fs/promises';import {formatCodexContext} from './format.ts';process.stdout.write(formatCodexContext(JSON.parse(await readFile(new URL('./selection.json',import.meta.url),'utf8'))));`);
    const output=execFileSync(process.execPath,[join(dir,'run.mjs')],{encoding:'utf8'});
    assert.equal(output,formatCodexContext({task,context}));
    assert.ok(!output.includes('"id":"forma.components.card"'));
  } finally { await rm(dir,{recursive:true,force:true}); }
});
