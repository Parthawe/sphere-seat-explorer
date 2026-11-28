import useSceneLoadTimeout from './useSceneLoadTimeout';
import {loadCircuitLayout} from './loadCircuitLayout';
import {lazy,Suspense,useCallback,useEffect,useMemo,useRef,useState} from 'react';
import type {Race} from './races';
import {racePreview} from './racePreview';
import {circuitLayoutId,type CircuitLayout} from './circuitLayouts';
import {findCircuitModel,normalizeModelPosition} from './circuitSeating';
import type {ModelCameraControls} from './CircuitSeatingScene';
import HeroSceneBoundary from './HeroSceneBoundary';
import UiIcon from './UiIcon';
const noAction=()=>{};
export default function Race3DPreview({race,onOpen,animated=false,framing='circuit'}:{race:Race;onOpen?:()=>void;animated?:boolean;framing?:'circuit'|'seat'}){
 const spec=racePreview(race),stage=useRef<HTMLDivElement>(null),cameraControls=useRef<ModelCameraControls|null>(null);
 const [visible,setVisible]=useState(false),[requested,setRequested]=useState(false),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[retry,setRetry]=useState(0),[posterFailed,setPosterFailed]=useState(false),[layout,setLayout]=useState<CircuitLayout|null>(null);
 const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),[motion,setMotion]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches);
 const saver=Boolean((navigator as Navigator&{connection?:{saveData?:boolean}}).connection?.saveData);
 const Scenes=useMemo(()=>({Model:lazy(()=>import('./CircuitSeatingScene')),Vegas:lazy(()=>import('./HeroScene')),Outline:lazy(()=>import('./CircuitIllustrativeScene'))}),[retry]);
 const model=spec.kind==='model'?findCircuitModel(race.season,race.slug):undefined,selection=useMemo(()=>model?normalizeModelPosition(model,{}):null,[model]);
 const onReady=useCallback(()=>setReady(true),[]),unavailable=useCallback(()=>{setReady(false);setFailed(true);},[]);
 useSceneLoadTimeout(ready,failed,retry,unavailable,requested&&visible);
 useEffect(()=>{let inView=false;const update=()=>setVisible(inView&&!document.hidden),observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;update();},{rootMargin:'80px'});if(stage.current)observer.observe(stage.current);document.addEventListener('visibilitychange',update);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);};},[]);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'),change=()=>{setReduced(q.matches);if(q.matches)setMotion(false);};q.addEventListener('change',change);return()=>q.removeEventListener('change',change);},[]);
 useEffect(()=>{if(visible&&!saver)setRequested(true);},[visible,saver]);
 useEffect(()=>{if(!requested||spec.kind!=='outline')return;const controller=new AbortController();loadCircuitLayout(race,controller.signal).then(setLayout).catch(()=>{if(!controller.signal.aborted)unavailable();});return()=>controller.abort();},[race.season,race.slug,requested,retry,spec.kind,unavailable]);
 function load(){
  // The load/retry button disappears while preparing; keep keyboard focus in this preview.
  stage.current?.closest<HTMLAnchorElement>('.race-3d-preview-link')?.focus({preventScroll:true});
  setFailed(false);setReady(false);setRetry(n=>n+1);setRequested(true);
 }
 const playing=motion&&visible&&!reduced;
 return <div className="race-3d-preview" data-preview-key={spec.key} data-preview-ready={ready&&!failed} data-preview-visible={visible}>
  <a className="race-3d-preview-link" href={spec.href} aria-label={`Explore ${race.name} ${race.season} in 3D`} onClick={event=>{if(!onOpen||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();onOpen();}}>
   <div ref={stage} className="race-3d-preview-stage">
    <img className="race-3d-poster" src={posterFailed?`/circuit-plans/${circuitLayoutId(race.season,race.slug)}.svg`:spec.poster} width="960" height="540" fetchPriority="high" alt={posterFailed?`${race.name} source circuit outline fallback`:spec.kind==='outline'?`${race.name} circuit outline study`:`Illustrative ${race.name} venue study`} onError={()=>setPosterFailed(true)}/>
    {requested&&!failed&&<div className="race-3d-renderer" data-ready={ready} aria-hidden="true"><HeroSceneBoundary key={retry} onUnavailable={unavailable}><Suspense fallback={null}>
     {spec.kind==='model'&&model&&selection&&<Scenes.Model autoRotate={animated&&framing==='circuit'} preview model={model} selection={selection} mode={framing==='seat'?'seat':'circuit'} playing={playing} visible={visible} speed={1} pass={0} following={false} onManualLook={noAction} roofs reset={0} cameraControls={cameraControls} onZoomLimitsChange={noAction} onSelect={noAction} onReady={onReady} onUnavailable={unavailable}/>}
     {spec.kind==='vegas'&&<Scenes.Vegas autoRotate={animated} view={framing==='seat'?'seat':'circuit'} motion={playing} reduced={reduced} active={visible} interactionRef={stage} onReady={onReady} onUnavailable={unavailable}/>}
     {spec.kind==='outline'&&layout&&<Scenes.Outline autoRotate={animated} preview layout={layout} playing={playing} visible={visible} reset={0} zoom={0} onReady={onReady} onUnavailable={unavailable}/>}
    </Suspense></HeroSceneBoundary></div>}
   </div>
   <div className="race-3d-preview-footer"><span>{framing==='seat'&&model&&selection&&<span className="preview-bank-name">{model.banks.find(b=>b.id===selection.bank)?.name}</span>}{spec.note}</span><strong><UiIcon name={spec.kind==='outline'?'circuit':'seat'}/>{spec.action}<UiIcon name="arrow"/></strong></div>
  </a>
  <a className="race-3d-preview-credit" href="/circuit-previews/CREDITS.md" target="_blank" rel="noreferrer" aria-label="3D preview credits" title="3D preview credits"><UiIcon name="info"/></a>
  <div className="race-3d-preview-tools">
   {failed||(!requested&&saver)?<button onClick={load}>{failed?'Retry preview':'Load 3D'}<UiIcon name="cube"/></button>:ready&&!reduced?<button aria-label={animated?(motion?'Pause 3D preview':'Play 3D preview'):(motion?'Pause preview cars':'Play preview cars')} aria-pressed={motion} onClick={()=>setMotion(v=>!v)}><UiIcon name={motion?'pause':'play'}/>{motion?'Pause':animated?'Play 3D':'Simulated cars'}</button>:null}
  </div>
  <span className="race-3d-preview-status" role="status">{failed?'3D preview unavailable. Open the explorer to retry.':requested&&!ready?'Preparing 3D preview…':''}</span>
 </div>;
}
