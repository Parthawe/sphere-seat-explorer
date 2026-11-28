import './raceEnvironment.css';
import {useEffect,useState} from 'react';
import type {Race} from './races';
import {satelliteEmbedUrl,venueMapLinks} from './venueMaps';
import UiIcon from './UiIcon';
export default function VenueMapReference({race,active=true}:{race:Pick<Race,'season'|'slug'>;active?:boolean}){
 const maps=venueMapLinks(race),[loaded,setLoaded]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{if(!active)setLoaded(false);},[active]);
 if(!maps)return null;
 const embed=satelliteEmbedUrl(race,import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY);
 return <details className="venue-map-reference" onToggle={e=>{if(!e.currentTarget.open)setLoaded(false);}}><summary><UiIcon name="map"/>Satellite & Street View</summary><div>
  <p>{maps.location.name}</p><nav aria-label="Google Maps venue references"><a href={maps.satellite} target="_blank" rel="noreferrer"><UiIcon name="globe"/>Google satellite<UiIcon name="arrow"/></a><a href={maps.street} target="_blank" rel="noreferrer"><UiIcon name="camera"/>Nearby Street View<UiIcon name="arrow"/></a></nav>
  <p className="venue-map-note">Venue context, not a ticket-seat view. Imagery dates and Street View coverage vary.</p>
  {embed&&!loaded&&<><p className="venue-map-note">Loading the map connects your browser to Google. <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google privacy</a></p><button type="button" onClick={()=>{setFailed(false);setLoaded(true);}}>Load satellite map here<UiIcon name="map"/></button></>}
  {embed&&loaded&&!failed&&<><iframe title={`${maps.location.name} · Google satellite map`} src={embed} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onError={()=>setFailed(true)}/><button type="button" onClick={()=>setLoaded(false)}>Unload map</button></>}
  {failed&&<p role="status">The embedded map could not load. Open Google satellite above.</p>}
 </div></details>;
}
