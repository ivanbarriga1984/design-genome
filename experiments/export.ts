import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const SOURCE_COMMIT = '512bf92d2639cd9467e8946baef14c3ebf25998b';
const repository = fileURLToPath(new URL('../', import.meta.url));
export const conditions = ['baseline', 'genome-informed'] as const;
export const TASK = `Add a destructive action allowing a user to delete a project.

This is a disposable local demonstration only. Do not delete real data, add persistence or networking, or commit or push. Preserve existing public component APIs unless implementation genuinely requires otherwise.

If SUPPLIED_CONTEXT.md contains additional supplied context, read it before implementing the task.
`;
export const sha = (bytes: string | Buffer) => createHash('sha256').update(bytes).digest('hex');
const serialize = (value: unknown) => JSON.stringify(value, null, 2) + '\n';
export const treeHash = (files: Record<string,string>) => sha(serialize(Object.fromEntries(Object.entries(files).sort(([a],[b])=>a<b?-1:a>b?1:0))));

/** Source inventories never follow symlinks or silently ignore unknown files. */
export async function inventory(root: string, ignoreRuntime = false): Promise<Record<string,string>> {
  const files: Record<string,string> = {};
  async function visit(path: string) {
    for (const name of (await readdir(join(root,path))).sort()) {
      if (!path && ignoreRuntime && ['node_modules','dist'].includes(name)) { assert.ok(!(await lstat(join(root,name))).isSymbolicLink(), `Runtime root cannot be a symlink: ${name}`); continue; }
      const local=path ? `${path}/${name}` : name;
      const stat=await lstat(join(root,local));
      assert.ok(!stat.isSymbolicLink(), `Symlink is not allowed in fixture source: ${local}`);
      if (stat.isDirectory()) await visit(local);
      else { assert.ok(stat.isFile(), `Unsupported fixture entry: ${local}`); files[local]=sha(await readFile(join(root,local))); }
    }
  }
  await visit(''); return files;
}
function command(cmd: string, args: string[], cwd: string): Buffer {
  return execFileSync(cmd,args,{cwd,maxBuffer:32*1024*1024,env:{...process.env,NODE_PATH:'',NODE_OPTIONS:''}});
}
async function write(root:string,path:string,data:string|Buffer) { await mkdir(dirname(join(root,path)),{recursive:true}); await writeFile(join(root,path),data); }
async function absent(path:string) {
  try { await lstat(path); } catch(e) { if ((e as NodeJS.ErrnoException).code==='ENOENT') return; throw e; }
  throw new Error(`Refusing to overwrite existing export/result: ${path}`);
}
export interface Manifest {
  sourceCommit: string; runId: string; harnessSha256: string;
  fixtureHash: string; taskHash: string; baselineContextHash: string; genomeInformedContextHash: string;
  compiledGenomeHash: string; frozenRuntimeHash: string; cssHash: string;
  dependencyLockHash: string; sourceDependencyLockHash: string;
  files: Record<string,string>; expectedDifference: string[];
  modelSettings: null; modelFamilyForLaterRun: string; exportRuntime: {node:string;npm:string};
}

