import {readHomeExperience,saveHomeExperience} from './homeExperience';
import {InstallAppButton} from './InstallApp';
import {lazy,Suspense,useEffect,useState} from 'react';
import RaceHighlights from './RaceHighlights';
import {racePreview,racePreviewLink} from './racePreview';
const EarthJourney=lazy(()=>import('./EarthJourney'));
const Race3DPreview=lazy(()=>import('./Race3DPreview'));
import UiIcon from './UiIcon';
import {calendars,dateLabel,raceStatus,type Race,type Season} from './races';

export default function SeasonLanding({season,onRace,onStudy}:{season:Season;onRace:(race:Race)=>void;onStudy:(race:Race,immersive?:boolean,camera?:'circuit'|'seat')=>void}) {
 const [today,setToday]=useState(()=>new Date().toISOString().slice(0,10));
 useEffect(()=>{const refresh=()=>setToday(new Date().toISOString().slice(0,10));const timer=window.setInterval(refresh,60000);document.addEventListener('visibilitychange',refresh);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',refresh);};},[]);
 const races=calendars[season],defaultRace=races.find(r=>raceStatus(r,today)!=='Past')??races[0];
 const [initial]=useState(()=>readHomeExperience(season));
 const [view,setView]=useState<'world'|'circuit'>(initial.view);
 const [choice,setChoice]=useState<{season:Season;slug:string}|null>(()=>initial.race?{season,slug:initial.race}:null);
 const chosenRace=(choice?.season===season?races.find(r=>r.slug===choice.slug):null)??defaultRace;
 useEffect(()=>saveHomeExperience(season,{view,race:choice?.season===season?choice.slug:null}),[season,view,choice]);
 const [previewCamera,setPreviewCamera]=useState<'circuit'|'seat'>('circuit');
 const preview=racePreview(chosenRace);
 return <>
  <section className={'season-landing season-landing-'+view} aria-labelledby="season-landing-title">
   <div className="hero-introduction">
    <div className="season-landing-copy"><h1 id="season-landing-title">Know the track.<br/><em>Choose your view.</em></h1><p>Explore the circuit before you choose your ticket.</p></div>
    <form className="hero-race-picker" onSubmit={event=>{event.preventDefault();onStudy(chosenRace,true,view==='world'?'circuit':previewCamera);}}>
     <label className="sr-only" htmlFor="hero-race-choice">Choose a race</label>
     <div><span className="hero-race-select"><select id="hero-race-choice" value={chosenRace.slug} onChange={event=>setChoice({season,slug:event.target.value})}>{races.map(race=><option key={race.slug} value={race.slug}>{race.name}</option>)}</select><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></span><button className="landing-primary" type="submit">Explore 3D<UiIcon name="arrow"/></button></div>
     <div className="hero-race-meta"><p>{raceStatus(chosenRace,today)==='Race weekend'?'This weekend · ':chosenRace.slug===defaultRace.slug&&raceStatus(chosenRace,today)==='Upcoming'?'Next race · ':''}{dateLabel(chosenRace)} · {season}</p><button type="button" className="hero-guide-button" onClick={()=>onRace(chosenRace)}>Race guide<UiIcon name="arrow"/></button></div>
    </form>
   </div>
   <div className="hero-view-switch" role="group" aria-label="Explore view"><button aria-pressed={view==='world'} onClick={()=>setView('world')}><UiIcon name="globe"/>World</button><button aria-pressed={view==='circuit'} onClick={()=>setView('circuit')}><UiIcon name="circuit"/>Circuit</button><InstallAppButton/></div>
   {view==='world'?<Suspense fallback={<div className="earth-shell" role="status">Preparing world explorer…</div>}><EarthJourney key={season} race={chosenRace} races={races} onSelect={race=>setChoice({season:race.season,slug:race.slug})} onOpen={onStudy}/></Suspense>:<div className="hero-circuit"><Suspense fallback={<div className="race-3d-preview"><a className="race-3d-preview-link" href={racePreviewLink(chosenRace,previewCamera)} aria-label={`Explore ${chosenRace.name} ${season} in 3D`}><div className="race-3d-preview-stage"><img className="race-3d-poster" src={preview.poster} width="960" height="540" fetchPriority="high" alt={`${chosenRace.name} illustrative circuit study`}/></div><div className="race-3d-preview-footer"><span>{preview.note}</span><strong><UiIcon name={preview.kind!=='outline'&&previewCamera==='seat'?'seat':'circuit'}/>{preview.kind!=='outline'&&previewCamera==='seat'?'Explore seats':'Explore circuit'}<UiIcon name="arrow"/></strong></div></a></div>}><Race3DPreview key={`${season}-${chosenRace.slug}`} race={chosenRace} animated cameraChoice framing={previewCamera} onCameraChange={setPreviewCamera} onOpen={camera=>onStudy(chosenRace,true,camera)}/></Suspense></div>}
  </section>
  <RaceHighlights season={season} onRace={onRace}/>
 </>;
}
