import { calendars, dateLabel, raceStatus, type Race, type Season } from './races';

export default function SeasonLanding({season,onRace,onBrowse,onVegas}:{season:Season;onRace:(race:Race)=>void;onBrowse:()=>void;onVegas:()=>void}) {
  const upcoming = calendars[season].filter(race=>raceStatus(race)!=='Past').slice(0,2);
  return <>
    <section className="season-landing" aria-labelledby="season-landing-title">
      <div className="season-landing-copy">
        <h1 id="season-landing-title">Know your view.<br/><em>Before you book.</em></h1>
        <p>Choose a race. Compare viewing areas, explore illustrative 3D studies and find the right ticket source.</p>
        <button className="landing-primary" onClick={onBrowse}>Browse {season} races<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
        <p className="landing-boundary">Independent race planning. Estimated views; tickets sold by external providers.</p>
      </div>
      <a className="landing-scene" href={`?season=${season}&race=las-vegas&screen=vegas`} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();onVegas();}}>
        <img src="/las-vegas-preview.webp" alt="Our 3D reconstruction of the Sphere zone and Las Vegas viewing banks" width="1000" height="800" fetchPriority="high" />
        <div className="landing-scene-caption"><div><strong>Las Vegas. The Sphere zone.</strong><span>Illustrative 3D · 2026 reference</span></div><span className="landing-scene-action">Explore<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></div>
      </a>
    </section>
    {!!upcoming.length&&<section className="landing-upcoming" aria-label={`Next ${season} race guides`}>
      <h2>{season===2026?'Still to race.':'Start planning.'}<span>{season} season</span></h2>
      <div>{upcoming.map(race=><button key={race.slug} onClick={()=>onRace(race)}><span className="landing-race-round">R{String(race.round).padStart(2,'0')}</span><span className="landing-race-name"><strong>{race.name}</strong><span>{dateLabel(race)}</span></span><span className="landing-race-action">Race guide<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></button>)}</div>
    </section>}
  </>;
}
