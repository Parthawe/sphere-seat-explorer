import { useAreaUrl } from "./useAreaUrl";
import { SITE_ORIGIN } from "./brand";
import {useState} from 'react';
import CircuitAreaMap from './CircuitAreaMap';
import AreaComparison from './AreaComparison';
import {requireVenue,venueAreaUrl} from './venueRegistry';
import {useAreaComparison} from './useAreaComparison';
import {MONACO_ROOT,MONACO_MAP,MONACO_CATEGORIES,MONACO_BUY,monacoVariants,monacoOtherOptions} from './monaco';
const venue=requireVenue('monaco',2027);
export default function MonacoDesk(){
 const [area,setArea]=useState(()=>venue.areas.find(a=>a.id===new URLSearchParams(location.search).get('area'))?.id??'k'),[feedback,setFeedback]=useState('');
 const chosen=venue.areas.find(a=>a.id===area)!,comparison=useAreaComparison(venue);
  useAreaUrl(venue, area);
 function choose(id:string){setArea(id);setFeedback('');}
 async function share(){const url=venueAreaUrl(SITE_ORIGIN,venue,area);try{await navigator.clipboard.writeText(url);setFeedback('Area link copied. No ticket or personal information included.');}catch{setFeedback('Copy area link: '+url);}}
 return <section className="ticket-desk monaco-ticket-desk" aria-label="Monaco 2027 viewing areas">
  <div className="desk-topline"><div><h2>Find your place around the harbour.</h2><p>Twelve viewing families from the organizer’s 2027 diagram and category list. Compare the first corner, Casino, pool complex and final corner, or explore the unnumbered standing areas.</p></div></div>
  <p className="singapore-reference-note">Organizer event: 3–6 June 2027 · F1 sessions: 4–6 June · North-up geographic map. Stand positions and boundaries are estimates. Heights, tunnel structure, exact chairs and physical views are not reconstructed.</p>
  <div className="ticket-workspace"><CircuitAreaMap venue={venue} selected={area} onSelect={choose}/><div className="ticket-panel">
   <div className="area-introduction"><span className="eyebrow">MONACO / 2027</span><h3>Choose the code on your ticket.</h3><p>Start with the grandstand or standing-zone name. A row or seat number alone cannot locate a chair.</p><label htmlFor="monaco-viewing-area">Viewing family</label><select id="monaco-viewing-area" value={area} onChange={e=>choose(e.target.value)}>{venue.areas.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
   <div className="monaco-selection" aria-live="polite"><h3>{chosen.name}</h3><p>{chosen.position}</p><strong>{chosen.kind}</strong><p>{chosen.description}</p><h4>Published 2027 categories</h4><ul>{monacoVariants[area].map(v=><li key={v}>{v}</li>)}</ul><p className="reference-note">These are category labels from the organizer’s current list. They do not show current availability or an allocated seat. Gold categories and hospitality offers are listed separately.</p></div>
   <a className="abu-provider-primary" href={MONACO_BUY} target="_blank" rel="noreferrer">Open the official ticket configurator</a><p className="reference-note">The organizer requires sign-in at seat selection. Continue there to check actual allocations. Its digital-twin illustration is separate from this map; no source mesh, preview image or private seat inventory is copied here.</p>
   <div className="area-actions"><button onClick={()=>setFeedback(comparison.toggle(area)?'Three areas saved. Remove one before adding another.':'')}>{comparison.saved.includes(area)?'Remove from comparison':comparison.saved.length===3?'Comparison full · 3/3':'Compare this area'}</button><button onClick={share}>Share area</button></div><p className="desk-feedback" role="status">{feedback}</p>
  </div></div>
  <AreaComparison venue={venue} saved={comparison.saved} persistent={comparison.persistent} onSelect={choose} onRemove={comparison.remove} onClear={comparison.clear}/>
  <details className="ticket-methodology monaco-other-options"><summary>Accessible viewing & hospitality</summary><p>These are source-only options. Their platforms, rooms, routes and views are not assigned ordinary grandstand coordinates.</p>{monacoOtherOptions.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.note}</p><a href={o.source} target="_blank" rel="noreferrer">Official information</a></article>)}</details>
  <section className="abu-ticket-handoffs"><h2>Check the original Monaco references.</h2><p>ACM identifies monaco-grandprix.com as its official sales site. Purchases and seat selection happen with the organizer. Package and single-day availability can change; no live stock or price is shown here.</p><div className="verified-event-links"><a href={MONACO_MAP} target="_blank" rel="noreferrer">Organizer’s 2027 circuit diagram</a><a href={MONACO_CATEGORIES} target="_blank" rel="noreferrer">Current categories & PMR information</a><a href={MONACO_ROOT} target="_blank" rel="noreferrer">Official event & ticket options</a></div></section>
  <details className="ticket-methodology"><summary>Map sources, accuracy & unavailable views</summary><p>Checked 25 November 2026. The 2027 organizer diagram and category sheet identify the twelve broad families and their listed options. Temporary stand footprints, levels, actual rows, Gold subdivisions and accessible routes remain unverified.</p><p>Street geography comes from OSM relation 148194 with explicit source-node adaptations for current urban split ways. The pit lane and pit-exit branch are excluded. The adapted route is approximately 3.325 km versus F1’s published 3.337 km; it is a source street-centerline interpretation, not a 2027 race survey. Source coastline forms the harbour context; its off-canvas water closure is authored. Hills, tunnel interiors, buildings and calibrated 3D views are absent.</p><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors · ODbL</a><a href={venue.download} download>Download adapted geography & source metadata</a></details>
 </section>;
}
