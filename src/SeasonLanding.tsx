import { useState } from "react";
import { calendars, dateLabel, raceStatus, type Race, type Season } from './races';

export default function SeasonLanding({season,onRace,onBrowse,onVegas}:{season:Season;onRace:(race:Race)=>void;onBrowse:()=>void;onVegas:(view:'overview'|'seat')=>void}) {
  const [preview,setPreview] = useState<'circuit'|'seat'>('circuit');
  const [loaded,setLoaded] = useState(false);
  const [previewError,setPreviewError] = useState(false);
  const mode=preview==='circuit'?'overview':'seat';
  const upcoming = calendars[season].filter(race=>raceStatus(race)!=='Past').slice(0,2);
  return <>
    <section className="season-landing" aria-labelledby="season-landing-title" data-preview={preview}>
      <div className="hero-world" aria-busy={!loaded}>
        <img key={preview} src={`/hero-vegas-${preview}.webp`} onLoad={()=>setLoaded(true)} onError={event=>{event.currentTarget.hidden=true;setLoaded(true);setPreviewError(true);}} alt={preview==='circuit'?'Illustrative Las Vegas circuit and grandstands around the illuminated Sphere':'Illustrative view toward the Sphere from a modeled Chicane east position'} width="1510" height="1033" fetchPriority="high" />
      </div>
      <div className="hero-camera-switch" role="group" aria-label="3D study preview images">
        {(['circuit','seat'] as const).map(view=><button key={view} aria-pressed={preview===view} onClick={()=>{if(view!==preview){setLoaded(false);setPreviewError(false);setPreview(view);}}}>{view==='circuit'?'Circuit view':'Seated view'}</button>)}
      </div>
      <div className="season-landing-copy">
        <h1 id="season-landing-title">Know your view.<br/><em>Before you book.</em></h1>
        <p>From the Sphere to the starting grid. Explore the view, compare the areas and plan your race weekend.</p>
        <div className="hero-actions">
          <a className="landing-primary" href={`?season=${season}&race=las-vegas&screen=seats&view=${mode}&seat=C:12:18`} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();onVegas(mode);}}>Explore Las Vegas 3D<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>
          <button className="hero-secondary" onClick={onBrowse}>Browse {season} races</button>
        </div>
        <p className="landing-boundary">Estimated views, not exact ticket seats.<br/>Independent planning. Book with external providers.</p>
      </div>
      <div className="hero-scene-caption">
        <strong>Las Vegas / Sphere zone</strong>
        <p aria-live="polite">{previewError?'Preview unavailable. Open the 3D study to explore.':!loaded?'Loading preview…':preview==='circuit'?'Circuit overview · illustrative 2026 study':'Chicane east · illustrative 2026 seated study'}</p>
        <span>Scene geography © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a> · Lunar imagery <a href="https://svs.gsfc.nasa.gov/4720/" target="_blank" rel="noreferrer">NASA</a></span>
      </div>
    </section>
    {!!upcoming.length&&<section className="landing-upcoming" aria-label={`Next ${season} race guides`}>
      <h2>{season===2026?'Still to race.':'Start planning.'}<span>{season} season</span></h2>
      <div>{upcoming.map(race=><button key={race.slug} onClick={()=>onRace(race)}><span className="landing-race-round">R{String(race.round).padStart(2,'0')}</span><span className="landing-race-name"><strong>{race.name}</strong><span>{dateLabel(race)}</span></span><span className="landing-race-action">Race guide<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></button>)}</div>
    </section>}
  </>;
}
