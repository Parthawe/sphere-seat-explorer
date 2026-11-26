import HeroSceneBoundary from "./HeroSceneBoundary";
import UiIcon from "./UiIcon";
import { useHeroDepth } from "./useHeroDepth";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calendars, dateLabel, raceStatus, type Race, type Season } from './races';

export default function SeasonLanding({season,onRace,onBrowse,onVegas}:{season:Season;onRace:(race:Race)=>void;onBrowse:()=>void;onVegas:(view:'overview'|'seat')=>void}) {
  const hero=useRef<HTMLElement>(null),world=useRef<HTMLDivElement>(null);
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [motion,setMotion]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(query.matches);if(query.matches)setMotion(false);};query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
  const [inView,setInView]=useState(false),[pageVisible,setPageVisible]=useState(()=>!document.hidden);
  const [liveRequested,setLiveRequested]=useState(false),[liveReady,setLiveReady]=useState(false),[liveFailed,setLiveFailed]=useState(false),[retry,setRetry]=useState(0);
  const HeroScene=useMemo(()=>lazy(()=>import('./HeroScene')),[retry]);
  const dataSaver=Boolean((navigator as Navigator & {connection?:{saveData?:boolean}}).connection?.saveData);
  const active=inView&&pageVisible;
  const ready=useCallback(()=>setLiveReady(true),[]),unavailable=useCallback(()=>{setLiveFailed(true);setLiveReady(false);},[]);
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting));if(world.current)observer.observe(world.current);const visibility=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',visibility);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);};},[]);
  useEffect(()=>{if(!active||liveRequested||dataSaver)return;const load=()=>setLiveRequested(true);if('requestIdleCallback' in window){const id=window.requestIdleCallback(load,{timeout:1200});return()=>window.cancelIdleCallback(id);}const timer=setTimeout(load,0);return()=>clearTimeout(timer);},[active,liveRequested,dataSaver]);
  useHeroDepth(hero,motion&&!reduced&&!liveRequested);
  const [preview,setPreview] = useState<'circuit'|'seat'>('circuit');
  const [loaded,setLoaded] = useState(false);
  const [previewError,setPreviewError] = useState(false);
  const mode=preview==='circuit'?'overview':'seat';
  const upcoming = calendars[season].filter(race=>raceStatus(race)!=='Past').slice(0,2);
  return <>
    <section ref={hero} className="season-landing" aria-labelledby="season-landing-title" data-preview={preview} data-live={liveReady&&!liveFailed}>
      <div ref={world} className="hero-world" aria-busy={liveRequested&&!liveFailed?!liveReady:!loaded}>
        <img key={preview} src={`/hero-vegas-${preview}.webp`} onLoad={()=>setLoaded(true)} onError={event=>{event.currentTarget.hidden=true;setLoaded(true);setPreviewError(true);}} alt={preview==='circuit'?'Illustrative Las Vegas circuit and grandstands around the illuminated Sphere':'Illustrative view toward the Sphere from a modeled Chicane east position'} width="1510" height="1033" fetchPriority="high" />
        {liveRequested&&!liveFailed&&<div className="hero-renderer" data-ready={liveReady}><HeroSceneBoundary key={retry} onUnavailable={unavailable}><Suspense fallback={null}><HeroScene view={preview} motion={motion} reduced={reduced} active={active} interactionRef={hero} onReady={ready} onUnavailable={unavailable}/></Suspense></HeroSceneBoundary></div>}
      </div>
      <div className="hero-camera-switch" role="group" aria-label="3D camera views">
        {(['circuit','seat'] as const).map(view=><button key={view} aria-label={view==='circuit'?'Circuit view':'Seated view'} aria-pressed={preview===view} onClick={()=>{if(view!==preview){setLoaded(false);setPreviewError(false);setPreview(view);}}}><UiIcon name={view==='circuit'?'circuit':'seat'}/><span>{view==='circuit'?'Circuit':'Seat'}</span></button>)}
      </div>
      <button className="hero-motion-control" aria-label={motion&&!reduced?'Pause animation':'Play animation'} title={reduced?'Reduced motion is enabled':motion?'Pause animation':'Play animation'} disabled={reduced} aria-pressed={motion&&!reduced} onClick={()=>setMotion(value=>!value)}><UiIcon name={motion&&!reduced?'pause':'play'}/><span>Motion</span></button>
      <div className="season-landing-copy">
        <h1 id="season-landing-title">Find your<br/><em>race view.</em></h1>
        <p>Explore the circuit. Compare the view. Choose your race.</p>
        <div className="hero-actions">
          <a className="landing-primary" href={`?season=${season}&race=las-vegas&screen=seats&view=${mode}&seat=C:12:18`} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();onVegas(mode);}}>Explore 3D<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>
          <button className="hero-secondary" onClick={onBrowse}><UiIcon name="calendar"/>All {season} races</button>
        </div>
        <p className="landing-boundary">Illustrative views. Exact ticket seats are unverified.</p>
      </div>
      <div className="hero-scene-caption">
        <strong>Las Vegas / Sphere zone</strong>
        <p aria-live="polite">{liveFailed?'3D unavailable · image preview':liveReady?'3D scene · 2026 reference · simulated cars':previewError?'Preview unavailable. Open the 3D study to explore.':!loaded?'Loading preview…':liveRequested?'Loading 3D scene…':preview==='circuit'?'Circuit overview · illustrative 2026 study':'Chicane east · illustrative 2026 seated study'}</p>
        {(liveFailed||(!liveRequested&&dataSaver))&&<button className="hero-live-retry" onClick={()=>{setLiveFailed(false);setLiveReady(false);setRetry(value=>value+1);setLiveRequested(true);const rect=world.current?.getBoundingClientRect();if(rect&&(rect.bottom<=0||rect.top>=innerHeight))hero.current?.scrollIntoView({block:'start',behavior:reduced?'instant':'smooth'});}}>{liveFailed?'Retry 3D':'Load 3D'}</button>}
        <span>Scene geography © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a> · Lunar imagery <a href="https://svs.gsfc.nasa.gov/4720/" target="_blank" rel="noreferrer">NASA</a></span>
      </div>
    </section>
    {!!upcoming.length&&<section className="landing-upcoming" aria-label={`Next ${season} race guides`}>
      <h2>{season===2026?'Still to race.':'Start planning.'}<span>{season} season</span></h2>
      <div>{upcoming.map(race=><button key={race.slug} onClick={()=>onRace(race)}><span className="landing-race-round">R{String(race.round).padStart(2,'0')}</span><span className="landing-race-name"><strong>{race.name}</strong><span>{dateLabel(race)}</span></span><span className="landing-race-action">Race guide<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></button>)}</div>
    </section>}
  </>;
}
