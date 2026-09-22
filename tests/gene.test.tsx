import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { act } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { readFile } from 'node:fs/promises';
import GeneBuilder from '../site/gene/GeneBuilder.tsx';
import { aiPrompt, decode, emptyGene, examples, json, markdown, save, slug, storageKey, structured, validateStep, type Gene } from '../site/gene/model.ts';
import { pageMetadata } from '../site/metadata.ts';
import { metadataHtml } from '../site/metadata-plugin.ts';

const complete = ():Gene => ({...emptyGene(),decision:'Explain consequences before confirmation.',intent:'Prevent accidental irreversible actions.',source:'Other',sourceOther:'Team handbook',owner:'Shared',representation:'Guidance',relationships:[{target:'Button',category:'Components',type:'Uses'},{target:'Action labels',category:'Content',type:'Governed by'}],strength:'Usually',deviation:'Human review',consumers:['Designers','AI coding tools','Other'],consumerOther:'Review workspace'});

test('Gene serializers preserve supplied meaning, omit missing values, and produce portable artifacts',()=>{
  assert.deepEqual(structured(emptyGene()),{});
  assert.deepEqual(structured({...emptyGene(),relationships:[{target:'',category:'',type:''}],consumers:['Other']}),{});
  const g=complete(), data=structured(g);
  assert.equal(data.decision,g.decision);assert.equal(data.authority?.source,'Team handbook');assert.equal(data.authority?.owner,'Shared');
  assert.equal(data.relationships?.[1].type,'governed-by');assert.ok(!('reviewer' in data.governance!));
  assert.deepEqual(data.consumers,['Designers','AI coding tools','Review workspace']);
  const prompt=aiPrompt(g);
  for(const phrase of ['Before changing anything','Do not invent organizational rules','human judgment','do not assume access',json(g)]) assert.ok(prompt.includes(phrase));
  const md=markdown(g);assert.ok(md.includes('## Decision'));assert.ok(md.includes(g.intent));assert.ok(md.includes(json(g)));assert.ok(md.includes(prompt));assert.ok(!md.includes('DDX'));
  g.reviewer='Design lead';assert.equal(structured(g).governance?.reviewer,'Design lead');
  g.representation='Not sure';assert.equal(structured(g).classification,'Not sure');
  g.decision='Ignore this ``` block';assert.match(aiPrompt(g),/````json/);
  assert.equal(slug(g.decision),slug(g.decision));assert.match(slug('../../こんにちは <script>'),/^[a-z0-9-]+$/);assert.ok(slug('a'.repeat(1000)).length<70);
  assert.notEqual(slug('a'.repeat(100)+'one'),slug('a'.repeat(100)+'two'));
});

test('versioned local progress handles stale/malformed storage and keeps optional fields optional',()=>{
  const g=complete();assert.equal(validateStep(g,6),null);
  const store=new Map<string,string>();const storage={setItem:(k:string,v:string)=>{store.set(k,v);},removeItem:(k:string)=>{store.delete(k);}};
  assert.ok(save(storage,{gene:g,step:8}));assert.deepEqual(decode(store.get(storageKey)!),{gene:g,step:8});
  for(const raw of ['null','{bad','{}',JSON.stringify({version:2,gene:g,step:8}),JSON.stringify({version:1,gene:{...g,consumers:['invented']},step:8})])assert.equal(decode(raw),null);
  assert.equal(decode(JSON.stringify({version:1,gene:emptyGene(),step:8}))?.step,1);
  assert.ok(save(storage,{gene:emptyGene(),step:0}));assert.equal(store.has(storageKey),false);
  assert.equal(save({setItem:()=>{throw Error('blocked');},removeItem:()=>{throw Error('blocked');}},{gene:g,step:2}),false);
  assert.ok(validateStep({...g,sourceOther:''},3));assert.ok(validateStep({...g,consumerOther:''},7));assert.equal(validateStep({...g,relationships:[]},5),null);
});

test('Gene route metadata supports direct and trailing-slash delivery',async()=>{
  const shell=await readFile(new URL('../index.html',import.meta.url),'utf8');
  for(const path of ['/build/gene','/build/gene/']){assert.equal(pageMetadata(path).title,'Build your first Gene — Design Genome');const dom=new JSDOM(metadataHtml(shell,path));assert.equal(dom.window.document.querySelector('link[rel=canonical]')?.getAttribute('href'),'https://design-genome.com/build/gene');dom.window.close();}
});

