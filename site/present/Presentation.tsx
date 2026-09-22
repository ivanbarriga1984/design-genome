import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Scene } from './Scenes';
import { move, position, sceneUrl, scenes, stageFit } from './model';
type Overlay='overview'|'help'|'calibration'|null;
const shortcuts=[['→ / Space','Next beat, then scene'],['←','Previous beat, then scene'],['Shift + → / ←','Next / previous scene'],['O','Overview'],['C','Calibration'],['F','Fullscreen'],['?','Help'],['Esc','Close utility / native fullscreen exit']];
export default function Presentation(){
  const location=useLocation(),navigate=useNavigate(), p=position(location.pathname,location.search);
  const [size,setSize]=useState(()=>({width:window.innerWidth,height:window.innerHeight}));
  const [overlay,setOverlay]=useState<Overlay>(null),[notice,setNotice]=useState('');
  const viewport=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null),focusReturn=useRef<HTMLElement|null>(null);
  const scale=stageFit(size.width,size.height);
  function go(next:ReturnType<typeof position>){setOverlay(null);navigate(sceneUrl(next));}
  function toggle(mode:Overlay){setOverlay(current=>current===mode?null:mode);}
  async function fullscreen(){try{if(document.fullscreenElement){await document.exitFullscreen();}else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen();}else{setNotice('Fullscreen is unavailable here. Use the browser’s fullscreen control; scale-to-fit remains active.');}}catch{setNotice('Fullscreen was not allowed. Use the browser’s fullscreen control; scale-to-fit remains active.');}}
  useEffect(()=>{const update=()=>setSize({width:window.innerWidth,height:window.innerHeight});window.addEventListener('resize',update);const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(update):null;if(viewport.current)observer?.observe(viewport.current);update();return()=>{window.removeEventListener('resize',update);observer?.disconnect();};},[]);
  useEffect(()=>{const canonical=sceneUrl(p);if(location.pathname+location.search!==canonical)navigate(canonical,{replace:true});},[location.pathname,location.search,navigate,p.scene,p.beat]);
  useEffect(()=>{stage.current?.focus({preventScroll:true});setNotice('');},[p.scene,p.beat]);
  useEffect(()=>{
    const d=dialog.current;if(!overlay||!d)return;
    focusReturn.current=document.activeElement as HTMLElement;d.showModal();
    d.querySelector<HTMLButtonElement>(overlay==='overview'?'[aria-current="true"]':'button')?.focus();
    return()=>{d.close();const target=focusReturn.current; if(target?.isConnected)target.focus({preventScroll:true});};
  },[overlay]);
  useEffect(()=>{
    function key(event:KeyboardEvent){
      if(event.altKey||event.ctrlKey||event.metaKey||event.repeat)return;
      const target=event.target instanceof HTMLElement?event.target:null;
      if(target?.closest('input,textarea,select,[contenteditable="true"]'))return;
      const k=event.key.toLowerCase();
      if(k==='escape'){if(overlay)setOverlay(null);return;}
      if(k==='o'||k==='c'||k==='?'){event.preventDefault();toggle(k==='o'?'overview':k==='c'?'calibration':'help');return;}
      if(k==='f'){event.preventDefault();void fullscreen();return;}
      if(overlay)return;
      if(k===' ' && target?.closest('button,a,summary'))return;
      if(k==='arrowright'||k===' '){event.preventDefault();go(move(p,1,event.shiftKey));}
      if(k==='arrowleft'){event.preventDefault();go(move(p,-1,event.shiftKey));}
    }
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  });
  return <div className="pr-viewport" ref={viewport}>
    <div className="pr-frame" style={{width:1600*scale,height:900*scale}}>
      <main id="presentation" ref={stage} tabIndex={-1} className={`pr-stage ${[3,7,9,15,21].includes(p.scene)?'pr-dark':''}`} style={{transform:`scale(${scale})`}} aria-label={`Scene ${p.scene}: ${scenes[p.scene-1].title}, beat ${p.beat} of ${scenes[p.scene-1].beats}`}>
        <div className={`pr-content pr-scene-${p.scene}`} key={p.scene}><Scene scene={p.scene} beat={p.beat}/></div>
        <footer className="pr-controls"><span className="pr-brand">DG.</span><span>{scenes[p.scene-1].act}</span><nav aria-label="Presentation controls"><button onClick={()=>go(move(p,-1))} disabled={p.scene===1&&p.beat===1} aria-label="Previous beat">←</button><button onClick={()=>toggle('overview')} aria-label="Open scene overview">{String(p.scene).padStart(2,'0')} / 22</button><button onClick={()=>go(move(p,1))} disabled={p.scene===22} aria-label="Next beat">→</button><button onClick={()=>void fullscreen()} aria-label="Toggle fullscreen">F</button></nav></footer>
        {notice&&<p role="status" className="pr-notice">{notice}</p>}
      </main>
    </div>
    {overlay&&<dialog ref={dialog} className={`pr-utility pr-utility-${overlay}`} aria-labelledby="pr-utility-title" onCancel={()=>setOverlay(null)} style={{'--pr-scale':scale} as CSSProperties}>
      <div className="pr-utility-stage" style={{transform:`scale(${scale})`}}>
        {overlay==='calibration'?<><div className="pr-stage-boundary"/><div className="pr-safe-boundary"/>{['tl','tr','bl','br'].map(c=><span key={c} className={`pr-corner pr-corner-${c}`}>+</span>)}<div className="pr-calibration-copy"><h2 id="pr-utility-title">Framing calibration</h2><p>Logical stage: 1600 × 900</p><p>Viewport: {size.width} × {size.height} · Scale: {scale.toFixed(4)}</p><p>Safe area: 6% horizontal · 7% vertical</p><p>If all four corner markers and the entire safe-area rectangle are visible, presentation framing is safe.</p><button onClick={()=>setOverlay(null)}>Close calibration · C / Esc</button></div></>:<div className="pr-utility-content"><header><h2 id="pr-utility-title">{overlay==='overview'?'Presentation overview':'Keyboard controls'}</h2><button onClick={()=>setOverlay(null)}>Close · Esc</button></header>{overlay==='overview'?<ol className="pr-index">{scenes.map((s,i)=><li key={s.title}><button aria-current={p.scene===i+1?'true':undefined} onClick={()=>go({scene:i+1,beat:1})}><span>{String(i+1).padStart(2,'0')}</span>{s.title}</button></li>)}</ol>:<dl className="pr-help">{shortcuts.map(([key,meaning])=><div key={key}><dt>{key}</dt><dd>{meaning}</dd></div>)}</dl>}</div>}
      </div>
    </dialog>}
  </div>;
}