export async function exportExperiment(destination: string) {
  destination=resolve(destination); await absent(destination);
  const scratch=await mkdtemp(join(tmpdir(),'forma-private-export-'));
  let created=false;
  try {
    // All authority work happens in a private archive of the exact commit, never the working tree.
    const archive=command('git',['archive','--format=tar',SOURCE_COMMIT],repository);
    execFileSync('tar',['-xf','-','-C',scratch],{input:archive});
    command(process.execPath,['scripts/generate-tokens.ts'],scratch);
    command(process.execPath,['scripts/compile-genome.ts'],scratch);
    command(process.execPath,['scripts/compile-genome.ts','--check'],scratch);
    command(process.execPath,['adapters/codex/context.ts'],scratch);
    const packet=await readFile(join(scratch,'generated/codex-destructive-action.md'));
    const compiled=await readFile(join(scratch,'generated/forma-genome.json'));
    const runtime=command(process.execPath,['--input-type=module','-e',`import { contracts } from './genome/components/contracts.ts'; console.log(JSON.stringify(contracts.map(({id,api,variants,tokenRoles})=>({id,api,variants,tokenRoles}))));`],scratch).toString();
    const frozen='// GENERATED experiment-only runtime dependency. Not maintained design authority.\nexport const contracts = '+JSON.stringify(JSON.parse(runtime),null,2)+' as const;\n';
    await mkdir(destination,{recursive:true}); created=true;
    const initial=join(destination,'coordinator/initial'); await mkdir(initial,{recursive:true});
    const committed=command('git',['ls-tree','-r','--name-only',SOURCE_COMMIT],repository).toString().trim().split('\n');
    const copied=committed.filter(p=>p.startsWith('src/') || ['.editorconfig','index.html','tests/components.test.tsx'].includes(p));
    for (const path of copied) await write(initial,path,await readFile(join(scratch,path)));
    let bridge=await readFile(join(initial,'src/components/contract.ts'),'utf8');
    assert.equal(bridge.split('../../genome/components/contracts.ts').length,2,'Pinned contract import changed');
    bridge=bridge.replace('../../genome/components/contracts.ts','./runtime-contracts.ts');
    await write(initial,'src/components/contract.ts',bridge);
    await write(initial,'src/components/runtime-contracts.ts',frozen);
    const css=await readFile(join(scratch,'generated/forma-tokens.css'));
    await write(initial,'generated/forma-tokens.css',css);
    const pkg=JSON.parse(await readFile(join(scratch,'package.json'),'utf8'));
    pkg.name='forma-implementation-fixture';
    pkg.scripts={dev:'vite',build:'npm run typecheck && vite build',typecheck:'tsc --noEmit',test:'node --import tsx --test tests/*.test.ts*'};
    await write(initial,'package.json',serialize(pkg));
    const lockText=await readFile(join(scratch,'package-lock.json'));
    const lock=JSON.parse(lockText.toString()); lock.name=pkg.name; lock.packages[''].name=pkg.name;
    await write(initial,'package-lock.json',serialize(lock));
    const tsconfig=JSON.parse(await readFile(join(scratch,'tsconfig.json'),'utf8'));
    tsconfig.include=['src','tests','vite.config.ts'];
    await write(initial,'tsconfig.json',serialize(tsconfig));
    await write(initial,'vite.config.ts',`import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  build: { sourcemap: false },
  server: { host: '127.0.0.1', fs: { strict: true, allow: [fileURLToPath(new URL('.', import.meta.url))] }, sourcemapIgnoreList: () => true },
});
`);
    await write(initial,'.gitignore','node_modules/\ndist/\n*.tsbuildinfo\n.DS_Store\n');
    await write(initial,'TASK.md',TASK);
    await write(initial,'SUPPLIED_CONTEXT.md','');
    await write(initial,'README.md',`# Forma implementation fixture

Disposable local implementation environment. Read TASK.md for the task.

Use Node.js 22.18+ and npm. Run npm ci to install the locked dependencies, npm run dev for the local preview, npm run typecheck, npm test, and npm run build for verification.

The CSS and runtime component data are frozen dependencies for this fixture. No generation step or access to another project is needed.
`);
    const files=await inventory(initial);
    const common={...files}; delete common['SUPPLIED_CONTEXT.md'];
    const manifest: Manifest={
      sourceCommit:SOURCE_COMMIT,runId:`${SOURCE_COMMIT.slice(0,12)}-${treeHash(common).slice(0,12)}-${sha(packet).slice(0,12)}`,
      harnessSha256:sha(await readFile(fileURLToPath(import.meta.url))),fixtureHash:treeHash(common),taskHash:sha(TASK),
      baselineContextHash:sha(''),genomeInformedContextHash:sha(packet),compiledGenomeHash:sha(compiled),frozenRuntimeHash:sha(frozen),cssHash:sha(css),
      dependencyLockHash:files['package-lock.json'],sourceDependencyLockHash:sha(lockText),files,
      expectedDifference:['SUPPLIED_CONTEXT.md'],modelSettings:null,modelFamilyForLaterRun:'Astra (exact model and effort/settings must be recorded before execution)',
      exportRuntime:{node:process.version,npm:command('npm',['--version'],scratch).toString().trim()},
    };
    await write(destination,'coordinator/approved-context.md',packet);
    await write(destination,'coordinator/manifest.json',serialize(manifest));
    for (const condition of conditions) { await cp(initial,join(destination,condition),{recursive:true}); await mkdir(join(destination,'results',condition),{recursive:true}); }
    await write(destination,'genome-informed/SUPPLIED_CONTEXT.md',packet);
    await verifyExperiment(destination);
    return manifest;
  } catch(e) { if(created) await rm(destination,{recursive:true,force:true}); throw e; }
  finally { await rm(scratch,{recursive:true,force:true}); }
}

