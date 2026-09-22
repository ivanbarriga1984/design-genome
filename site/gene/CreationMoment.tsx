import { useEffect, useRef, useState, type CSSProperties } from 'react';

const copy=['Structuring your Gene','Connecting the knowledge','Your first Gene is ready'];
// Abstract presentation only. These nodes do not assert relationships in the Gene.
const nodes=[[70,70,-18,-10],[180,45,8,-15],[290,80,18,-8],[85,180,-15,12],[185,140,0,14],[280,185,16,10]];
export function CreationMoment({onComplete}:{onComplete:()=>void}){
  const [phase,setPhase]=useState(0), region=useRef<HTMLElement>(null);
  useEffect(()=>{
    region.current?.focus({preventScroll:true});
    region.current?.scrollIntoView?.({block:'start',behavior:'instant'});
    const timers=[setTimeout(()=>setPhase(1),900),setTimeout(()=>setPhase(2),1800),setTimeout(onComplete,2600)];
    return()=>timers.forEach(clearTimeout);
  },[onComplete]);
  return <section ref={region} tabIndex={-1} className="gene-creation" data-phase={phase} aria-label="Structuring your authored knowledge">
    <svg viewBox="0 0 360 240" aria-hidden="true" focusable="false">
      <g className="gene-creation-lines">{[[0,1],[1,2],[0,3],[1,4],[2,4],[3,4],[4,5]].map(([a,b])=><path key={`${a}-${b}`} pathLength="1" d={`M${nodes[a][0]} ${nodes[a][1]}L${nodes[b][0]} ${nodes[b][1]}`}/>)}</g>
      {nodes.map(([x,y,dx,dy],i)=><circle key={i} cx={x} cy={y} r={i===4?7:5} style={{'--node-x':`${dx}px`,'--node-y':`${dy}px`} as CSSProperties}/>)}
    </svg>
    <h1 aria-live="polite" aria-atomic="true">{copy[phase]}</h1>
  </section>;
}
