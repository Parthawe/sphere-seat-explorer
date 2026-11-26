import {findCircuitModel} from './circuitSeating';
import {findVenue} from './venueRegistry';
import UiIcon from './UiIcon';
export default function CircuitThumbnail({season,race}:{season:number;race:string}) {
 const model=findCircuitModel(season,race),venue=findVenue(season,race);
 const points=model?.track??venue?.geography.points;
 if(!points?.length)return <span className="circuit-thumbnail circuit-thumbnail-empty" aria-hidden="true"><UiIcon name={race==='las-vegas'?'cube':'map'}/></span>;
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
 const left=Math.min(...xs),top=Math.min(...ys),width=Math.max(...xs)-left,height=Math.max(...ys)-top;
 const scale=Math.min(86/Math.max(width,1),50/Math.max(height,1));
 const x=(100-width*scale)/2,y=(64-height*scale)/2;
 const path=points.map((p,i)=>`${i?'L':'M'}${(x+(p[0]-left)*scale).toFixed(1)},${(y+(p[1]-top)*scale).toFixed(1)}`).join(' ');
 return <svg className="circuit-thumbnail" viewBox="0 0 100 64" aria-hidden="true" data-circuit-outline={`${season}-${race}`}><path className="circuit-outline-base" d={path}/><path className="circuit-outline-active" d={path}/></svg>;
}
