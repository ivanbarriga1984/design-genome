import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, writeFile, readdir, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { exportExperiment, verifyExperiment, inventory, preserveResult, SOURCE_COMMIT, TASK, sha } from '../experiments/export.ts';

const temp=await mkdtemp(join(tmpdir(),'forma-export-test-'));
const first=join(temp,'first'),second=join(temp,'second');
const manifest=await exportExperiment(first);

test.after(async()=>{await rm(temp,{recursive:true,force:true});});

test('pinned exports are reproducible with one exact context difference and no hidden authority',async()=>{
  const again=await exportExperiment(second);
  assert.deepEqual(manifest,again);
  await verifyExperiment(first); await verifyExperiment(second);
  assert.equal(manifest.sourceCommit,SOURCE_COMMIT);
  assert.equal(manifest.modelSettings,null);
  assert.equal(await readFile(join(first,'baseline/TASK.md'),'utf8'),TASK);
  assert.equal(await readFile(join(first,'baseline/SUPPLIED_CONTEXT.md'),'utf8'),'');
  assert.equal(sha(await readFile(join(first,'genome-informed/SUPPLIED_CONTEXT.md'))),manifest.genomeInformedContextHash);
  for(const condition of ['baseline','genome-informed']) {
    const files=await inventory(join(first,condition));
    assert.ok(!Object.keys(files).some(p=>/^(genome|docs|adapters|scripts|\.git)\//.test(p)));
    assert.ok(!Object.keys(files).some(p=>p.endsWith('forma-genome.json')));
    assert.deepEqual(await readdir(join(first,'results',condition)),[],'no experimental result should be invented');
  }
  const pinned=JSON.parse(execFileSync('git',['show',`${SOURCE_COMMIT}:package-lock.json`],{encoding:'utf8'}));
  const fixture=JSON.parse(await readFile(join(first,'baseline/package-lock.json'),'utf8'));
  // Only root package name is operationally renamed; all actual package resolutions are unchanged.
  delete pinned.name; delete fixture.name; delete pinned.packages[''].name; delete fixture.packages[''].name;
  assert.deepEqual(pinned,fixture);
  await assert.rejects(exportExperiment(first),/Refusing to overwrite/);
});

test('runtime projection excludes prose but retains byte-identical executable files and APIs',async()=>{
  const frozen=await readFile(join(first,'baseline/src/components/runtime-contracts.ts'),'utf8');
  const contracts=JSON.parse(frozen.slice(frozen.indexOf('= ')+2,frozen.lastIndexOf(' as const;')));
  for(const c of contracts) assert.deepEqual(Object.keys(c).sort(),['api','id','tokenRoles','variants']);
  assert.ok(!frozen.includes('humanReview') && !frozen.includes('semantics'));
  for(const file of ['src/Showcase.tsx','src/components/Button.tsx','src/components/Input.tsx','src/components/Card.tsx','src/components/Stack.tsx','src/styles.css','src/components/components.css','tests/components.test.tsx']) {
    assert.deepEqual(await readFile(join(first,'baseline',file)),execFileSync('git',['show',`${SOURCE_COMMIT}:${file}`]));
  }
  assert.ok((await readFile(join(first,'baseline/src/components/contract.ts'),'utf8')).includes('./runtime-contracts.ts'));
  assert.ok(!(await readFile(join(first,'baseline/vite.config.ts'),'utf8')).includes('generateTokens'));
});

test('verification rejects contamination, unexpected differences, symlinks and context tampering',async()=>{
  const file=join(first,'baseline/UNEXPECTED.md'); await writeFile(file,'extra material');
  await assert.rejects(verifyExperiment(first)); await rm(file);
  await symlink(join(first,'coordinator'),join(first,'baseline/leak'));
  await assert.rejects(verifyExperiment(first),/Symlink/); await rm(join(first,'baseline/leak'));
  const context=join(first,'genome-informed/SUPPLIED_CONTEXT.md'),original=await readFile(context);
  await writeFile(context,'edited context'); await assert.rejects(verifyExperiment(first)); await writeFile(context,original);
  await verifyExperiment(first);
});

test('preservation captures new files and diffs without creating Git history',async()=>{
  // Synthetic unit-test edit only; never an experimental implementation run.
  await writeFile(join(second,'baseline/unit-test-note.txt'),'synthetic fixture edit\n');
  await preserveResult(second,'baseline');
  assert.equal(await readFile(join(second,'results/baseline/implementation/unit-test-note.txt'),'utf8'),'synthetic fixture edit\n');
  assert.match(await readFile(join(second,'results/baseline/implementation.diff'),'utf8'),/unit-test-note/);
  assert.ok(!(await inventory(join(second,'results/baseline/implementation')))['.git']);
  await assert.rejects(preserveResult(second,'baseline'),/Refusing to overwrite/);
});
