import {calendars} from './races';
import {circuitGuideFor} from './circuitGuides';
import {findCircuitModel} from './circuitSeating';
import {findVenue} from './venueRegistry';

/** Build-time projection only. Browser entry points import the generated JSON. */
export function buildCalendarIndex(){
  return Object.fromEntries(Object.values(calendars).flat().map(race=>{
    const guide=circuitGuideFor(race.season,race.slug),model=findCircuitModel(race.season,race.slug),venue=findVenue(race.season,race.slug);
    const points=model?.track??venue?.geography.points;
    let outline:string|null=null;
    if(points?.length){
      const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
      const left=Math.min(...xs),top=Math.min(...ys),width=Math.max(...xs)-left,height=Math.max(...ys)-top;
      const scale=Math.min(86/Math.max(width,1),50/Math.max(height,1));
      const x=(100-width*scale)/2,y=(64-height*scale)/2;
      outline=points.map((p,i)=>`${i?'L':'M'}${(x+(p[0]-left)*scale).toFixed(1)},${(y+(p[1]-top)*scale).toFixed(1)}`).join(' ');
    }
    return [`${race.season}:${race.slug}`,{
      venue:guide?.venue??null,
      search:[race.name,race.slug,guide?.id,guide?.venue,guide?.location].filter(Boolean).join(' '),
      outline,
      model:model?{country:model.country,season:model.season,banks:model.banks.length}:null,
      areaMap:!!venue,
    }];
  }));
}
