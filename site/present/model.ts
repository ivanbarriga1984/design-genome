export const scenes = [
  ['Title',1,'The problem'],['Ivan',1,'The problem'],['Creation became cheap',2,'The problem'],['Who creates now',3,'The problem'],['The Button',8,'The problem'],['Reasonable decisions',2,'The problem'],
  ['The question',1,'The idea'],['Definition',1,'The idea'],['Intent → Intelligence → Inheritance',3,'The idea'],['Fewer guesses',4,'The idea'],['Experience it',3,'Experience it'],
  ['Four capabilities',4,'Under the hood'],['What is in a Genome',4,'Under the hood'],['Forma',2,'Under the hood'],['Adapter',5,'Under the hood'],['Real proof',1,'Under the hood'],
  ['Build your first Gene',3,'Your turn'],['One Gene',4,'From Gene to Genome'],['Genome',7,'From Gene to Genome'],['Forma revisited',2,'From Gene to Genome'],['Start here',6,'Close'],['Final',1,'Close'],
].map(([title,beats,act])=>({title:String(title),beats:Number(beats),act:String(act)}));
export type Position={scene:number;beat:number};
export function position(path:string,search:string):Position {
  const raw=path.replace(/\/+$/,'').split('/')[2];
  const number=raw && /^\d+$/.test(raw)?Number(raw):1;
  const scene=Math.max(1,Math.min(scenes.length,number));
  const value=new URLSearchParams(search).get('beat');
  const beat=value && /^\d+$/.test(value)?Number(value):1;
  return {scene,beat:Math.max(1,Math.min(scenes[scene-1].beats,beat))};
}
export const sceneUrl=({scene,beat=1}:Position)=>`/present/${String(scene).padStart(2,'0')}${beat>1?`?beat=${beat}`:''}`;
export function move(p:Position,direction:1|-1,direct=false):Position {
  if(direct)return {scene:Math.max(1,Math.min(scenes.length,p.scene+direction)),beat:1};
  if(direction===1)return p.beat<scenes[p.scene-1].beats?{...p,beat:p.beat+1}:p.scene<scenes.length?{scene:p.scene+1,beat:1}:p;
  return p.beat>1?{...p,beat:p.beat-1}:p.scene>1?{scene:p.scene-1,beat:scenes[p.scene-2].beats}:p;
}
export function stageFit(width:number,height:number){return Math.max(0,Math.min(width/1600,height/900));}
export const returnRoutes:Record<string,number>={'/workshop':12,'/build/gene':18,'/reference/machine-context':17};
export function returnScene(path:string,search:string){const expected=returnRoutes[path.replace(/\/+$/,'')];return expected && new URLSearchParams(search).get('presentReturn')===String(expected)?expected:null;}
export const activityUrl=(path:string)=>`${path}?presentReturn=${returnRoutes[path]}`;
