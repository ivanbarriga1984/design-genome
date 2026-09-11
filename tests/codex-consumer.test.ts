import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { compileGenome, canonicalJson } from '../scripts/compile-genome.ts';
import { renderContext, parseArtifact, deliverContext, excerpt } from '../adapters/codex/context.ts';

// Compiler supplies fixture bytes only; consumer receives no authority objects or readers.
const text = canonicalJson(await compileGenome());
const context = renderContext(text);

test('Codex packet is deterministic and scoped, preserving required/conditional/review boundaries', () => {
  assert.equal(context, renderContext(text));
  assert.ok(context.length < text.length / 2, 'avoid dumping the compiled artifact');
  assert.ok(context.includes('forma.patterns.destructive-action — uses → forma.components.button'));
  assert.ok(context.includes('forma.principles.clarity-before-density — informs → forma.patterns.destructive-action'));
  assert.ok(context.includes('"level":"SHOULD"'));
  assert.ok(context.includes('"checker":null'));
  const governed = context.split('## Conditional context')[0];
  assert.ok(governed.includes('### Component contracts'));
  assert.ok(!governed.includes('"implementation":"src/components/Input.tsx"'));
  const conditional = context.split('## Conditional context')[1].split('## Exceptions')[0];
  assert.ok(conditional.includes('forma.components.input'));
  assert.ok(conditional.includes('Conditional: additional entry only when the consequence warrants it'));
  assert.ok(context.includes('## Human review and unresolved requirements'));
  assert.ok(context.includes('draft exceptions cannot authorize a deviation'));
  assert.ok(context.includes('"status":"draft"'));
  assert.ok(context.includes('external integration changes or is replaced'));
  assert.ok(!context.includes('## Deferred public site and deployment'));
  assert.ok(!context.includes('Manrope'));
  assert.ok(context.includes('border.width.default (dimension)'));
  assert.ok(context.includes('reference.font-family (fontFamily)'));
  assert.throws(()=>renderContext(text,'forma.patterns.form'), /supports only/);
});

test('guidance extraction preserves exact subsection prose and fails rather than guessing', () => {
  assert.equal(excerpt('# Guide\n\n## One\nExact words.\n### Child\nMore.\n## Two\nOther.', 'one'), '## One\nExact words.\n### Child\nMore.');
  assert.throws(()=>excerpt('## Same\n## Same','same'), /ambiguous/);
  assert.throws(()=>excerpt('## One','two'), /Missing/);
});

test('broken compiled transport or missing selected context fails clearly', () => {
  assert.throws(()=>parseArtifact('{broken'), /not valid JSON/);
  assert.throws(()=>parseArtifact('{}'), /envelope/);
  const mutations: ((a:any)=>void)[] = [
    a=>a.generated.formatVersion=999,
    a=>a.relationships[0].to='missing',
    a=>a.entities.push(a.entities[0]),
    a=>a.contracts=a.contracts.filter((c:any)=>c.id!=='forma.components.button'),
    a=>delete a.sources['genome/principles/README.md'],
    a=>a.sources['genome/principles/README.md'].text+='corrupt',
    a=>a.exceptions[0].status='active',
    a=>a.exceptions=[],
    a=>a.exceptions[0].ruleId='missing',
    a=>a.exceptions[0].scope='',
    a=>delete a.tokens['border.width.default'],
  ];
  for (const mutate of mutations) { const a=JSON.parse(text); mutate(a); assert.throws(()=>renderContext(JSON.stringify(a))); }
});

test('consumer uses embedded guidance, never a matching on-disk source', () => {
  const a=JSON.parse(text);
  const source=a.sources['genome/principles/README.md'];
  source.text=source.text.replace('Make the user', 'Embedded compiled test: make the user');
  source.sha256=createHash('sha256').update(source.text).digest('hex');
  assert.ok(renderContext(JSON.stringify(a)).includes('Embedded compiled test: make the user'));
});

test('standalone consumer needs only compiled JSON and query code, and removes stale output on failure', async () => {
  const dir=await mkdtemp(join(tmpdir(),'forma-codex-'));
  const input=pathToFileURL(join(dir,'generated/forma-genome.json'));
  const output=pathToFileURL(join(dir,'generated/codex-destructive-action.md'));
  try {
    await mkdir(join(dir,'adapters/codex'),{recursive:true}); await mkdir(join(dir,'scripts')); await mkdir(join(dir,'generated'));
    await writeFile(join(dir,'package.json'),'{"type":"module"}');
    for (const file of ['adapters/codex/context.ts','scripts/query-genome.ts']) await writeFile(join(dir,file),await readFile(new URL('../'+file,import.meta.url)));
    await writeFile(input,text);
    execFileSync(process.execPath,[join(dir,'adapters/codex/context.ts')],{encoding:'utf8'});
    assert.equal(await readFile(output,'utf8'),context);
    await writeFile(input,'broken');
    await assert.rejects(deliverContext(input,output),/not valid JSON/);
    await assert.rejects(readFile(output),/ENOENT/);
    await rm(input);
    await assert.rejects(deliverContext(input,output),/missing or unreadable/);
  } finally { await rm(dir,{recursive:true,force:true}); }
});
