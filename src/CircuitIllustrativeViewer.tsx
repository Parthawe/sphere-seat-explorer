import {useSceneMeasurement,trackUsage} from './usageAnalytics';
import {raceStudyLink} from './raceCards';
import {raceCoverage} from './raceCoverage';
import {loadCircuitLayout} from './loadCircuitLayout';
import {Component,lazy,Suspense,useCallback,useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {BrandIdentity} from './BrandMark';
import UiIcon from './UiIcon';
import {calendars,type Race} from './races';
import type {CircuitLayout} from './circuitLayouts';
import {buildStudyGeometry,circuitStudyUrl} from './circuitStudy';
import CircuitAreaMap from './CircuitAreaMap';
import {findVenue} from './venueRegistry';
import {syncPublicUrlMetadata} from './brand';

class StudyBoundary extends Component<{children:ReactNode;onUnavailable:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(){this.props.onUnavailable();}render(){return this.state.failed?null:this.props.children;}}
export default function CircuitIllustrativeViewer({race,onBack,onRace}:{race:Race;onBack:()=>void;onRace:(race:Race)=>void}){
 const [mode,setMode]=useState<'perspective'|'top'>('perspective'),[layout,setLayout]=useState<CircuitLayout|null>(null),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[retry,setRetry]=useState(0),[reset,setReset]=useState(0),[zoom,setZoom]=useState(0),[playing,setPlaying]=useState(false),[visible,setVisible]=useState(()=>!document.hidden),[message,setMessage]=useState(''),[copying,setCopying]=useState(false);
 useSceneMeasurement('outline',ready,failed,retry);
 const stage=useRef<HTMLDivElement>(null),Scene=useMemo(()=>lazy(()=>import('./CircuitIllustrativeScene')),[retry]);
 const geometry=useMemo(()=>layout?buildStudyGeometry(layout):null,[layout]),venue=findVenue(race.season,race.slug);
 const [areaId,setAreaId]=useState(()=>venue?.areas[0]?.id??'');
 const coverage=raceCoverage(race.season,race.slug),hasSeatStudy=coverage.kind==='model'||coverage.kind==='reference3d';
 const area=venue?.areas.find(a=>a.id===areaId)??venue?.areas[0];
 const onReady=useCallback(()=>setReady(true),[]),onUnavailable=useCallback(()=>{setFailed(true);setReady(false);setPlaying(false);},[]);
 useEffect(()=>{const controller=new AbortController();setLayout(null);setFailed(false);setReady(false);loadCircuitLayout(race,controller.signal).then(setLayout).catch(()=>{if(!controller.signal.aborted)onUnavailable();});return()=>controller.abort();},[race.season,race.slug,retry,onUnavailable]);
 useEffect(()=>{history.replaceState(history.state,'',circuitStudyUrl(race));syncPublicUrlMetadata();},[race]);
 useEffect(()=>{let inView=true;const update=()=>setVisible(inView&&!document.hidden),observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;update();}),q=matchMedia('(prefers-reduced-motion: reduce)'),motion=()=>{if(q.matches)setPlaying(false);};if(stage.current)observer.observe(stage.current);document.addEventListener('visibilitychange',update);q.addEventListener('change',motion);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);q.removeEventListener('change',motion);};},[]);
 async function copy(){const url=new URL(circuitStudyUrl(race),location.origin).href;setCopying(true);try{await navigator.clipboard.writeText(url);if(location.href===url)setMessage('Study link copied.');}catch{setMessage('Copy is unavailable. Copy the study link from your browser’s address bar.');}finally{setCopying(false);}}
 return <div className="layout-viewer study-viewer">
  <header className="layout-header"><a className="wordmark" href={`?season=${race.season}`}><BrandIdentity subtitle="CIRCUIT STUDIES"/></a><button aria-label="Back to race guide" onClick={onBack}><UiIcon name="arrow" className="study-arrow-left"/><span>Race guide</span></button></header>
  <main>
   <div className="layout-title"><div><h1>{race.name}<span>{race.season} · Illustrative circuit study</span></h1></div><div className="layout-race-picker"><label>Season<select aria-label="Study season" value={race.season} onChange={e=>{const races=calendars[Number(e.target.value) as 2026|2027];onRace(races.find(r=>r.slug===race.slug)??races[0]);}}><option>2026</option><option>2027</option></select></label><label>Race<select aria-label="Study race" value={race.slug} onChange={e=>onRace(calendars[race.season].find(r=>r.slug===e.target.value)!)}>{calendars[race.season].map(r=><option key={r.slug} value={r.slug}>{r.name}</option>)}</select></label></div></div>
   <div className="study-workspace">
    <div ref={stage} className="study-stage" role="region" tabIndex={0} aria-label="Illustrative circuit study. Plus and minus zoom in orbit mode. Home resets the camera." onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='Home'){e.preventDefault();setReset(r=>r+1);}if(e.key==='+'||e.key==='='||e.key==='-'){e.preventDefault();setZoom(z=>z+(e.key==='-'?-1:1));}}} data-study-id={layout?.id} data-study-ready={ready&&!failed}>
     {layout&&!failed&&<StudyBoundary key={retry} onUnavailable={onUnavailable}><Suspense fallback={null}><Scene {...{layout,mode,playing,visible,reset,zoom,onReady,onUnavailable}}/></Suspense></StudyBoundary>}
     {!ready&&!failed&&<div className="layout-loading" role="status">Loading circuit study…</div>}
     {failed&&<div className="layout-fallback" role="alert"><h2>3D study unavailable</h2><p>Try again, or use the race guide’s viewing information.</p><button onClick={()=>{setReady(false);setFailed(false);setRetry(r=>r+1);}}>Retry study</button><button onClick={onBack}>Open race guide</button></div>}
     <div className="study-stage-label"><strong>Circuit overview</strong></div><button className="study-play-overlay" disabled={!ready} aria-label={playing?'Pause cars':'Show passing cars'} aria-pressed={playing} title={playing?'Pause simulated cars':'Play simulated cars'} onClick={()=>setPlaying(p=>!p)}><UiIcon name={playing?'pause':'play'}/><span>{playing?'Pause':'Simulated cars'}</span></button>
     <div className="study-scene-tools" aria-label="Circuit camera tools"><div role="group" aria-label="Study camera"><button aria-label="Orbit circuit" aria-pressed={mode==='perspective'} disabled={!ready} onClick={()=>setMode('perspective')}><UiIcon name="cube"/><span>Orbit</span></button><button aria-label="Overhead circuit" aria-pressed={mode==='top'} disabled={!ready} onClick={()=>setMode('top')}><UiIcon name="map"/><span>Overhead</span></button></div><div role="group" aria-label="Study zoom"><button aria-label="Zoom out study" disabled={!ready} onClick={()=>setZoom(z=>z-1)}>−</button><button aria-label="Zoom in study" disabled={!ready} onClick={()=>setZoom(z=>z+1)}><UiIcon name="plus"/></button><button aria-label="Reset study camera" disabled={!ready} onClick={()=>setReset(r=>r+1)}><UiIcon name="reset"/></button></div></div>
     <div className="study-stage-foot"><span><UiIcon name="info"/>Flat track outline · no seating geometry</span></div>
    </div>
    <aside className="study-controls" aria-label="Circuit study controls">
     <div className="study-control-heading"><h2>Circuit overview</h2></div>
     <button className="study-share" aria-label="Copy study link" disabled={copying} aria-busy={copying} onClick={copy}><UiIcon name={copying?'motion':'copy'}/>Copy study link</button>
     {geometry&&<svg className="study-map" viewBox="-7 -7 14 14" role="img" aria-label="Circuit outline only. No stands or seat positions."><polyline points={geometry.points.map(p=>p.join(',')).join(' ')} fill="none" stroke="currentColor" strokeWidth=".12" strokeLinejoin="round"/></svg>}
     {hasSeatStudy&&<a className="study-area-link study-seat-handoff" href={raceStudyLink(race)}><UiIcon name="seat"/>Open seating study<UiIcon name="arrow"/></a>}
     <p className="study-location-note"><UiIcon name="info"/>Stand locations are not mapped in this 3D outline.</p>
     {venue?<a className="study-area-link" href="#sourced-viewing-areas"><UiIcon name="seat"/>{venue.areas.length} sourced viewing areas<UiIcon name="arrow"/></a>:<p className="study-location-note">No supported viewing-area map for this edition yet.</p>}
     <a className="study-area-link" href={`?season=${race.season}&race=${race.slug}#venue-stands`}>Stand catalogue<UiIcon name="arrow"/></a>
     <p className="study-message" role="status">{message}</p>
    </aside>
   </div>
   {venue&&area&&<section className="study-area-reference" id="sourced-viewing-areas" aria-labelledby="study-areas-title"><div><h2 id="study-areas-title">Viewing areas</h2><p>Source-backed names · approximate locations</p><CircuitAreaMap venue={{...venue,map:{...venue.map,movingDot:false}}} selected={area.id} onSelect={setAreaId}/></div><div className="study-area-detail"><span>{race.season} · {venue.checked}</span><h3>{area.name}</h3><p>{area.position}</p><p>{area.description}</p><p>{area.confidence}. Exact boundaries, rows and seats are unverified.</p><a href={area.source} target="_blank" rel="noreferrer">Area source<UiIcon name="arrow"/></a><a href={venue.officialMap} target="_blank" rel="noreferrer">Organizer’s map<UiIcon name="arrow"/></a><a href={`?season=${race.season}&race=${race.slug}#venue-stands`}>Compare stands<UiIcon name="arrow"/></a></div></section>}
   <div className="study-evidence"><nav aria-label="Race references"><a href={`?season=${race.season}&race=${race.slug}#venue-stands`}><UiIcon name="seat"/>Stands<UiIcon name="arrow"/></a><a href={`?season=${race.season}&race=${race.slug}#venue-references`}><UiIcon name="camera"/>Photos & sources<UiIcon name="arrow"/></a></nav><details id="study-sources"><summary><UiIcon name="info"/>Study limits & sources</summary><p>Flat source outline only. No stands or seats are placed in this scene. Terrain, bridges, actual road widths and sightlines are not modeled. Cars are illustrative animation, not live or historical positions. Viewing-area callouts use their own sourced map below; their approximate locations are not transferred onto this outline.</p>{layout&&<><p>{layout.note}</p><p>{layout.credit} · snapshot {layout.snapshot}</p><a href={layout.source} target="_blank" rel="noreferrer">Original outline<UiIcon name="arrow"/></a><a href={layout.licence} target="_blank" rel="noreferrer">Geometry licence<UiIcon name="arrow"/></a></>}</details></div>
  </main>
 </div>;
}
