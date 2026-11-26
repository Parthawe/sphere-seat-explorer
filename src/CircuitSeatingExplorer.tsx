import UiIcon from "./UiIcon";
import { useListRemovalFocus } from "./useListRemovalFocus";
import { SITE_ORIGIN, syncPublicUrlMetadata } from "./brand";
import type {ModelCameraControls} from "./CircuitSeatingScene";
import CircuitOverview from "./CircuitOverview";
import SpectatorReferences from "./SpectatorReferences";
import {Component,lazy,Suspense,useCallback,useEffect,useLayoutEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {BrandIdentity} from './BrandMark';
import {bankGroundHeight,bankFrame,closestTrack,modelCount,modelPosition,modelPositionUrl,normalizeModelPosition,positionKey,type CircuitModel,type ModelPosition} from './circuitSeating';
class SceneBoundary extends Component<{children:ReactNode;onUnavailable:()=>void},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(){this.props.onUnavailable();}
 render(){return this.state.failed?null:this.props.children;}
}
export default function CircuitSeatingExplorer({model,onBack}:{model:CircuitModel;onBack:()=>void}){
 const [selection,setSelection]=useState(()=>{const q=new URLSearchParams(location.search);return normalizeModelPosition(model,{bank:q.get('bank')??undefined,section:Number(q.get('section'))||undefined,row:Number(q.get('modelRow'))||undefined,seat:Number(q.get('position'))||undefined});});
 const [mode,setMode]=useState<'circuit'|'stand'|'seat'>(()=>{const mode=new URLSearchParams(location.search).get('camera');return mode==='stand'||mode==='circuit'?mode:'seat';}),[playing,setPlaying]=useState(false),[roofs,setRoofs]=useState(true),[reset,setReset]=useState(0),[ready,setReady]=useState(false),[unavailable,setUnavailable]=useState(false),[retry,setRetry]=useState(0),[overview,setOverview]=useState(false),[grid,setGrid]=useState(false),[referencesOpen,setReferencesOpen]=useState(()=>new URLSearchParams(location.search).get("references")==="1"),[saved,setSaved]=useState<ModelPosition[]>([]),[feedback,setFeedback]=useState('');
 const Scene=useMemo(()=>lazy(()=>import('./CircuitSeatingScene')),[retry]);
 const [speed,setSpeed]=useState(1),[pass,setPass]=useState(0),[following,setFollowing]=useState(false);
 const heading=useRef<HTMLDivElement>(null),cameraModes=useRef<HTMLElement>(null);
 const stage=useRef<HTMLElement|null>(null),[sceneVisible,setSceneVisible]=useState(true);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setSceneVisible(entry.isIntersecting));if(stage.current)observer.observe(stage.current);return()=>observer.disconnect();},[]);
 useLayoutEffect(()=>{
  const surface=stage.current,title=heading.current,modes=cameraModes.current;
  if(!surface||!title||!modes)return;
  const measure=()=>{surface.style.setProperty('--scene-heading-bottom',`${title.offsetTop+title.offsetHeight}px`);surface.style.setProperty('--scene-camera-height',`${modes.offsetHeight}px`);};
  const observer=new ResizeObserver(measure);observer.observe(title);observer.observe(modes);measure();return()=>observer.disconnect();
 },[]);
 const manualLook=useCallback(()=>setFollowing(false),[]);
 const comparisonRoot=useRef<HTMLElement>(null),compareButton=useRef<HTMLButtonElement>(null);
 const prepareRemoval=useListRemovalFocus(saved.map(positionKey),comparisonRoot,()=>compareButton.current);
 const cameraControls=useRef<ModelCameraControls|null>(null);
 const [zoomLimits,setZoomLimits]=useState({inward:true,outward:true});
 const zoomLimitsCallback=useCallback((inward:boolean,outward:boolean)=>setZoomLimits(previous=>previous.inward===inward&&previous.outward===outward?previous:{inward,outward}),[]);
 const returnToScene=useRef(false);
 const dialog=useRef<HTMLDialogElement>(null),readyCallback=useCallback(()=>setReady(true),[]),unavailableCallback=useCallback(()=>{setUnavailable(true);setReady(false);setPlaying(false);setFollowing(false);},[]);
 const bank=model.banks.find(b=>b.id===selection.bank)!,count=model.banks.reduce((n,b)=>n+modelCount(b),0),p=modelPosition(model,selection),near=closestTrack(model,[p[0],p[2]]),distance=Math.round(Math.hypot(near[0]-p[0],near[1]-p[2]));
 function choose(next:Partial<ModelPosition>){setFollowing(false);setSelection(normalizeModelPosition(model,{...selection,...next}));setFeedback('');}
 useEffect(()=>{const q=window.matchMedia('(prefers-reduced-motion: reduce)'),update=()=>{if(q.matches){setPlaying(false);setFollowing(false);}};q.addEventListener('change',update);return()=>q.removeEventListener('change',update);},[]);
 useEffect(()=>{const stop=()=>{if(document.hidden){setPlaying(false);setFollowing(false);}};document.addEventListener('visibilitychange',stop);return()=>document.removeEventListener('visibilitychange',stop);},[]);
 useEffect(()=>{
  if(grid){dialog.current?.showModal();return;}
  dialog.current?.close();
  if(returnToScene.current){
   returnToScene.current=false;
   stage.current?.querySelector<HTMLElement>('.circuit-model-canvas')?.focus({preventScroll:true});
   stage.current?.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
 },[grid]);
 useEffect(()=>{
  const url=new URL(modelPositionUrl(location.origin,model,selection,mode));
  if(location.search!==url.search)history.replaceState(history.state,'',url.pathname+url.search);
  syncPublicUrlMetadata();
 },[model,selection,mode]);
 useEffect(()=>{const restore=()=>{const q=new URLSearchParams(location.search);if(q.get('race')!==model.id||q.get('screen')!=='circuit')return;setSelection(normalizeModelPosition(model,{bank:q.get('bank')??undefined,section:Number(q.get('section')),row:Number(q.get('modelRow')),seat:Number(q.get('position'))}));const camera=q.get('camera');setMode(camera==='stand'||camera==='circuit'?camera:'seat');};window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore);},[model]);
 async function share(){const url=modelPositionUrl(SITE_ORIGIN,model,selection,mode);try{await navigator.clipboard.writeText(url);setFeedback('Model position link copied. No ticket information included.');}catch{setFeedback('Copy model position link: '+url);}}
 function startReplay(restart=false){
  if(restart)setPass(p=>p+1);
  setPlaying(true);
  const surface=stage.current;
  if(surface){const rect=surface.getBoundingClientRect();if(rect.bottom<=0||rect.top>=innerHeight){surface.querySelector<HTMLElement>('.circuit-model-canvas')?.focus({preventScroll:true});surface.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}}
 }
 function save(){if(saved.some(p=>positionKey(p)===positionKey(selection))){setSaved(saved.filter(p=>positionKey(p)!==positionKey(selection)));return;}if(saved.length===3){setFeedback('Three positions saved. Remove one to compare another.');return;}setSaved([...saved,{...selection}]);}
 function arrows(e:React.KeyboardEvent,gridView=false){if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();choose({seat:selection.seat+(e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0),row:selection.row+(e.key==='ArrowUp'?1:e.key==='ArrowDown'?-1:0)*(gridView?-1:1)});}
 return <div className="circuit-explorer">
  <header className="circuit-explorer-header"><a className="wordmark" href={`?season=${model.season}`}><BrandIdentity subtitle="3D SEATING STUDIES" /></a><div><span>{model.country.toUpperCase()} / {model.season}</span><button onClick={onBack}>Back to race guide</button></div></header>
  <main className="circuit-explorer-layout">
   <section ref={stage} className={'circuit-model-stage mode-'+mode+(model.appearance==='day'?' day-scene':'')} aria-label={`${model.name} 3D seating model`}>
    <div className="circuit-model-canvas" role="region" tabIndex={0} aria-label="Interactive modeled view. Drag to look or orbit. Arrow keys change model row and position." onKeyDown={arrows}>
     {unavailable?<div className="circuit-model-fallback" role="alert"><h2>3D view unavailable</h2><p>Your position controls and complete model grid still work.</p><button onClick={()=>{stage.current?.querySelector<HTMLElement>('.circuit-model-canvas')?.focus({preventScroll:true});setUnavailable(false);setReady(false);setRetry(r=>r+1);}}>Retry 3D</button><button onClick={()=>setGrid(true)}>Open model grid</button></div>:<SceneBoundary key={retry} onUnavailable={unavailableCallback}><Suspense fallback={null}><Scene onZoomLimitsChange={zoomLimitsCallback} cameraControls={cameraControls} key={model.id+'-'+retry} model={model} selection={selection} mode={mode} playing={playing&&sceneVisible} speed={speed} pass={pass} following={following&&playing&&sceneVisible&&mode==='seat'} onManualLook={manualLook} roofs={roofs} reset={reset} onSelect={setSelection} onUnavailable={unavailableCallback} onReady={readyCallback}/></Suspense></SceneBoundary>}
    </div>
    {!ready&&!unavailable&&<div className="circuit-model-loading" role="status">Building the circuit view…</div>}
    <button aria-label="Photos & fan reports" title="Photos & fan reports" className="circuit-photo-trigger" onClick={()=>{setPlaying(false);setReferencesOpen(true);}}><UiIcon name="camera"/>Photos</button>
    <div ref={heading} className="circuit-model-heading"><span>{model.name}</span><h1>{bank.name}</h1><p>{bank.kind==='lawn'?'LAWN STUDY':`MODEL SECTION ${selection.section} / ROW ${selection.row}`} · POSITION {selection.seat}</p></div>
    <nav ref={cameraModes} className="circuit-camera-modes" aria-label="3D camera"><button aria-label="Full circuit" aria-pressed={mode==='circuit'} onClick={()=>{setFollowing(false);setMode('circuit');}}><UiIcon name="circuit"/>Circuit</button><button aria-label="Grandstand" aria-pressed={mode==='stand'} onClick={()=>{setFollowing(false);setMode('stand');}}><UiIcon name="layers"/>Stand</button><button aria-label={bank.kind==='lawn'?'Standing view':'Seated view'} aria-pressed={mode==='seat'} onClick={()=>setMode('seat')}><UiIcon name="seat"/>{bank.kind==='lawn'?'Standing':'Seat'}</button></nav>
    {mode==='seat'&&ready&&!unavailable&&<div className="circuit-seat-zoom" role="group" aria-label="Seated view zoom" title="Zoom keeps your modeled seat fixed">
     <button disabled={!ready||unavailable||!zoomLimits.inward} aria-label="Zoom in on seated view" title="Zoom in" onClick={()=>cameraControls.current?.zoomIn()}>+</button>
     <button disabled={!ready||unavailable} aria-label="Reset seated zoom" title="Reset zoom" onClick={()=>cameraControls.current?.resetZoom()}>1×</button>
     <button disabled={!ready||unavailable||!zoomLimits.outward} aria-label="Zoom out on seated view" title="Zoom out" onClick={()=>cameraControls.current?.zoomOut()}>−</button>
    </div>}
    <div className="circuit-scene-actions">{bank.roof&&<button aria-label={roofs?"Roof cutaway":"Restore roofs"} title={roofs?"Roof cutaway":"Restore roofs"} aria-pressed={!roofs} onClick={()=>setRoofs(!roofs)}><UiIcon name="layers"/>Roof</button>}<button aria-label="Reset camera" title="Reset camera" onClick={()=>{setFollowing(false);setReset(r=>r+1);}}><UiIcon name="reset"/></button><button aria-label={playing?'Pause cars':'Show passing cars'} disabled={!ready||unavailable} aria-pressed={playing} onClick={()=>setPlaying(!playing)}><UiIcon name={playing?'pause':'play'}/>Cars</button></div>
    <div className="circuit-scene-note"><span>{mode==='seat'?'Drag to look · Scroll to zoom':'Drag to orbit · Select a position'}</span><span>Illustrative view · simulated cars</span></div>
   </section>
   <aside className="circuit-position-panel" aria-label="Model position controls">
    <div className="circuit-panel-heading"><span className="eyebrow">{model.country.toUpperCase()} {model.season}</span><h2>Choose your position.</h2><p>{model.dates}</p></div>
    <div className="circuit-accuracy"><strong>Estimated seat views</strong><p>Model rows and positions do not match ticket numbers.</p></div>

    <button aria-label="Circuit map & viewing banks" className="circuit-overview-trigger" onClick={()=>{setPlaying(false);setOverview(true);}}><UiIcon name="map"/>Circuit map</button>
    <label htmlFor="model-bank">Grandstand / viewing bank</label><select id="model-bank" value={bank.id} onChange={e=>{const b=model.banks.find(b=>b.id===e.target.value)!;setSelection(normalizeModelPosition(model,{bank:b.id}));}}>{model.banks.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select>
    {!!model.unmappedProducts?.length&&<details className="circuit-unmapped-products"><summary>More ticket options · source information <span>{model.unmappedProducts.length}</span></summary><p>These options have organizer information, but no supported 3D view here. Some cover roaming areas, accessible platforms or hospitality. This study does not list all available tickets.</p>{Array.from(new Set(model.unmappedProducts.map(p=>p.group??'Other ticket options'))).map(group=><section className="circuit-source-group" key={group}><h3>{group}</h3>{model.unmappedProducts!.filter(p=>(p.group??'Other ticket options')===group).map(product=><article key={product.id}><h4>{product.name}</h4><p>{product.note}</p><a href={product.source} target="_blank" rel="noreferrer">View official product information</a></article>)}</section>)}<a href={model.ticketUrl} target="_blank" rel="noreferrer">{model.catalogueLabel??'Browse the organizer’s full catalogue'}</a></details>}
    <div className="circuit-bank-facts">{bank.eligibilityNote&&<p className="circuit-eligibility-note">{bank.eligibilityNote}</p>}<strong>{bank.kind==='free'?'Free seating within this grandstand':bank.kind==='lawn'?'General admission · no assigned chair':bank.kind==='check'?'Grandstand seating · confirm assignment':'Assigned seating product'}</strong><p>{bank.kind==='free'?'Choose a possible viewing position; no chair is assigned.':bank.kind==='lawn'?'The grid shows possible standing positions.':'Confirm your allocation with the organizer.'}</p></div>
    <div className="circuit-model-inputs">{([['section','Model section',bank.sections],['row',bank.kind==='lawn'?'Lawn depth':'Model row',bank.rows],['seat','Position',bank.seats]] as const).map(([field,label,max])=><label key={field}>{label}<input aria-label={label} type="number" min={1} max={max} value={selection[field]} onChange={e=>choose({[field]:Number(e.target.value)})}/><small>1–{max}</small></label>)}</div>
    <div className="circuit-row-shortcuts">{[['Front',1],['Middle',Math.ceil(bank.rows/2)],['High',bank.rows]].map(([label,row])=><button key={label} aria-pressed={selection.row===row} onClick={()=>choose({row:Number(row)})}>{label}</button>)}</div>
    <button aria-label="Open complete model grid" className="circuit-grid-trigger" onClick={()=>setGrid(true)}><UiIcon name="grid"/>Seat grid <span>{modelCount(bank).toLocaleString()} positions</span></button>
    <dl className="circuit-view-metrics"><div><dt>Modeled eye height</dt><dd>{(p[1]-bankGroundHeight(model,bank)+1.15).toFixed(1)} m</dd></div><div><dt>Track-center distance</dt><dd>~{distance} m</dd></div></dl>
    <div className="circuit-position-actions"><button ref={compareButton} onClick={save}>{saved.some(p=>positionKey(p)===positionKey(selection))?'Remove saved position':'Compare position'} <span>{saved.length}/3</span></button><button onClick={share}>Share view</button></div>
    <p className="circuit-feedback" role="status">{feedback}</p>
    {saved.length>0&&<section ref={comparisonRoot} className="circuit-saved"><h3>Compare modeled views</h3><p>Choose a saved position to revisit its 3D view.</p>{saved.map(s=>{const b=model.banks.find(b=>b.id===s.bank)!,p=modelPosition(model,s);return <div key={positionKey(s)} data-comparison-id={positionKey(s)}><button aria-label={`View ${b.name} model section ${s.section} row ${s.row} position ${s.seat}`} onClick={()=>{setSelection(s);setMode('seat');}}><b>{b.name}</b><span>S{s.section} / R{s.row} / P{s.seat} · eye {(p[1]-bankGroundHeight(model,b)+1.15).toFixed(1)} m</span></button><button aria-label={`Remove saved ${positionKey(s)}`} data-remove-comparison onClick={()=>{prepareRemoval(positionKey(s));setSaved(saved.filter(p=>positionKey(p)!==positionKey(s)));setFeedback('Position removed from comparison.');}}>×</button></div>;})}</section>}
    <details className="circuit-replay-details"><summary>Watch cars pass<span>Simulated replay</span></summary>
    <section className="race-experience" aria-label="Race simulation controls">
     <div className="race-experience-title"><h3>Feel the fly-by.</h3><span data-playing={playing}>{playing?'RUNNING':'PAUSED'}</span></div>
     <p>Watch a simulated pack pass your stand. Slow it down to explore the sightline.</p>
     <div className="race-experience-play"><button disabled={!ready||unavailable} onClick={()=>startReplay(true)}>Replay near this stand</button><button disabled={!ready||unavailable} aria-pressed={playing} onClick={()=>{if(playing)setPlaying(false);else startReplay();}}>{playing?'Pause':'Play'}</button></div>
     <div className="race-experience-speed" role="group" aria-label="Simulation speed">{[.25,1,2].map(value=><button key={value} aria-pressed={speed===value} onClick={()=>setSpeed(value)}>{value===.25?'¼×':value+'×'}</button>)}</div>
     <button className="race-follow" disabled={!ready||unavailable} aria-pressed={following&&mode==='seat'} onClick={()=>{if(following){setFollowing(false);}else{setMode('seat');startReplay(true);setFollowing(true);}}}>{following&&mode==='seat'?'Stop following car':'Follow lead car from my seat'}</button>
     <small>Illustrative motion, not recorded race footage. Drag to take control.</small>
    </section>
    </details>
    {bank.admissionNote&&<div className="circuit-bank-facts"><strong>Ticket options & cover</strong><p>{bank.admissionNote}</p></div>}
    {!!bank.ticketOptions?.length&&<section className="circuit-ticket-options" aria-label="Official ticket options for this bank"><h3>One grandstand. Different ticket options.</h3><p>These options share this representative model. Your package does not identify a model row.</p>{bank.ticketOptions.map(option=><div key={option.source}><a href={option.source} target="_blank" rel="noreferrer">{option.name}<span>Official information ↗</span></a><p>{option.note}</p></div>)}</section>}
    <a className="circuit-ticket-link" href={bank.source} target="_blank" rel="noreferrer">{bank.officialView?'Official information & virtual view':'Official grandstand information'}</a>
    {bank.officialView&&<p className="circuit-bank-facts">{bank.officialViewNote??'On the organizer’s page, choose “Open the virtual grandstand”. Capture date and correspondence to this modeled position are unverified.'}</p>}
    <details className="circuit-model-sources"><summary>Sources & model limits</summary>{model.coverageNote&&<p>{model.coverageNote}</p>}<p>{bank.confidence}. Circuit centerlines and available permanent footprints come from OpenStreetMap. Row counts, sections, chairs, stand elevation, canopy construction, fences, lighting and pit buildings are modeled assumptions.</p><p>{model.evidence}</p><p>Roofs shown are illustrative structures, not a verified promise of shade or cover. Obstructions and accessible routes are unverified. No live inventory or price is shown. Checked {model.checked??'23 Nov 2026'}.</p><a href={model.source} target="_blank" rel="noreferrer">Organizer’s {model.season} event</a><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors · ODbL</a>{model.terrain&&<a href={model.terrain.source} target="_blank" rel="noreferrer">Terrain © SPW 2021–2022 · CC BY 4.0 · sparse sampled context</a>}<a href={model.geometryUrl} download>Download adapted source geography</a></details>
    <p className="circuit-model-count">{count.toLocaleString()} illustrative positions across {model.banks.length} modeled banks. These counts describe our model.</p>
   </aside>
  </main>
  <CircuitOverview model={model} selection={selection} open={overview} onClose={()=>setOverview(false)} onSelect={bank=>{setSelection(normalizeModelPosition(model,{bank}));setFeedback('');}}/>
  <SpectatorReferences open={referencesOpen} onClose={()=>setReferencesOpen(false)} venue={model.id} area={bank.product} areaName={bank.name} season={model.season} officialView={bank.officialView?{url:bank.source,name:bank.name,note:bank.officialViewNote}:undefined}/>
  <dialog ref={dialog} className="circuit-grid-dialog" aria-labelledby="model-grid-title" onCancel={()=>setGrid(false)} onClose={()=>setGrid(false)}><header><div><span className="eyebrow">COMPLETE MODEL GRID</span><h2 id="model-grid-title">{bank.name} · model grid</h2><p>Every dot is a selectable modeled position. Labels are not official ticket IDs.</p></div><button onClick={()=>setGrid(false)} aria-label="Close model grid">×</button></header><label>Viewing bank<select aria-label="Grid viewing bank" value={bank.id} onChange={e=>setSelection(normalizeModelPosition(model,{bank:e.target.value}))}>{model.banks.map(b=><option value={b.id} key={b.id}>{b.name}</option>)}</select></label><div className="circuit-grid-sections" role="group" aria-label="Model sections">{Array.from({length:bank.sections},(_,i)=><button key={i} aria-pressed={selection.section===i+1} onClick={()=>choose({section:i+1})}>Section {i+1}<small>{bank.rows*bank.seats} positions</small></button>)}</div><div className="circuit-grid-map"><span>TRACK / FRONT OF BANK</span><svg viewBox={`-22 -16 ${bank.seats*12+40} ${bank.rows*13+30}`} role="img" tabIndex={0} aria-label={`Model section ${selection.section}, ${bank.rows} rows and ${bank.seats} positions per row. Use arrow keys or select a dot.`} onKeyDown={e=>arrows(e,true)} onPointerDown={e=>{const pt=new DOMPoint(e.clientX,e.clientY).matrixTransform(e.currentTarget.getScreenCTM()!.inverse());if(pt.x<0||pt.x>bank.seats*12||pt.y<0||pt.y>bank.rows*13)return;choose({seat:Math.floor(pt.x/12)+1,row:Math.floor(pt.y/13)+1});}}>{Array.from({length:bank.rows},(_,r)=><g key={r}><text x={-15} y={r*13+9} fontSize={7} fill="#737b8b">{r+1}</text>{Array.from({length:bank.seats},(_,s)=><circle key={s} cx={s*12+6} cy={r*13+6} r={selection.row===r+1&&selection.seat===s+1?4.8:3} fill={selection.row===r+1&&selection.seat===s+1?'#e10600':'#818b9c'}/>)}</g>)}</svg></div><div className="circuit-grid-precise"><label>Model row<input aria-label="Grid model row" type="number" min={1} max={bank.rows} value={selection.row} onChange={e=>choose({row:Number(e.target.value)})}/></label><label>Position<input aria-label="Grid position" type="number" min={1} max={bank.seats} value={selection.seat} onChange={e=>choose({seat:Number(e.target.value)})}/></label></div><footer><p>Model section {selection.section} / row {selection.row} / position {selection.seat}</p><button onClick={()=>{returnToScene.current=true;setFollowing(false);setGrid(false);setMode('seat');}}>View this position in 3D</button></footer></dialog>
 </div>;
}
