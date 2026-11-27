import {lazy,Suspense} from 'react';
import type {Race} from './races';
import {venueStandCatalogue} from './standCatalogueData';
import {BrandIdentity} from './BrandMark';
import UiIcon from './UiIcon';
const StandMediaGallery=lazy(()=>import('./StandMediaGallery'));
/** Old concept links recover to evidence without inventing venue geometry. */
export default function StandConceptViewer({race,optionId,onBack}:{race:Race;optionId:string;onBack:(id?:string)=>void;onOption:(id:string)=>void}){
 const option=venueStandCatalogue(race).entries.find(e=>e.id===optionId);
 return <div className="concept-viewer"><header className="layout-header"><a className="wordmark" href={`?season=${race.season}`}><BrandIdentity subtitle="STAND REFERENCES"/></a><button onClick={()=>onBack(option?.id)}>Back to venue</button></header><main><div className="concept-unavailable"><p>{race.name} / {race.season}</p><h1>{option?.name??'Viewing option unavailable'}</h1><p>{option?'A location-based 3D model is not available for this option. Use the source and viewing references below.':'This option does not match this race edition. Open the venue catalogue to choose a supported option.'}</p>{option?.kind==='model'&&<a className="hub-outline-link" href={option.href}><UiIcon name="seat"/>Open venue model</a>}{option&&<a className="hub-outline-link" href={option.source} target="_blank" rel="noreferrer">Original product source<UiIcon name="arrow"/></a>}<button onClick={()=>onBack(option?.id)}>Open venue options</button></div>{option&&<Suspense fallback={<p role="status">Loading stand references…</p>}><StandMediaGallery race={race} optionId={optionId} fixed/></Suspense>}</main></div>;
}
