import {useState} from 'react';
import RaceHighlights from './RaceHighlights';
import Race3DPreview from './Race3DPreview';
import UiIcon from './UiIcon';
import {calendars,dateLabel,raceStatus,type Race,type Season} from './races';

export default function SeasonLanding({season,onRace}:{season:Season;onRace:(race:Race)=>void}) {
 const races=calendars[season],defaultRace=races.find(r=>raceStatus(r)!=='Past')??races[0];
 const [choice,setChoice]=useState({season,slug:defaultRace.slug});
 const chosenRace=(choice.season===season?races.find(r=>r.slug===choice.slug):null)??defaultRace;
 return <>
  <section className="season-landing" aria-labelledby="season-landing-title">
   <div className="hero-introduction">
    <div className="season-landing-copy"><h1 id="season-landing-title">Know the track.<br/><em>Choose your view.</em></h1><p>Explore circuits and grandstands before you choose your ticket.</p></div>
    <form className="hero-race-picker" onSubmit={event=>{event.preventDefault();onRace(chosenRace);}}>
     <label htmlFor="hero-race-choice">Choose a race</label>
     <div><select id="hero-race-choice" value={chosenRace.slug} onChange={event=>setChoice({season,slug:event.target.value})}>{races.map(race=><option key={race.slug} value={race.slug}>{race.name}</option>)}</select><button className="landing-primary" type="submit">Explore race<UiIcon name="arrow"/></button></div>
     <p>{dateLabel(chosenRace)} · {season}</p>
    </form>
   </div>
   <div className="hero-circuit"><Race3DPreview key={`${season}-${chosenRace.slug}`} race={chosenRace}/><span className="hero-circuit-name">{chosenRace.name}<span>{season}</span></span></div>
  </section>
  <RaceHighlights season={season} onRace={onRace}/>
 </>;
}
