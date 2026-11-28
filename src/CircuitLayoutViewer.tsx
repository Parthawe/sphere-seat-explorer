import {expandedFromUrl} from './immersiveNavigation';
import useImmersiveScene from './useImmersiveScene';
import ImmersiveButton from './ImmersiveButton';
import {useSceneMeasurement,trackUsage} from './usageAnalytics';
import {raceStudyLink} from './raceCards';
import {raceCoverage} from './raceCoverage';
import {loadCircuitLayout} from './loadCircuitLayout';
import {Component,lazy,Suspense,useCallback,useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {BrandIdentity} from './BrandMark';
import UiIcon from './UiIcon';
import {calendars,type Race} from './races';
import type {CircuitLayout} from './circuitLayouts';
import type {LayoutCamera} from './CircuitLayoutScene';
const VenueStands=lazy(()=>import("./VenueStands"));
class LayoutBoundary extends Component<{children:ReactNode;onUnavailable:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(){this.props.onUnavailable();}render(){return this.state.failed?null:this.props.children;}}
const StandMediaGallery=lazy(()=>import('./StandMediaGallery'));
export default function CircuitLayoutViewer({race,onBack,onRace}:{race:Race;onBack:()=>void;onRace:(race:Race)=>void}) {
 const [layout,setLayout]=useState<CircuitLayout|null>(null),[failed,setFailed]=useState(false),[ready,setReady]=useState(false),[retry,setRetry]=useState(0),[mode,setMode]=useState<LayoutCamera>('perspective'),[reset,setReset]=useState(0),[playing,setPlaying]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches),[visible,setVisible]=useState(()=>!document.hidden),[zoom,setZoom]=useState(0);
 useSceneMeasurement('diagram',ready,failed,retry);
 const tools=useRef<HTMLDivElement>(null),scene=useRef<HTMLDivElement>(null),Scene=useMemo(()=>lazy(()=>import('./CircuitLayoutScene')),[retry]);
 const [immersive,setImmersive]=useState(expandedFromUrl);
 useImmersiveScene(scene,immersive,setImmersive);
 useEffect(()=>{const element=tools.current;if(!element)return;const measure=()=>scene.current?.style.setProperty('--layout-tools-height',`${element.offsetHeight}px`);const observer=new ResizeObserver(measure);observer.observe(element);measure();return()=>observer.disconnect();},[]);
 const onReady=useCallback(()=>setReady(true),[]),onUnavailable=useCallback(()=>{setFailed(true);setReady(false);},[]);
 useEffect(()=>{const controller=new AbortController();setLayout(null);setFailed(false);setReady(false);loadCircuitLayout(race,controller.signal).then(setLayout).catch(()=>{if(!controller.signal.aborted)onUnavailable();});return()=>controller.abort();},[race.season,race.slug,retry,onUnavailable]);
 useEffect(()=>{let inView=true;const update=()=>setVisible(inView&&!document.hidden),observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;update();}),q=matchMedia('(prefers-reduced-motion: reduce)'),motion=()=>{if(q.matches)setPlaying(false);};if(scene.current)observer.observe(scene.current);document.addEventListener('visibilitychange',update);q.addEventListener('change',motion);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);q.removeEventListener('change',motion);};},[]);
 return <div className="layout-viewer">
  <header className="layout-header"><a className="wordmark" href={`?season=${race.season}`}><BrandIdentity subtitle="CIRCUIT DIAGRAMS"/></a><button onClick={onBack}>Back to race guide</button></header>
  <main><div className="layout-title"><div><h1>{race.name}<span>{race.season} · 3D circuit diagram</span></h1><p>Reference outline. No seat preview. Elevations and bridges omitted.</p><a className="reference-header-link" href={raceStudyLink(race)}>{['model','reference3d'].includes(raceCoverage(race.season,race.slug).kind)?'Open seating study':'Open illustrative circuit study'}</a><a className="reference-header-link" href={`?season=${race.season}&race=${race.slug}#venue-references`}>Photos & sources</a></div><div className="layout-race-picker"><label>Season<select aria-label="Diagram season" value={race.season} onChange={e=>{const races=calendars[Number(e.target.value) as 2026|2027];onRace(races.find(r=>r.slug===race.slug)??races[0]);}}><option>2026</option><option>2027</option></select></label><label>Race<select aria-label="Diagram race" value={race.slug} onChange={e=>onRace(calendars[race.season].find(r=>r.slug===e.target.value)!)}>{calendars[race.season].map(r=><option key={r.slug} value={r.slug}>{r.name}</option>)}</select></label></div></div>
   <div className="layout-connected-workspace"><div ref={scene} className="layout-stage" role="region" tabIndex={0} aria-label="Interactive circuit diagram. Double-tap to move closer. Drag to orbit, scroll to zoom. Plus and minus zoom. Home resets." onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='+'||e.key==='='){e.preventDefault();setZoom(z=>z+1);}if(e.key==='-'){e.preventDefault();setZoom(z=>z-1);}if(e.key==='Home'){e.preventDefault();setReset(r=>r+1);}}} data-layout-id={layout?.id} data-layout-ready={ready&&!failed}>
    {layout&&!failed&&<LayoutBoundary key={retry} onUnavailable={onUnavailable}><Suspense fallback={null}><div className="layout-canvas"><Scene {...{layout,mode,reset,zoom,playing,visible,onReady,onUnavailable}}/></div></Suspense></LayoutBoundary>}
    {!ready&&!failed&&<div className="layout-loading" role="status">Loading circuit diagram…</div>}
    {failed&&<div className="layout-fallback" role="alert"><h2>3D diagram unavailable</h2><p>The race guide and existing viewing information still work.</p><button onClick={()=>{setFailed(false);setReady(false);setRetry(r=>r+1);}}>Retry 3D diagram</button><button onClick={onBack}>Open race guide</button></div>}
    <ImmersiveButton active={immersive} onToggle={()=>setImmersive(value=>!value)}/>
    <div className="layout-scene-label" aria-hidden="true">{layout?.name}</div>
    <div ref={tools} className="layout-tools" aria-label="Diagram controls"><div role="group" aria-label="Diagram camera"><button disabled={!ready} aria-pressed={mode==='perspective'} onClick={()=>setMode('perspective')}><UiIcon name="cube"/>Orbit</button><button disabled={!ready} aria-pressed={mode==='top'} onClick={()=>setMode('top')}><UiIcon name="map"/>Overhead</button></div><div role="group" aria-label="Diagram zoom"><button disabled={!ready} aria-label="Zoom in on diagram" onClick={()=>setZoom(z=>z+1)}>+</button><button disabled={!ready} aria-label="Zoom out on diagram" onClick={()=>setZoom(z=>z-1)}>−</button><button disabled={!ready} aria-label="Reset diagram camera" onClick={()=>setReset(r=>r+1)}><UiIcon name="reset"/></button></div><button disabled={!ready} aria-label={playing?'Pause circuit cars':'Show circuit cars'} aria-pressed={playing} onClick={()=>setPlaying(p=>!p)}><UiIcon name={playing?'pause':'play'}/>Cars</button></div>
    <div className="layout-scene-foot"><span>Drag to orbit · Double-tap to explore</span><span>Flat diagram · illustrative cars</span></div>
   </div>
   <aside className="layout-media-rail" aria-label="Circuit stand photos and videos"><Suspense fallback={<p role="status">Loading circuit references…</p>}><StandMediaGallery race={race}/></Suspense></aside></div>
   <div className="layout-caption"><p>{layout?.credit??'Community circuit outline'} · Layout year unverified</p><details><summary>Source & limits</summary><p>{layout?.note??'Reference outline only. No racing-season seat layout is supplied.'}</p><p>Vertical depth is a display treatment, not terrain or a bridge survey. Cars are enlarged for the diagram and move at an illustrative rate. They do not show verified direction, speed, telemetry or a historical lap. Use the race guide for supported viewing areas.</p>{layout&&<><a href={layout.source} target="_blank" rel="noreferrer">Original outline</a><a href={layout.licence} target="_blank" rel="noreferrer">MIT licence</a><span>Snapshot {layout.snapshot}</span></>}</details></div>
   <Suspense fallback={<p>Loading viewing options…</p>}><VenueStands key={`${race.season}-${race.slug}`} race={race} hideMedia/></Suspense>
  </main>
 </div>;
}
