import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { compileGenome, canonicalJson, generateGenome, checkFreshness } from "../scripts/compile-genome.ts";
import { resolveContext } from "../scripts/query-genome.ts";
import { readTokens } from "../scripts/tokens.ts";
import { authoredRecords, validateGenome } from "../scripts/validate-genome.ts";
import { authorityPath, validateReference, readAuthority } from "../scripts/authorities.ts";

const artifact = await compileGenome();

test("compiled snapshot is deterministic, complete and retains authored authority", async () => {
  assert.equal(canonicalJson(artifact), canonicalJson(await compileGenome()));
  assert.equal(canonicalJson({z:1,a:{d:2,b:3}}), canonicalJson({a:{b:3,d:2},z:1}));
  assert.deepEqual(artifact.entities, authoredRecords.entities);
  assert.deepEqual(artifact.contracts, authoredRecords.contracts);
  assert.deepEqual(artifact.rules, authoredRecords.rules);
  assert.deepEqual(artifact.exceptions, authoredRecords.exceptions);
  assert.deepEqual(artifact.relationships, authoredRecords.relationships);
  assert.equal(artifact.sources['genome/principles/README.md'].text, (await readAuthority('principles/README.md')).text);
  const sourceTokens = JSON.parse(artifact.sources['genome/foundations/tokens.json'].text!);
  assert.ok(sourceTokens.color.border.default.$description);
  assert.equal(artifact.tokens['typography.field-label'].source, 'genome/foundations/tokens.json#/typography/field-label');
  assert.equal(artifact.tokens['typography.field-label'].type, 'typography');
  assert.ok(artifact.tokens['reference.font-family']);
  assert.equal(artifact.sources['src/components/Button.tsx'].text, undefined);
  assert.equal(artifact.genome.status, 'draft');
  assert.throws(()=>canonicalJson({value:undefined}), /Non-JSON/);
  assert.throws(()=>canonicalJson({value:NaN}), /Nonfinite/);
});

test("destructive-action query traverses actual directions and preserves conditional context", () => {
  // JSON round trip demonstrates a consumer with no dependency on authored modules.
  const result = resolveContext(JSON.parse(canonicalJson(artifact)), 'forma.patterns.destructive-action');
  const ids = new Set(result.entities.map(e=>e.id));
  for (const id of ['forma.principles.clarity-before-density','forma.principles.hierarchy-communicates-intent','forma.components.button','forma.components.stack','forma.foundations.color','forma.foundations.motion','forma.rules.explicit-action-labels','forma.content.voice'] as const) assert.ok(ids.has(id), id);
  assert.ok(!ids.has('forma.patterns.form'), 'must not expand from shared principles into sibling workflows');
  assert.ok(!ids.has('forma.components.input'), 'conditional input is not a required dependency');
  assert.ok(result.conditional.some(c=>c.edge.to==='forma.components.input' && 'note' in c.edge && c.edge.note.includes('Conditional')));
  assert.ok(result.exceptions.every(e=>e.status==='draft'));
  assert.equal(result.exceptions.length, 1);
  assert.ok(result.rules.every(r=>r.validation.checker===null));
  assert.ok(result.tokens['border.width.default']); // contract mapping, no invented registry node
  assert.ok(result.tokens['focus.ring.offset']);
  assert.ok(result.tokens['reference.font-family']); // nested typography alias
  assert.throws(()=>resolveContext(artifact,'invented.intent'), /Unknown intent/);
  assert.equal(canonicalJson(result), canonicalJson(resolveContext(artifact,'forma.patterns.destructive-action')));
});

test("existing integrity gate rejects malformed records and broken graph data", async () => {
  const {tokens} = await readTokens();
  const mutations: ((r: any)=>void)[] = [
    r=>r.entities.push(r.entities[0]),
    r=>r.entities[0].status='approved-by-compiler',
    r=>r.entities[0].authority={},
    r=>r.relationships[0].to='forma.components.missing',
    r=>r.relationships[0].relation='invented',
    r=>r.rules.push(r.rules[0]),
    r=>r.rules[0].level='OPTIONAL',
    r=>r.rules[0].guidance='rules/README.md#missing',
    r=>r.exceptions[0].ruleId='missing',
    r=>r.exceptions[0].scope='',
    r=>r.exceptions[0].status='active',
    r=>r.contracts[0].api.variant.default='invented',
    r=>r.contracts[0].api.variant.values=[],
    r=>r.contracts[0].accessibility.humanReview='components/README.md#missing',
    r=>r.contracts[0].tokenRoles.radius='radius.missing',
  ];
  for (const mutate of mutations) {
    const records = structuredClone(authoredRecords); mutate(records);
    await assert.rejects(validateGenome(tokens, records));
  }
});

test("authority validation rejects missing paths/fragments and ambiguous headings", async () => {
  await assert.rejects(readAuthority('no-such-authority.md'));
  assert.throws(()=>authorityPath('../../outside.md'), /escapes/);
  assert.throws(()=>validateReference('# A\n## Same\n## Same\n','example.md#same'), /ambiguous/);
  assert.throws(()=>validateReference('{}','tokens.json#/missing'), /Missing pointer/);
  assert.throws(()=>validateReference('export const a = [];','file.ts#b'), /Missing export/);
});

test("generated output is atomically reproducible and stale or missing artifacts fail checks", async () => {
  const dir = await mkdtemp(join(tmpdir(), 'forma-compiled-'));
  const file = pathToFileURL(join(dir,'genome.json'));
  try {
    await assert.rejects(checkFreshness(file), /missing/);
    await generateGenome(file);
    await checkFreshness(file);
    assert.equal(await readFile(file,'utf8'), canonicalJson(artifact));
    await writeFile(file, canonicalJson({...artifact, genome:{...artifact.genome,version:'stale'}}));
    await assert.rejects(checkFreshness(file), /stale or modified/);
    await generateGenome(file);
    await checkFreshness(file);
    await assert.rejects(generateGenome(file, async () => { throw new Error("Invalid authority"); }), /Invalid authority/);
    await assert.rejects(readFile(file), /ENOENT/);
    await assert.rejects(readFile(new URL(file.href + '.tmp')), /ENOENT/);
  } finally { await rm(dir,{recursive:true,force:true}); }
});


test("query CLI runs with only its script and the compiled artifact", async () => {
  const dir = await mkdtemp(join(tmpdir(), 'forma-consumer-'));
  try {
    await mkdir(join(dir,'scripts')); await mkdir(join(dir,'generated'));
    await writeFile(join(dir,'package.json'), '{"type":"module"}');
    await writeFile(join(dir,'scripts/query-genome.ts'), await readFile(new URL('../scripts/query-genome.ts',import.meta.url)));
    await writeFile(join(dir,'generated/forma-genome.json'), canonicalJson(artifact));
    const output = execFileSync(process.execPath,[join(dir,'scripts/query-genome.ts'),'forma.patterns.destructive-action'],{encoding:'utf8',maxBuffer:1024*1024});
    assert.equal(JSON.parse(output).seed,'forma.patterns.destructive-action');
    assert.ok(JSON.parse(output).contracts.some((c: {id:string})=>c.id==='forma.components.button'));
  } finally { await rm(dir,{recursive:true,force:true}); }
});
