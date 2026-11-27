import VenueReferences from './VenueReferences';
import {standAnchor} from './venueReferenceData';
import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import type {Race} from './races';
import {venueStandCatalogue} from './standCatalogueData';
import {circuitGuideFor,circuitTicketSource} from './circuitGuides';
import UiIcon from './UiIcon';
export default function VenueStands({race,hideMedia=false,includeReferences=true}:{race:Race;hideMedia?:boolean;includeReferences?:boolean}) {
 const [expanded,setExpanded]=useState(()=>location.hash.startsWith('#stand-option-'));
 const searchInput=useRef<HTMLInputElement>(null);
 const catalogue=useMemo(()=>venueStandCatalogue(race),[race]),[search,setSearch]=useState(''),[filter,setFilter]=useState('all');
 const lastAnchor=useRef<string|null>(null);
 const revealAnchor=useCallback(()=>{const hash=location.hash;if(lastAnchor.current===hash)return;lastAnchor.current=hash;if(hash.startsWith('#stand-option-')){setExpanded(true);setSearch('');setFilter('all');}},[]);
 useEffect(revealAnchor);
 useEffect(()=>{window.addEventListener('hashchange',revealAnchor);return()=>window.removeEventListener('hashchange',revealAnchor);},[revealAnchor]);
 const entries=catalogue.entries.filter(e=>(filter==='all'||e.kind===filter)&&`${e.name} ${e.group}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
 const shown=!expanded&&!search.trim()&&filter==='all'?entries.slice(0,6):entries;
 const guide=circuitGuideFor(race.season,race.slug),official=guide?circuitTicketSource(guide,race.season):null;
 const modeled=catalogue.entries.filter(e=>e.kind==='model').length,areas=catalogue.entries.filter(e=>e.kind==='area').length,sources=catalogue.entries.filter(e=>e.kind==='source').length;
 return <section id="venue-stands" className="venue-stands" aria-labelledby="venue-stands-title"><header><div><h2 id="venue-stands-title">Grandstands & viewing options</h2><p>{modeled?`${modeled} modeled · `:''}{areas?`${areas} area references · `:''}{sources?`${sources} source-only · `:''}{race.season}{catalogue.referenceSeason!==race.season?` · ${catalogue.referenceSeason} reference`:''}</p></div><div className="venue-stands-header-actions"><a className="venue-stands-overview" href="#venue-references"><UiIcon name="camera"/>Photos & sources</a>{catalogue.overview&&<a className="venue-stands-overview" href={catalogue.overview}><UiIcon name="circuit"/>{modeled?'Show all modeled stands':'Open venue map'}</a>}</div></header>
 <p className="venue-stands-note">{catalogue.note}</p>
 {catalogue.entries.length>0?<><div className="venue-stand-tools"><label><UiIcon name="search"/><span className="sr-only">Find a stand or option</span><input ref={searchInput} aria-label="Find a stand or option" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a stand or option"/></label><div role="group" aria-label="Stand coverage filter">{[['all','All'],['model','Venue 3D'],['area','Area map'],['source','Source only']].filter(([key])=>key==='all'||catalogue.entries.some(e=>e.kind===key)).map(([key,label])=><button key={key} aria-pressed={filter===key} onClick={()=>setFilter(key)}>{label}</button>)}</div></div>
 <p className="venue-stand-count" role="status">{shown.length} shown · {catalogue.entries.length} known options</p>
 <ul className="venue-stand-options" id="venue-options-list">{shown.map(e=><li key={e.id} id={standAnchor(e.id)} tabIndex={-1}><a href={e.href} {...(e.kind==='source'?{target:'_blank',rel:'noreferrer'}:{})}><UiIcon name={e.kind==='model'?'seat':e.kind==='area'?'map':'info'}/><span><strong>{e.name}</strong><small>{e.kind==='model'?'Illustrative 3D study':e.kind==='area'?'Approximate area map':'Product source'}</small></span><UiIcon name="arrow"/></a><details><summary>Details & source</summary><p>{e.note}</p><a href={`?season=${race.season}&race=${race.slug}&media=${encodeURIComponent(e.id)}#venue-references`}>Photos & viewing videos<UiIcon name="camera"/></a><a href={e.source} target="_blank" rel="noreferrer">Original product information</a></details></li>)}</ul>
 {entries.length>6&&!search.trim()&&filter==='all'&&<button className="venue-options-toggle" aria-expanded={expanded} aria-controls="venue-options-list" onClick={()=>{setExpanded(!expanded);if(expanded)requestAnimationFrame(()=>{searchInput.current?.focus({preventScroll:true});document.getElementById('venue-stands')?.scrollIntoView({block:'start',behavior:'instant'});});}}>{expanded?'Show fewer options':`Show all ${entries.length} options`}<UiIcon name={expanded?'list':'plus'}/></button>}
 {!entries.length&&<p>No matching options. <button onClick={()=>{setSearch('');setFilter('all');searchInput.current?.focus();}}>Clear filters</button></p>}</>:<p>No stand locations or seating are invented to fill this gap.</p>}
 <footer><span>Known catalogue entries, not a live or guaranteed complete inventory.</span>{official&&<a href={official} target="_blank" rel="noreferrer">Event-year ticket catalogue<UiIcon name="arrow"/></a>}</footer>{includeReferences&&<VenueReferences race={race} hideMedia={hideMedia}/>}</section>;
}
