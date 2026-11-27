import { useAreaUrl } from "./useAreaUrl";
import { SITE_ORIGIN } from "./brand";
import {useState} from 'react';
import CircuitAreaMap from './CircuitAreaMap';
import AreaComparison from './AreaComparison';
import {requireVenue,venueAreaUrl} from './venueRegistry';
import {useAreaComparison} from './useAreaComparison';
import {SUZUKA_TICKETS,suzukaOtherOptions,suzukaSeatGuides} from './suzuka';
const venue=requireVenue('japan',2027);
export default function SuzukaDesk(){
 const [area,setArea]=useState(()=>venue.areas.find(a=>a.id===new URLSearchParams(location.search).get('area'))?.id??'v1');
 const [feedback,setFeedback]=useState('');const chosen=venue.areas.find(a=>a.id===area)!,comparison=useAreaComparison(venue),guide=suzukaSeatGuides[area];
  useAreaUrl(venue, area, setArea, "v1");
 function choose(id:string){setArea(id);setFeedback('');}
 async function share(){const url=venueAreaUrl(SITE_ORIGIN,venue,area);try{await navigator.clipboard.writeText(url);setFeedback('Area link copied. No ticket or personal information included.');}catch{setFeedback('Copy area link: '+url);}}
 return <section className="ticket-desk suzuka-ticket-desk" aria-label="Suzuka 2027 viewing areas">
  <div className="desk-topline"><div><h2>Find your corner at Suzuka.</h2><p>Nineteen grandstand families from the current 2027 organizer catalogue. Choose the code printed on your ticket, compare broad locations and open the original seating references.</p></div></div>
  <p className="singapore-reference-note">9–11 April 2027 · North-up geographic map · Estimated viewing regions. V1 and V2 are different tiers, not separate surveyed footprints here. No exact chair or 3D seat view is available yet.</p>
  <div className="ticket-workspace">
   <CircuitAreaMap venue={venue} selected={area} onSelect={choose}/>
   <div className="ticket-panel">
    <div className="area-introduction"><h3>Start with the stand code.</h3><p>A section, row or seat number alone cannot locate a chair. Choose the product name first; outlet and special-access variants need the organizer’s own checks.</p><label htmlFor="suzuka-viewing-area">Grandstand family</label><select id="suzuka-viewing-area" value={area} onChange={e=>choose(e.target.value)}>{venue.areas.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
    <div className="selected-area-details" aria-live="polite"><h3>{chosen.name}</h3><p>{chosen.position}</p><dl className="suzuka-facts"><div><dt>Published seating type</dt><dd>{chosen.kind}</dd></div><div><dt>Location evidence</dt><dd>{chosen.confidence}</dd></div></dl>{!guide&&<p>{chosen.description}</p>}</div>
    {guide&&<section className="suzuka-seat-reference" aria-label="Official seating diagram"><h4>Check your block, row & seat.</h4><p>{guide.note}</p><a href={guide.diagram} target="_blank" rel="noreferrer">Open official seating diagram (PDF)</a><small>The organizer labels these charts as schematic. They do not supply measured tier heights or a view from your exact seat. Opens the original source.</small></section>}
    <a className="abu-provider-primary" href={chosen.source} target="_blank" rel="noreferrer">Organizer’s product & viewing references</a>
    <p className="reference-note">The Japanese-language product pages include seating diagrams and, where supplied, original 360° or video links. Their capture year and exact ticket match are unverified. Photographs stay with the organizer; these are separate from our map.</p>
    <div className="area-actions"><button onClick={()=>setFeedback(comparison.toggle(area)?'Three areas saved. Remove one before adding another.':'')}>{comparison.saved.includes(area)?'Remove from comparison':comparison.saved.length===3?'Comparison full · 3/3':'Compare this area'}</button><button onClick={share}>Share area</button></div><p className="desk-feedback" role="status">{feedback}</p>
   </div>
  </div>
  <AreaComparison venue={venue} saved={comparison.saved} persistent={comparison.persistent} onSelect={choose} onRemove={id=>{comparison.remove(id);setFeedback('Area removed from comparison.');}} onClear={()=>{comparison.clear();setFeedback('Area comparison cleared.');}}/>
  <details className="ticket-methodology suzuka-other-options"><summary>Other tickets & hospitality</summary><p>These are distinct source-only options. No reserved chair, platform, box or room is assigned on this map.</p><div>{suzukaOtherOptions.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.note}</p><a href={o.source} target="_blank" rel="noreferrer">Official product information</a></article>)}</div></details>
  <section className="abu-ticket-handoffs"><h2>Continue with the organizer.</h2><p>The current Japanese catalogue links MobilityStation and directs some countries or regions to F1 Tickets. Purchases happen with those providers; availability, seat assignment and eligibility must be checked there.</p><div className="verified-event-links"><a href={SUZUKA_TICKETS} target="_blank" rel="noreferrer">2027 organizer catalogue & sales channels</a><a href="https://ticketing.formula1.com/japan/" target="_blank" rel="noreferrer">Organizer-linked F1 Tickets</a><a href="https://www.suzukacircuit.jp/f1/ticket/pdf/grandstand_f1.pdf" target="_blank" rel="noreferrer">V1 / V2 & pit-building diagram</a></div></section>
  <details className="ticket-methodology"><summary>Map accuracy, crossover & source limits</summary><p>Checked 25 November 2026. The Japanese catalogue explicitly covers 2027; some English ticket pages still describe 2026, so their layouts or conditions are not carried forward.</p><p>GP geography is adapted from OpenStreetMap relation 284570, excluding the pit lane. The upper bridge is drawn over the lower track in this 2D map using source layer tags. Bridge height, clearance, terrain and structures are unmeasured; no 3D crossing or historical car replay is supplied.</p><p>Named source grandstands anchor broad regions. A2, H and I use estimated corner regions; shared G/D/Q2 areas, tier boundaries, sections, obstructions, canopies and exact seats are unresolved. This is not a live inventory or a complete hospitality/access catalogue.</p><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors · ODbL</a><a href={venue.download} download>Download adapted geography and source metadata</a></details>
 </section>;
}
