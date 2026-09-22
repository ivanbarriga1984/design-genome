import { Link, useLocation, useNavigate } from 'react-router';
import { returnScene, sceneUrl } from './model';
import './return.css';
export function ReturnToPresentation(){
  const location=useLocation(), navigate=useNavigate(), scene=returnScene(location.pathname,location.search);
  if(!scene)return null;
  return <aside className="present-return" aria-label="Presenter navigation"><span>Presenter session</span><Link to={sceneUrl({scene,beat:1})}>Return to presentation · Scene {scene} →</Link><button onClick={()=>{const search=new URLSearchParams(location.search);search.delete('presentReturn');navigate({pathname:location.pathname,search:search.toString(),hash:location.hash},{replace:true});}}>Dismiss presenter controls</button></aside>;
}
