import {useEffect,useRef,useState} from 'react';
import {dateLabel,raceStatus,type Race} from './races';
import {racePhotoFor,raceFlagFor,raceStudyLink} from './raceCards';
import {calendarEntryFor} from './calendarIndex';
import {raceCoverage} from './raceCoverage';
import CircuitThumbnail from './CircuitThumbnail';
import UiIcon from './UiIcon';

export function RacePhoto({race,priority=false}:{race:Race;priority?:boolean}){
 const photo=racePhotoFor(race),[failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[photo?.src]);
 return <span className="race-card-image">{photo&&!failed?<img src={photo.src} width={photo.width} height={photo.height} alt="" loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async" onError={()=>setFailed(true)}/>:<span className="race-image-fallback"><CircuitThumbnail season={race.season} race={race.slug}/><span>Circuit study</span></span>}<span className="race-image-kind">{failed?'Circuit study':photo?photo.kind+(photo.kind==='Circuit illustration'?'':` · ${photo.capture==='Date unverified'?'date unknown':photo.capture}`):'Circuit study'}</span></span>;
}
export function PhotoCredit({race}:{race:Race}){
 const photo=racePhotoFor(race),panel=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{const outside=(event:PointerEvent)=>{if(panel.current?.open&&!panel.current.contains(event.target as Node))panel.current.open=false;},escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&panel.current?.open){const owned=panel.current.contains(document.activeElement);panel.current.open=false;if(owned)panel.current.querySelector('summary')?.focus();}};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};},[]);
 if(!photo)return null;
 return <details ref={panel} className="race-photo-credit"><summary aria-label={`Image credit for ${race.name}`} title="Image credit"><UiIcon name="info"/></summary><div><strong>{photo.kind} · {photo.capture}</strong><p>{photo.author}</p><p>{photo.title}</p><a href={photo.source} target="_blank" rel="noreferrer">Original image / source</a><a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a><p>Source-reported year; display crop. Not a verified seat view or current-edition layout.</p></div></details>;
}
export default function RaceCard({race,onSelect}:{race:Race;onSelect:(race:Race)=>void}){
 const flag=raceFlagFor(race),coverage=raceCoverage(race.season,race.slug);
 return <article className="race-card"><button className="race-row" onClick={()=>onSelect(race)} aria-label={`${race.name} ${race.season} · ${dateLabel(race)} · open race guide`}>
  <RacePhoto race={race}/><span className="race-card-meta"><span>Round {String(race.round).padStart(2,'0')}</span><span className={raceStatus(race)==='Race weekend'?'race-weekend-now':''}>{raceStatus(race)}</span></span>
  <span className="race-card-body"><strong>{flag&&<img className="race-flag" src={`/flags/${flag}.svg`} width="28" height="21" alt=""/>}{race.name}</strong><span className="race-card-venue">{calendarEntryFor(race.season,race.slug)?.venue}</span><span className="race-card-bottom"><span className="race-dates"><UiIcon name="calendar"/>{dateLabel(race)}</span><CircuitThumbnail season={race.season} race={race.slug}/></span></span>
 </button><a className="race-card-action" href={raceStudyLink(race)} aria-label={`Open ${race.name} ${race.season} ${coverage.kind==='reference3d'?'2026 reference study':'3D study'}`} title={coverage.detail}><span><UiIcon name={coverage.kind==='model'?'seat':'cube'}/>{coverage.kind==='model'?'3D seating study':coverage.kind==='reference3d'?'3D · 2026 reference':'Circuit study'}</span><UiIcon name="arrow"/></a><PhotoCredit race={race}/></article>;
}