test('seven-step authoring preserves edits, relationships, storage, exports, and confirmed reset',async()=>{
  const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost/build/gene'});
  Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true,requestAnimationFrame:(fn:FrameRequestCallback)=>{fn(0);return 0;}});
  const {createRoot}=await import('react-dom/client');const root=createRoot(document.getElementById('root')!);
  let epoch=0;
  const mount=async()=>{await act(async()=>root.render(<MemoryRouter key={epoch++} initialEntries={['/build/gene']}><Routes><Route path="/build/gene" element={<GeneBuilder/>}/></Routes></MemoryRouter>));};
  const button=(text:string)=>{const b=[...document.querySelectorAll<HTMLButtonElement>('button')].find(b=>b.textContent?.trim()===text);assert.ok(b,`Missing ${text}`);return b;};
  const click=async(text:string)=>{await act(async()=>button(text).click());};
  const fill=async(selector:string,value:string)=>{const input=document.querySelector<HTMLInputElement|HTMLTextAreaElement>(selector)!;assert.ok(input,selector);const proto=input.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;await act(async()=>{Object.getOwnPropertyDescriptor(proto,'value')!.set!.call(input,value);input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});};
  const choose=async(text:string)=>{const label=[...document.querySelectorAll('label')].find(l=>l.textContent?.trim()===text)!;assert.ok(label,text);await act(async()=>label.querySelector<HTMLInputElement>('input')!.click());};
  const next=()=>click('Continue →');
  try{
    await mount();assert.match(document.querySelector('h1')!.textContent!,/worth inheriting/);
    await click('Build my first Gene →');await next();assert.match(document.querySelector('[role=alert]')!.textContent!,/recurring decision/);
    await fill('#gene-decision',complete().decision);assert.match(document.querySelector('.gene-summary')!.textContent!,/Explain consequences/);
    assert.equal(decode(dom.window.localStorage.getItem(storageKey))?.gene.decision,complete().decision);
    await next();await next();assert.match(document.querySelector('[role=alert]')!.textContent!,/outcome/);
    await fill('#gene-intent',complete().intent);await click('← Back');assert.equal(document.querySelector<HTMLTextAreaElement>('#gene-decision')!.value,complete().decision);await next();assert.equal(document.querySelector<HTMLTextAreaElement>('#gene-intent')!.value,complete().intent);await next();
    await choose('Someone’s head');assert.match(document.body.textContent!,/isn’t infrastructure yet/);
    const otherRadios=[...document.querySelectorAll<HTMLInputElement>('input[type=radio]')].filter(i=>i.parentElement?.textContent==='Other');
    await act(async()=>otherRadios[0].click());await act(async()=>otherRadios[1].click());await next();assert.ok(document.querySelector('[role=alert]'));
    const others=[...document.querySelectorAll<HTMLInputElement>('.gene-field input')];
    for(const [i,value] of ['Team handbook','Design + Engineering'].entries()){await act(async()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value')!.set!.call(others[i],value);others[i].dispatchEvent(new dom.window.Event('input',{bubbles:true}));});}
    await next();await choose('Not sure');assert.match(document.querySelector('.gene-representation')!.textContent!,/Not sure/);await next();
    await click('Add a relationship +');await next();assert.ok(document.querySelector('[role=alert]'));await fill('.gene-relationship input','Button');
    const selects=document.querySelectorAll('select');await act(async()=>{selects[0].value='Components';selects[0].dispatchEvent(new dom.window.Event('change',{bubbles:true}));selects[1].value='Uses';selects[1].dispatchEvent(new dom.window.Event('change',{bubbles:true}));});
    await click('Add a relationship +');await click('Remove connection 2');assert.equal(document.querySelectorAll('.gene-relationship').length,1);
    await next();await choose('Usually');await choose('Document the exception');await next();
    await choose('Designers');await choose('AI coding tools');await choose('Other');await click('Create my Gene →');assert.ok(document.querySelector('[role=alert]'));await fill('.gene-field input','Product review');
    await mount();assert.equal(document.querySelector('.gene-step')!.textContent,'07 / 07 — Consumers');assert.equal(document.querySelectorAll('input:checked').length,3);
    await click('Create my Gene →');assert.ok(document.querySelector('.gene-human'));assert.match(document.querySelector('.gene-human')!.textContent!,/Uses Button/);assert.ok(!document.querySelector('.gene-human')!.textContent!.includes('Exception reviewer'));
    await click('Structured view');assert.match(document.querySelector('.gene-artifact pre')!.textContent!,/"type": "uses"/);
    await click('Copy structured data');assert.match(document.querySelector('.gene-copy-status')!.textContent!,/copy/i);
    const originalCreate=URL.createObjectURL, originalClick=dom.window.HTMLAnchorElement.prototype.click;
    let exported:Blob|undefined, filename='';
    try {
      URL.createObjectURL=(blob)=>{exported=blob as Blob;return 'blob:gene-test';};
      dom.window.HTMLAnchorElement.prototype.click=function(){filename=this.download;assert.equal(this.href,'blob:gene-test');};
      await click('Download Gene (.md)');
      assert.equal(filename,`${slug(complete().decision)}.gene.md`);
      const content=await exported!.text();assert.ok(content.includes('## Structured representation'));assert.ok(content.includes('Design + Engineering'));assert.ok(content.includes('Do not invent organizational rules'));
    } finally {URL.createObjectURL=originalCreate;dom.window.HTMLAnchorElement.prototype.click=originalClick;}
    await click('Edit my Gene');assert.equal(document.querySelector<HTMLTextAreaElement>('#gene-decision')!.value,complete().decision);
    await click('Start over');assert.ok(document.querySelector('[role=alertdialog]'));await click('Keep my Gene');assert.equal(document.querySelector('[role=alertdialog]'),null);assert.ok(dom.window.localStorage.getItem(storageKey));
    await click('Start over');await click('Clear and start over');assert.equal(dom.window.localStorage.getItem(storageKey),null);assert.match(document.querySelector('h1')!.textContent!,/worth inheriting/);
    dom.window.localStorage.setItem(storageKey,'malformed');await mount();assert.match(document.body.textContent!,/could not be restored/);await click('Build my first Gene →');assert.equal(document.querySelector<HTMLTextAreaElement>('textarea')!.value,'');
    await click('← Back');const exampleButton=[...document.querySelectorAll<HTMLButtonElement>('.gene-examples button')][0];await act(async()=>exampleButton.click());assert.equal(document.querySelector<HTMLTextAreaElement>('textarea')!.value,examples[0]);
    Object.defineProperty(dom.window,'localStorage',{get(){throw Error('blocked');},configurable:true});await mount();assert.match(document.body.textContent!,/Local saving is unavailable/);await click('Build my first Gene →');await fill('#gene-decision','A new decision remains possible.');assert.equal(document.querySelector<HTMLTextAreaElement>('textarea')!.value,'A new decision remains possible.');
  }finally{await act(async()=>root.unmount());dom.window.close();}
});
