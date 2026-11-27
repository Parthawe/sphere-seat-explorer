import RaceHighlights from "./RaceHighlights";
import HeroSceneBoundary from "./HeroSceneBoundary";
import UiIcon from "./UiIcon";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type Race, type Season } from './races';

export default function SeasonLanding({season,onRace,onBrowse}:{season:Season;onRace:(race:Race)=>void;onBrowse:()=>void}) {
  const hero=useRef<HTMLElement>(null),world=useRef<HTMLDivElement>(null);
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [motion,setMotion]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(query.matches);if(query.matches)setMotion(false);};query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
  const [inView,setInView]=useState(false),[pageVisible,setPageVisible]=useState(()=>!document.hidden);
  const [liveRequested,setLiveRequested]=useState(false),[liveReady,setLiveReady]=useState(false),[liveFailed,setLiveFailed]=useState(false),[retry,setRetry]=useState(0);
  const HeroScene=useMemo(()=>lazy(()=>import('./HeroScene')),[retry]);
  const dataSaver=Boolean((navigator as Navigator & {connection?:{saveData?:boolean}}).connection?.saveData);
  const manualOnly=dataSaver||reduced||(!!location.hash&&location.hash!=='#season-landing-title');
  const active=inView&&pageVisible;
  const ready=useCallback(()=>setLiveReady(true),[]),unavailable=useCallback(()=>{setLiveFailed(true);setLiveReady(false);},[]);
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting));if(world.current)observer.observe(world.current);const visibility=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',visibility);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);};},[]);
  useEffect(()=>{if(!active||liveRequested||manualOnly)return;const load=()=>setLiveRequested(true);if('requestIdleCallback' in window){const id=window.requestIdleCallback(load,{timeout:1200});return()=>window.cancelIdleCallback(id);}const timer=setTimeout(load,0);return()=>clearTimeout(timer);},[active,liveRequested,manualOnly]);
  const [loaded,setLoaded] = useState(false);
  const [previewError,setPreviewError] = useState(false);
  return <>
    <section ref={hero} className="season-landing" aria-labelledby="season-landing-title" data-preview="circuit" data-live={liveReady&&!liveFailed}>
      <div className="season-landing-copy">
        <h1 id="season-landing-title">Know the track.<br/><em>Choose your view.</em></h1>
        <p>Explore circuits and grandstands before you choose your ticket.</p>
        <div className="hero-actions"><button className="landing-primary" onClick={onBrowse}>Explore races<UiIcon name="arrow"/></button></div>
      </div>
      <div ref={world} className="hero-world" aria-busy={liveRequested&&!liveFailed?!liveReady:!loaded}>
        <img src="/hero-vegas-circuit.webp" onLoad={()=>setLoaded(true)} onError={event=>{event.currentTarget.hidden=true;setLoaded(true);setPreviewError(true);}} alt="Illustrative Las Vegas circuit study with grandstands around the illuminated Sphere" width="1510" height="1033" fetchPriority="high" />
        {liveRequested&&!liveFailed&&<div className="hero-renderer" data-ready={liveReady}><HeroSceneBoundary key={retry} onUnavailable={unavailable}><Suspense fallback={null}><HeroScene view="circuit" motion={motion} reduced={reduced} active={active} interactionRef={hero} onReady={ready} onUnavailable={unavailable}/></Suspense></HeroSceneBoundary></div>}
      {liveRequested&&!reduced&&!liveFailed&&<button className="hero-motion-control" aria-label={motion&&!reduced?'Pause animation':'Play animation'} title={reduced?'Reduced motion is enabled':motion?'Pause animation':'Play animation'} disabled={reduced} aria-pressed={motion&&!reduced} onClick={()=>setMotion(value=>!value)}><UiIcon name={motion&&!reduced?'pause':'play'}/><span>{motion&&!reduced?'Pause':'Play'}</span></button>}

        {(liveFailed||(!liveRequested&&manualOnly))&&<button className="hero-live-retry" onClick={()=>{setLiveFailed(false);setLiveReady(false);setRetry(value=>value+1);setLiveRequested(true);const rect=world.current?.getBoundingClientRect();if(rect&&(rect.bottom<=0||rect.top>=innerHeight))hero.current?.scrollIntoView({block:'start',behavior:reduced?'instant':'smooth'});}}>{liveFailed?'Retry 3D':'Load 3D'}</button>}
      <div className="hero-scene-caption">
        <strong>Las Vegas / Sphere</strong>
        <p aria-live="polite">{liveFailed?'Image preview · 3D unavailable':previewError?'Preview unavailable':!loaded&&!liveReady?'Loading preview…':liveReady?'Illustrative 2026 study · simulated cars · seats unverified':'Illustrative 2026 study · exact seats unverified'}</p>
        <details className="hero-credits"><summary>Scene credits</summary><span>Scene geography © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a> · Lunar imagery <a href="https://svs.gsfc.nasa.gov/4720/" target="_blank" rel="noreferrer">NASA</a></span></details>
      </div>
      </div>
    </section>
    <RaceHighlights season={season} onRace={onRace}/>
  </>;
}