export async function verifyExperiment(root:string) {
  const m:Manifest=JSON.parse(await readFile(join(root,'coordinator/manifest.json'),'utf8'));
  assert.equal(m.sourceCommit,SOURCE_COMMIT,'Wrong pinned state');
  assert.equal(sha(await readFile(join(root,'coordinator/approved-context.md'))),m.genomeInformedContextHash,'Approved packet was changed');
  const initial=await inventory(join(root,'coordinator/initial'));
  assert.deepEqual(initial,m.files,'Starting reference changed');
  const common={...initial}; delete common['SUPPLIED_CONTEXT.md'];
  assert.equal(treeHash(common),m.fixtureHash); assert.equal(initial['TASK.md'],m.taskHash);
  const forbidden=/^(genome|docs|adapters|scripts|\.git)(\/|$)|(^|\/)forma-genome\.json$|(^|\/)AGENTS\.md$/;
  for (const condition of conditions) {
    const path=join(root,condition); const files=await inventory(path,true);
    const expected:Record<string,string>={...m.files,'SUPPLIED_CONTEXT.md':condition==='baseline'?m.baselineContextHash:m.genomeInformedContextHash};
    assert.deepEqual(files,expected,`${condition}: unexpected file/content difference`);
    for (const file of Object.keys(files)) {
      assert.ok(!forbidden.test(file),`Excluded material: ${file}`);
      if (file==='SUPPLIED_CONTEXT.md') continue;
      const text=await readFile(join(path,file),'utf8');
      assert.ok(!text.includes(repository) && !text.includes('forma-private-export-'),`External path leaked: ${file}`);
      if (/\.(ts|tsx|css)$/.test(file)) {
        assert.ok(!/(?:from\s*|import\s*)['"][^'"]*(?:\/genome\/|\/adapters\/|\/scripts\/)/.test(text),`Excluded runtime import: ${file}`);
        assert.ok(!text.includes('sourceMappingURL=file:') && !text.includes('/@fs/'),`External source map path: ${file}`);
      }
    }
    const frozen=await readFile(join(path,'src/components/runtime-contracts.ts'),'utf8');
    const data=JSON.parse(frozen.slice(frozen.indexOf('= ')+2,frozen.lastIndexOf(' as const;')));
    for (const record of data) assert.deepEqual(Object.keys(record).sort(),['api','id','tokenRoles','variants']);
    assert.equal(files['package-lock.json'],m.dependencyLockHash);
  }
  return m;
}

/** Run ordinary verification only; never dispatch an implementation task. */
export async function validateFixtures(root:string) {
  await verifyExperiment(root);
  const results:Record<string,unknown>={};
  for (const condition of conditions) {
    const cwd=resolve(root,condition),logs=join(root,'coordinator/validation',condition);
    await mkdir(logs,{recursive:true});
    for (const args of [['ci','--offline','--cache',resolve(root,'coordinator/npm-cache'),'--no-audit','--no-fund'],['run','typecheck'],['test'],['run','build']]) {
      const name=args[0]==='run'?args[1]:args[0];
      try { await writeFile(join(logs,name+'.log'),command('npm',args,cwd)); }
      catch(e) { const failure=e as {stdout?:Buffer;stderr?:Buffer}; await writeFile(join(logs,name+'.log'),Buffer.concat([failure.stdout??Buffer.alloc(0),failure.stderr??Buffer.alloc(0)])); throw e; }
    }
    // Installed dependencies may use local .bin links, but none may leave the sandbox.
    const dependencyFiles:Record<string,string>={};
    async function checkLinks(dir:string) {
      for(const name of await readdir(dir)) {
        const file=join(dir,name),stat=await lstat(file);
        if(stat.isSymbolicLink()) { const target=await realpath(file); assert.ok(target.startsWith(cwd+'/'),`Dependency link escapes fixture: ${file}`); dependencyFiles[relative(cwd,file)]=sha('symlink:'+relative(cwd,target)); }
        else if(stat.isDirectory()) await checkLinks(file);
        else dependencyFiles[relative(cwd,file)]=sha(await readFile(file));
      }
    }
    await checkLinks(join(cwd,'node_modules'));
    const dist=await inventory(join(cwd,'dist'));
    for (const file of Object.keys(dist)) {
      assert.ok(!file.endsWith('.map'),`Unexpected production source map: ${file}`);
      if(/\.(js|css|html)$/.test(file)) {
        const text=await readFile(join(cwd,'dist',file),'utf8');
        assert.ok(!text.includes(repository) && !text.includes('forma-private-export-'),'Build exposed external source path');
        for(const marker of ['clarity-before-density','legacy-form-label-exception','partially-automated-architectural','REQUIRED / GOVERNED CONTEXT']) assert.ok(!text.includes(marker),`Excluded knowledge in browser bundle: ${marker}`);
      }
    }
    results[condition]={buildHash:treeHash(dist),dependenciesHash:treeHash(dependencyFiles),devServer:await probeDevServer(cwd)};
  }
  // Runtime .bin symlinks are checked separately; lockfile + clean npm ci establish dependency input equality.
  assert.equal((results.baseline as {buildHash:string}).buildHash,(results['genome-informed'] as {buildHash:string}).buildHash,'Initial production builds differ');
  assert.equal((results.baseline as {dependenciesHash:string}).dependenciesHash,(results['genome-informed'] as {dependenciesHash:string}).dependenciesHash,'Installed dependency bytes differ');
  await verifyExperiment(root);
  await write(root,'coordinator/validation/summary.json',serialize({sourceCommit:SOURCE_COMMIT,results,commands:['npm ci --offline --no-audit --no-fund','npm run typecheck','npm test','npm run build']}));
  return results;
}

/** Probe development exposure without starting a Codex implementation session. */
export async function probeDevServer(cwd:string) {
  const child=spawn(process.execPath,['node_modules/vite/bin/vite.js','--port','0'],{cwd,env:{...process.env,NODE_PATH:'',NODE_OPTIONS:''},stdio:['ignore','pipe','pipe']});
  try {
    const origin=await new Promise<string>((accept,reject)=>{
      let output=''; child.stderr.on('data',data=>{output+=data.toString();}); const timeout=setTimeout(()=>reject(new Error('Preview startup timed out')),15000);
      child.once('error',e=>{clearTimeout(timeout);reject(e);});
      child.once('exit',code=>{clearTimeout(timeout);reject(new Error(`Preview exited: ${code}: ${output}`));});
      child.stdout.on('data',data=>{output+=data.toString(); const match=output.match(/http:\/\/127\.0\.0\.1:\d+/); if(match){clearTimeout(timeout);accept(match[0]);}});
    });
    const forbidden='/@fs'+join(repository,'genome/foundations/tokens.json');
    const outside=await fetch(origin+forbidden);
    assert.equal(outside.status,403,'Dev server must refuse canonical sources');
    const sibling=join(dirname(cwd),cwd.endsWith('/baseline')?'genome-informed':'baseline','SUPPLIED_CONTEXT.md');
    assert.equal((await fetch(origin+'/@fs'+sibling)).status,403,'Dev server must refuse other condition');
    const bridge=await (await fetch(origin+'/src/components/contract.ts')).text();
    assert.ok(bridge.includes('runtime-contracts') && !bridge.includes('../../genome/'),'Dev bridge exposes authored dependency');
    const frozen=await (await fetch(origin+'/src/components/runtime-contracts.ts')).text();
    for(const marker of ['humanReview','semantics','unsupportedProps','clarity-before-density']) assert.ok(!frozen.includes(marker),`Dev module exposed extra authority: ${marker}`);
    // Excluded URL paths may return SPA HTML, but never the excluded artifact.
    for(const path of ['/genome/foundations/tokens.json','/generated/forma-genome.json','/adapters/codex/context.ts']) {
      const response=await (await fetch(origin+path)).text();
      assert.ok(!response.includes('"$type"') && !response.includes('"relationships"') && !response.includes('renderContext'),'Excluded source exposed by preview');
    }
    return {canonicalSourceStatus:outside.status,otherConditionStatus:403,runtimeOnly:true};
  } finally {
    if(child.exitCode===null) { const exited=new Promise<void>(resolve=>child.once('exit',()=>resolve())); child.kill('SIGTERM'); await exited; }
  }
}

export async function preserveResult(root:string,condition:typeof conditions[number]) {
  assert.ok(conditions.includes(condition),'Unknown condition');
  const output=join(root,'results',condition,'implementation'); await absent(output);
  const current=await inventory(join(root,condition),true);
  await mkdir(output,{recursive:true});
  for(const file of Object.keys(current)) await write(output,file,await readFile(join(root,condition,file)));
  // No Git repo is created. --no-index compares complete file snapshots, including new files.
  const comparison=await mkdtemp(join(tmpdir(),'forma-result-comparison-'));
  try {
    await cp(join(root,'coordinator/initial'),join(comparison,'before'),{recursive:true});
    if(condition==='genome-informed') await cp(join(root,'coordinator/approved-context.md'),join(comparison,'before/SUPPLIED_CONTEXT.md'));
    await cp(output,join(comparison,'after'),{recursive:true});
    let diff:Buffer;
    try { diff=command('git',['diff','--no-index','--binary','--','before','after'],comparison); }
    catch(e) { const failure=e as {status?:number;stdout?:Buffer}; assert.equal(failure.status,1,'Diff command failed'); diff=failure.stdout!; }
    await write(root,`results/${condition}/implementation.diff`,diff);
    await write(root,`results/${condition}/files.json`,serialize(current));
    for(const dir of ['transcript','tool-logs','checks','screenshots']) await mkdir(join(root,'results',condition,dir),{recursive:true});
  } finally { await rm(comparison,{recursive:true,force:true}); }
}

if(process.argv[1] && import.meta.url===pathToFileURL(await realpath(process.argv[1])).href) {
  const [action,root,condition]=process.argv.slice(2);
  assert.ok(root && isAbsolute(root),'Supply an absolute export directory');
  if(action==='export') console.log(serialize(await exportExperiment(root)));
  else if(action==='verify') { await verifyExperiment(root); console.log('Initial fixtures verified; only SUPPLIED_CONTEXT.md differs.'); }
  else if(action==='validate') console.log(await validateFixtures(root));
  else if(action==='preserve') await preserveResult(root,condition as typeof conditions[number]);
  else throw new Error('Use export, verify, validate, or preserve');
}
