import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { JSDOM } from 'jsdom';
import { act } from 'react';
import qrcode from 'qrcode-generator';
import { scenes, position, move, sceneUrl, stageFit, returnScene, activityUrl } from '../site/present/model.ts';
import { Scene } from '../site/present/Scenes.tsx';
import Presentation from '../site/present/Presentation.tsx';
import qr from '../site/present/qr.json';
import { pageMetadata } from '../site/metadata.ts';
test('all scene and beat positions round-trip, reverse and clamp without losing URL recovery',()=>{
  assert.equal(scenes.length,22);
  for(let scene=1;scene<=22;scene++)for(let beat=1;beat<=scenes[scene-1].beats;beat++){
    const p={scene,beat},url=new URL(sceneUrl(p),'http://local');assert.deepEqual(position(url.pathname,url.search),p);
    if(scene!==22)assert.deepEqual(move(move(p,1),-1),p);
    if(scene>1||beat>1)assert.deepEqual(move(move(p,-1),1),p);
    assert.equal(move(p,1,true).beat,1);
  }
  assert.deepEqual(position('/present/99','?beat=999'),{scene:22,beat:1});assert.deepEqual(position('/present/no','?beat=bad'),{scene:1,beat:1});
  assert.deepEqual(move({scene:1,beat:1},-1),{scene:1,beat:1});
  for(const [w,h] of [[1600,900],[1440,900],[1000,800],[390,844]]){const scale=stageFit(w,h);assert.ok(1600*scale<=w&&900*scale<=h);}
  assert.equal(pageMetadata('/present/09').title,'DDX Presentation — Design Genome');
});
test('22 scenes render authored beats with honest adapter boundaries and local QR destinations',()=>{
  for(let scene=1;scene<=22;scene++)for(let beat=1;beat<=scenes[scene-1].beats;beat++){
    const dom=new JSDOM(renderToStaticMarkup(<MemoryRouter><Scene scene={scene} beat={beat}/></MemoryRouter>));
    assert.ok(dom.window.document.querySelector('h1'));for(const hidden of dom.window.document.querySelectorAll('[data-visible=false].pr-reveal')){assert.equal(hidden.getAttribute('aria-hidden'),'true');assert.ok(hidden.hasAttribute('inert'));}dom.window.close();
  }
  const adapter=renderToStaticMarkup(<MemoryRouter><Scene scene={15} beat={5}/></MemoryRouter>);assert.ok(adapter.includes('Real reference implementation'));assert.equal(adapter.match(/Conceptual example only/g)?.length,2);
  for(const data of Object.values(qr)){const code=qrcode(0,'M');code.addData(data.url,'Byte');code.make();const count=code.getModuleCount();assert.equal(data.size,count+8);let path='';for(let y=0;y<count;y++)for(let x=0;x<count;x++)if(code.isDark(y,x))path+=`M${x+4} ${y+4}h1v1h-1z`;assert.equal(data.path,path);}
  assert.equal(qr.workshop.url,'https://design-genome.com/workshop');assert.equal(qr.gene.url,'https://design-genome.com/build/gene');assert.equal(qr.home.url,'https://design-genome.com');
});
test('presenter return destinations are explicit and absent on normal attendee URLs',()=>{
  for(const [path,scene] of [['/workshop',12],['/build/gene',18],['/reference/machine-context',17]] as const){assert.equal(returnScene(path,''),null);assert.equal(returnScene(path,new URL(activityUrl(path),'http://local').search),scene);assert.equal(returnScene(path,'?presentReturn=https://evil.invalid'),null);}
  assert.equal(returnScene('/build','?presentReturn=18'),null);
});
test('keyboard beats, direct scenes, overview, calibration, help and fullscreen fallback stay operable',async()=>{
  const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost/present/03'});
  Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
  dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};dom.window.HTMLDialogElement.prototype.close=function(){this.open=false;};
  const {createRoot}=await import('react-dom/client');const root=createRoot(document.getElementById('root')!);
  const key=async(key:string,shiftKey=false)=>act(async()=>document.querySelector('main')!.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key,shiftKey,bubbles:true})));
  const label=()=>document.querySelector('main')!.getAttribute('aria-label')!;
  try{
    await act(async()=>root.render(<MemoryRouter initialEntries={['/present/03']}><Presentation/></MemoryRouter>));
    assert.match(label(),/beat 1 of 2/);await key(' ');assert.match(label(),/beat 2 of 2/);await key('ArrowRight');assert.match(label(),/Scene 4/);await key('ArrowLeft');assert.match(label(),/Scene 3.*beat 2/);await key('ArrowRight',true);assert.match(label(),/Scene 4.*beat 1/);
    await key('o');assert.equal(document.querySelectorAll('.pr-index button').length,22);await act(async()=>document.querySelectorAll<HTMLButtonElement>('.pr-index button')[16].click());assert.match(label(),/Scene 17/);assert.equal(document.querySelector('dialog'),null);
    await key('c');assert.ok(document.querySelector('.pr-safe-boundary'));assert.match(document.querySelector('dialog')!.textContent!,/1600 × 900/);await key('Escape');assert.equal(document.querySelector('dialog'),null);
    await key('?');assert.match(document.querySelector('dialog')!.textContent!,/Next beat/);await key('Escape');await key('f');assert.match(document.querySelector('[role=status]')!.textContent!,/Fullscreen is unavailable/);
  }finally{await act(async()=>root.unmount());dom.window.close();}
});
