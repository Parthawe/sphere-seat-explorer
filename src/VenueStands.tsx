import VenueReferences from './VenueReferences';
import {standAnchor} from './venueReferenceData';
import {standConceptKind,standConceptUrl} from './standConcept';
import {useMemo,useState} from 'react';
import type {Race} from './races';
import {venueStandCatalogue} from './standCatalogueData';
import {circuitGuideFor,circuitTicketSource} from './circuitGuides';
import UiIcon from './UiIcon';
export default function VenueStands({race}:{race:Race}) {
 const catalogue=useMemo(()=>venueStandCatalogue(race),[race]),[search,setSearch]=useState(''),[filter,setFilter]=useState('all');
 const entries=catalogue.entries.filter(e=>(filter==='all'||e.kind===filter||(filter==='concept'&&standConceptKind(e)))&&`${e.name} ${e.group}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
 const guide=circuitGuideFor(race.season,race.slug),official=guide?circuitTicketSource(guide,race.season):null;
 const modeled=catalogue.entries.filter(e=>e.kind==='model').length,areas=catalogue.entries.filter(e=>e.kind==='area').length,sources=catalogue.entries.filter(e=>e.kind==='source').length;
 return <section id="venue-stands" className="venue-stands" aria-labelledby="venue-stands-title"><header><div><h2 id="venue-stands-title">Grandstands & viewing options</h2><p>{modeled?`${modeled} modeled · `:''}{areas?`${areas} area references · `:''}{sources?`${sources} source-only · `:''}{race.season}{catalogue.referenceSeason!==race.season?` · ${catalogue.referenceSeason} reference`:''}</p></div><a className="venue-stands-overview" href="#venue-references"><UiIcon name="camera"/>Photos & sources</a>{catalogue.overview&&<a className="venue-stands-overview" href={catalogue.overview}><UiIcon name="circuit"/>{modeled?'Show all modeled stands':'Open venue map'}</a>}</header>
 <p className="venue-stands-note">{catalogue.note} Generic 3D concepts are separate from venue reconstructions.</p>
 {catalogue.entries.length>0?<><div className="venue-stand-tools"><label><UiIcon name="search"/><span className="sr-only">Find a stand or option</span><input aria-label="Find a stand or option" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a stand or option"/></label><div role="group" aria-label="Stand coverage filter">{[['all','All'],['model','Venue 3D'],['concept','3D concepts'],['area','Area map'],['source','Source only']].filter(([key])=>key==='all'||(key==='concept'?catalogue.entries.some(e=>standConceptKind(e)):catalogue.entries.some(e=>e.kind===key))).map(([key,label])=><button key={key} aria-pressed={filter===key} onClick={()=>setFilter(key)}>{label}</button>)}</div></div>
 <p className="venue-stand-count" role="status">{entries.length} shown · {catalogue.entries.length} known options</p>
 <ul className="venue-stand-options">{entries.map(e=><li key={e.id} id={standAnchor(e.id)} tabIndex={-1}><a href={e.href} {...(e.kind==='source'?{target:'_blank',rel:'noreferrer'}:{})}><UiIcon name={e.kind==='model'?'seat':e.kind==='area'?'map':'info'}/><span><strong>{e.name}</strong><small>{e.kind==='model'?'Illustrative 3D study':e.kind==='area'?'Approximate area map':'Product source'}</small></span><UiIcon name="arrow"/></a>{standConceptKind(e)&&<a className="stand-concept-link" href={standConceptUrl(race,e.id)}><UiIcon name="cube"/>Open 3D concept<span className="sr-only"> · {e.name}</span></a>}<details><summary>Details & source</summary><p>{e.note}</p>{race.season===2027&&["japan","saudi-arabia"].includes(race.slug)&&<a href={`?season=${race.season}&race=${race.slug}&media=${encodeURIComponent(e.id)}#venue-references`}>Photos & viewing videos<UiIcon name="camera"/></a>}<a href={e.source} target="_blank" rel="noreferrer">Original product information</a></details></li>)}</ul>
 {!entries.length&&<p>No matching options. <button onClick={()=>{setSearch('');setFilter('all');}}>Clear filters</button></p>}</>:<p>No stand locations or seating are invented to fill this gap.</p>}
 <footer><span>Known catalogue entries, not a live or guaranteed complete inventory.</span>{official&&<a href={official} target="_blank" rel="noreferrer">Event-year ticket catalogue<UiIcon name="arrow"/></a>}</footer><VenueReferences race={race}/></section>;
}
