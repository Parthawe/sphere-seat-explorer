import {lazy,Suspense} from 'react';
import type {Race} from './races';
import UiIcon from './UiIcon';
import {raceGuideUrl,standAnchor,venueReferenceData} from './venueReferenceData';
import {circuitLayoutId} from './circuitLayouts';
import {venueStandCatalogue} from './standCatalogueData';

const StandMediaGallery=lazy(()=>import('./StandMediaGallery'));

export default function VenueReferences({race,optionId,hideMedia=false}:{race:Race;optionId?:string;hideMedia?:boolean}){
 const {option,links,reports,areaReports}=venueReferenceData(race,optionId),catalogue=venueStandCatalogue(race);
 return <section id="venue-references" className="venue-references" aria-labelledby="venue-references-title">
  <header><div><p>{race.name} / {race.season}</p><h2 id="venue-references-title">See the evidence.</h2></div><UiIcon name="camera"/></header>
  <nav aria-label="Explore this race">
   <a href={raceGuideUrl(race,option?standAnchor(option.id):undefined)}><UiIcon name="seat"/>{option?'Return to this option':'Viewing options'}</a>
   {circuitLayoutId(race.season,race.slug)&&<a href={`?season=${race.season}&race=${race.slug}&screen=layout`}><UiIcon name="circuit"/>Circuit diagram</a>}
   {catalogue.overview&&<a href={catalogue.overview}><UiIcon name="map"/>Venue overview</a>}
   <a href={`?season=${race.season}&screen=racing`}><UiIcon name="grid"/>Championship</a>
  </nav>
  {(!hideMedia&&race.season===2027&&(race.slug==='japan'||race.slug==='saudi-arabia'))&&<Suspense fallback={<p role="status">Loading stand media…</p>}><StandMediaGallery race={race} optionId={optionId}/></Suspense>}
  <div className="venue-reference-columns"><div><h3>Maps & organizer sources</h3><ul>{links.map(link=><li key={link.url}><a href={link.url} target="_blank" rel="noreferrer">{link.title}<UiIcon name="arrow"/></a><p>{link.note}</p></li>)}</ul>{!links.length&&<p>No checked organizer reference is available for this edition.</p>}</div>
  <div><h3>From the grandstands <span>{reports.length}</span></h3><p>Previous visits. Author-reported locations; no report verifies a generated model seat.</p>{option&&<p>{areaReports.length?`${areaReports.length} linked to this named viewing area; exact seat unverified.`:'No checked report matched to this option. Venue-wide references below may describe other areas.'}</p>}
   {reports.length?<details><summary>Browse dated photos & reports</summary><ul>{reports.map(r=><li key={r.id}><a href={r.url} target="_blank" rel="noreferrer">{r.title}<UiIcon name={r.kind==='photos'?'camera':'arrow'}/></a><p>{r.year} visit · {r.author} · {r.publisher}{areaReports.includes(r)?' · same named area':''}</p><p>{r.location}</p><details><summary>What this reference can tell you</summary><p>{r.summary}</p><p>{r.expectation}</p><p>Year evidence: {r.yearEvidence} · checked {r.checked}</p></details></li>)}</ul></details>:<p>No checked spectator photos or reports yet. Use the original sources alongside the illustrative views.</p>}
  </div></div><footer>Original media stays with its publisher. External photos and videos load only when requested.</footer>
 </section>;
}
