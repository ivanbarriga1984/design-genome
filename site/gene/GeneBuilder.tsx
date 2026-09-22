import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Fields, questions } from './Fields';
import { aiPrompt, decode, emptyGene, examples, hasProgress, humanSections, json, markdown, save, slug, steps, storageKey, structured, validateStep, type Gene, type Progress } from './model';
function restore() {
  try {
    const raw=window.localStorage.getItem(storageKey), progress=decode(raw);
    return {progress:progress??{gene:emptyGene(),step:0},notice:raw?(progress?'Your locally saved Gene has been restored.':'The saved draft could not be restored. Start a new Gene.'):''};
  } catch {return {progress:{gene:emptyGene(),step:0},notice:'Browser storage is unavailable. You can still build and export in this session.'};}
}
export function HumanView({gene}:{gene:Gene}) {
  return <dl className="gene-human">{humanSections(gene).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}
export function Inventory({gene}:{gene:Gene}) {
  const data=structured(gene);
  const counts:[number,string,string][]=[
    [data.decision?1:0,'decision','decisions'],[data.intent?1:0,'intent','intents'],
    [data.authority?.owner?1:0,'owner','owners'],[data.relationships?.length??0,'relationship','relationships'],
    [data.governance?.strength && data.governance?.deviation?1:0,'governance boundary','governance boundaries'],
    [data.consumers?.length??0,'consumer','consumers'],
  ];
  return <ul className="gene-inventory" aria-label="What you authored">{counts.map(([count,singular,plural])=><li key={singular}>{count} {count===1?singular:plural}</li>)}</ul>;
}
function Summary({gene:g,step,onVisit}:{gene:Gene;step:number;onVisit:(n:number)=>void}) {
  const values=[g.decision,g.intent,[g.source==='Other'?g.sourceOther:g.source,g.owner==='Other'?g.ownerOther:g.owner].filter(Boolean).join(' · '),g.representation,g.relationships.map(r=>r.target).filter(Boolean).join(' · '),[g.strength,g.deviation].filter(Boolean).join(' · '),g.consumers.map(c=>c==='Other'?g.consumerOther:c).join(' · ')];
  return <aside className="gene-summary" aria-label="Your Gene summary"><span className="dg-eyebrow">Your Gene</span><h2>Knowledge taking shape.</h2><ol>{steps.map((title,i)=>{
    const canVisit=Array.from({length:i},(_,j)=>j+1).every(n=>!validateStep(g,n));
    return <li key={title} data-active={step===i+1}><button type="button" aria-current={step===i+1?'step':undefined} disabled={!canVisit} onClick={()=>onVisit(i+1)}><span className="gene-node" aria-hidden="true">{String(i+1).padStart(2,'0')}</span>{title}</button>{values[i] && <p>{values[i]}</p>}{i===4 && !values[i] && step>5 && <p>No connections added yet.</p>}</li>;
  })}</ol><p className="gene-help">Your words. Your authority. Select an earlier step to refine it.</p></aside>;
}
export default function GeneBuilder() {
  const [initial]=useState(restore);
  const [progress,setProgress]=useState<Progress>(initial.progress);
  const {gene,step}=progress;
  const [notice,setNotice]=useState(initial.notice);
  const [storageOK,setStorageOK]=useState(!initial.notice.startsWith('Browser storage'));
  const [error,setError]=useState('');
  const [view,setView]=useState<'human'|'structured'>('human');
  const [confirmReset,setConfirmReset]=useState(false);
  const [feedback,setFeedback]=useState('');
  const [manualCopy,setManualCopy]=useState('');
  const heading=useRef<HTMLHeadingElement>(null), errorRef=useRef<HTMLParagraphElement>(null), cancelReset=useRef<HTMLButtonElement>(null), resetButton=useRef<HTMLButtonElement>(null), copyArea=useRef<HTMLTextAreaElement>(null);
  const previous=useRef(step);
  useEffect(()=>{
    try {setStorageOK(save(window.localStorage,progress));} catch {setStorageOK(false);}
  },[progress]);
  useEffect(()=>{if(previous.current!==step){heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView?.({block:'start',behavior:'instant'});previous.current=step;}},[step]);
  useEffect(()=>{if(confirmReset)cancelReset.current?.focus();},[confirmReset]);
  useEffect(()=>{if(manualCopy){copyArea.current?.focus();copyArea.current?.select();}},[manualCopy]);
  function update(patch:Partial<Gene>){setProgress(p=>({...p,gene:{...p.gene,...patch}}));setError('');setNotice('');}
  function visit(n:number){setProgress(p=>({...p,step:n}));setError('');setFeedback('');setManualCopy('');setView('human');}
  function next(){const message=validateStep(gene,step);if(message){setError(message);requestAnimationFrame(()=>errorRef.current?.focus());return;}visit(step+1);}
  function reset(){setProgress({gene:emptyGene(),step:0});setConfirmReset(false);setError('');setNotice('');setFeedback('');setManualCopy('');setView('human');}
  async function copy(value:string,label:string){try{await navigator.clipboard.writeText(value);setManualCopy('');setFeedback(`${label} copied.`);}catch{setManualCopy(value);setFeedback('Automatic copying is unavailable. Select and copy the text below.');}}
  function download(format:'md'|'json'){
    const isJson=format==='json', content=isJson?json(gene):markdown(gene), label=isJson?'JSON':'Markdown';
    try{const url=URL.createObjectURL(new Blob([content],{type:isJson?'application/json;charset=utf-8':'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`${slug(gene.decision)}.gene.${format}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setFeedback(`${label} download requested.`);}catch{setManualCopy(content);setFeedback(`Download is unavailable. Copy the ${label} below instead.`);}
  }
  const editing=step>0&&step<8;
  return <article className="gene-page dg-wrap">
    <header className="gene-header"><Link to="/build" className="gene-back-link">← Build your own</Link><div className="gene-topline"><span className="dg-eyebrow">Build your first Gene</span>{(hasProgress(gene)||step>0)&&<button ref={resetButton} className="gene-text-button" onClick={()=>hasProgress(gene)?setConfirmReset(true):reset()}>Start over</button>}</div></header>
    {confirmReset && <section className="gene-reset-panel" role="alertdialog" aria-modal="false" aria-labelledby="gene-reset-title" aria-describedby="gene-reset-description" onKeyDown={e=>{if(e.key==='Escape'){setConfirmReset(false);resetButton.current?.focus();}}}><h2 id="gene-reset-title">Clear this Gene and start over?</h2><p id="gene-reset-description">This removes your current answers and the saved draft in this browser. Downloaded copies stay yours.</p><div className="gene-actions"><button ref={cancelReset} className="gene-primary" onClick={()=>{setConfirmReset(false);resetButton.current?.focus();}}>Keep my Gene</button><button className="gene-secondary" onClick={reset}>Clear and start over</button></div></section>}
    {notice && <p role="status" className="gene-notice">{notice}</p>}
    {step===0 && <section className="gene-intro"><h1 ref={heading} tabIndex={-1}>Start with one decision<br/><span>worth inheriting.</span></h1><p>A Design Genome doesn’t begin with a repository or an AI tool. It begins with organizational design knowledge that should survive beyond the person who remembers it.</p><p>Choose one recurring design decision your team shouldn’t have to rediscover every time.</p><button className="gene-primary" onClick={()=>visit(1)}>Build my first Gene →</button><details className="gene-examples"><summary>Need a starting point?</summary><p>Inspiration, not organizational policy. Choose an example deliberately, then edit it for your team.</p><div>{examples.map(example=><button key={example} onClick={()=>{update({decision:example});visit(1);}}>{example}<span aria-hidden="true"> →</span></button>)}</div></details><p className="gene-help">Seven short steps. Your answers stay in this browser; no account or AI service is involved.</p></section>}
    {editing && <div className="gene-layout"><section className="gene-editor" aria-labelledby="gene-question"><span className="gene-step">0{step} / 07 — {steps[step-1]}</span><h1 id="gene-question" ref={heading} tabIndex={-1}>{questions[step]}</h1><form noValidate onSubmit={e=>{e.preventDefault();next();}}><Fields step={step} gene={gene} update={update}/>{step===4 && <div className="gene-representation"><div><span className="gene-label">Human view</span><p>{gene.decision}</p></div><details className="gene-detail"><summary>View structured representation</summary><pre>{json(gene)}</pre></details><p className="gene-help">One portable representation of the knowledge you supplied—not a universal schema.</p></div>}{error && <p id="gene-error" ref={errorRef} tabIndex={-1} role="alert" className="gene-error">{error}</p>}<div className="gene-actions"><button type="button" className="gene-secondary" onClick={()=>visit(step-1)}>← Back</button><button type="submit" className="gene-primary">{step===7?'Create my Gene':'Continue'} →</button></div></form></section><Summary gene={gene} step={step} onVisit={visit}/></div>}
    {step===8 && <section className="gene-result"><span className="gene-step">Your first Gene</span><h1 ref={heading} tabIndex={-1}>You just created the beginning<br/>of a Design Genome.</h1><p className="gene-result-lead">One decision, with its intent, authority and boundaries intact.</p><Inventory gene={gene}/><div className="gene-actions gene-export-actions"><button className="gene-primary" onClick={()=>copy(aiPrompt(gene),'AI starter prompt')}>Copy for AI</button><button className="gene-secondary" onClick={()=>download('md')}>Download Gene (.md)</button><button className="gene-secondary" onClick={()=>download('json')}>Download structured data (.json)</button><button className="gene-text-button" onClick={()=>copy(json(gene),'Structured data')}>Copy structured data</button><button className="gene-text-button" onClick={()=>visit(1)}>Edit my Gene</button></div><p role="status" className="gene-copy-status">{feedback}</p>{manualCopy && <label className="gene-field">Copy this text<textarea ref={copyArea} readOnly rows={10} value={manualCopy}/></label>}<div className="gene-view-controls" role="group" aria-label="Gene representation"><button aria-pressed={view==='human'} onClick={()=>setView('human')}>Human view</button><button aria-pressed={view==='structured'} onClick={()=>setView('structured')}>Structured view</button></div><div className="gene-artifact">{view==='human'?<HumanView gene={gene}/>:<><p className="gene-help">One portable representation of the knowledge you supplied. This is not a universal Design Genome schema.</p><pre aria-label="Structured Gene">{json(gene)}</pre></>}</div><details className="gene-detail"><summary>Preview the AI starter prompt</summary><p className="gene-help">Use this later with your preferred AI tool. It asks for inspection and recommendations before changes, without granting organizational authority to the tool.</p><pre>{aiPrompt(gene)}</pre></details><p className="gene-closing">You don’t need to encode your entire design system.<br/><strong>Start with one decision worth inheriting.</strong></p></section>}
    <p className="gene-storage" role="status">{storageOK?'Progress is saved locally in this browser. Nothing is sent to a server.':'Local saving is unavailable. Keep this page open and copy or download your Gene before leaving.'}</p>
  </article>;
}
