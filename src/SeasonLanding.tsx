import {lazy,Suspense,useEffect,useState} from 'react';
import RaceHighlights from './RaceHighlights';
import {racePreview} from './racePreview';
const Race3DPreview=lazy(()=>import('./Race3DPreview'));
import UiIcon from './UiIcon';
import {calendars,dateLabel,raceStatus,type Race,type Season} from './races';

export default function SeasonLanding({season,onRace}:{season:Season;onRace:(race:Race)=>void}) {
 const [today,setToday]=useState(()=>new Date().toISOString().slice(0,10));
 useEffect(()=>{const refresh=()=>setToday(new Date().toISOString().slice(0,10));const timer=window.setInterval(refresh,60000);document.addEventListener('visibilitychange',refresh);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',refresh);};},[]);
 const races=calendars[season],defaultRace=races.find(r=>raceStatus(r,today)!=='Past')??races[0];
 const [choice,setChoice]=useState<{season:Season;slug:string}|null>(null);
 const chosenRace=(choice?.season===season?races.find(r=>r.slug===choice.slug):null)??defaultRace;
 const preview=racePreview(chosenRace);
 return <>
  <section className="season-landing" aria-labelledby="season-landing-title">
   <div className="hero-introduction">
    <div className="season-landing-copy"><h1 id="season-landing-title">Know the track.<br/><em>Choose your view.</em></h1><p>Explore circuits and grandstands before you choose your ticket.</p></div>
    <form className="hero-race-picker" onSubmit={event=>{event.preventDefault();onRace(chosenRace);}}>
     <label htmlFor="hero-race-choice">Choose a race</label>
     <div><select id="hero-race-choice" value={chosenRace.slug} onChange={event=>setChoice({season,slug:event.target.value})}>{races.map(race=><option key={race.slug} value={race.slug}>{race.name}</option>)}</select><button className="landing-primary" type="submit">Explore race<UiIcon name="arrow"/></button></div>
     <p>{raceStatus(chosenRace,today)==='Race weekend'?'This weekend · ':chosenRace.slug===defaultRace.slug&&raceStatus(chosenRace,today)==='Upcoming'?'Next race · ':''}{dateLabel(chosenRace)} · {season}</p>
    </form>
   </div>
   <div className="hero-circuit"><Suspense fallback={<div className="race-3d-preview"><a className="race-3d-preview-link" href={preview.href} aria-label={`Explore ${chosenRace.name} ${season} in 3D`}><div className="race-3d-preview-stage"><img className="race-3d-poster" src={preview.poster} width="960" height="540" fetchPriority="high" alt={`${chosenRace.name} illustrative circuit study`}/></div><div className="race-3d-preview-footer"><span>{preview.note}</span><strong><UiIcon name="cube"/>Explore 3D<UiIcon name="arrow"/></strong></div></a></div>}><Race3DPreview key={`${season}-${chosenRace.slug}`} race={chosenRace} animated/></Suspense><span className="hero-circuit-name">{chosenRace.name}<span>{season}</span></span></div>
  </section>
  <RaceHighlights season={season} onRace={onRace}/>
 </>;
}
