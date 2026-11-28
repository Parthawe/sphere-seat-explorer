import {getPosition} from 'suncalc';
import {raceEventFor} from './raceEventData';
import {raceLocation} from './globeGeography';
import type {Race} from './races';
export type LightPeriod='day'|'dusk'|'night';
export type RaceLighting={period:LightPeriod;basis:'schedule'|'study';start:string|null;trackTime:string|null;altitude:number|null;sun:[number,number,number];source:string;checked:string|null};
const rad=Math.PI/180;
/** Visual thresholds, not a weather forecast or a measured obstruction/shade study. */
export function lightPeriod(altitude:number):LightPeriod{return altitude>10?'day':altitude>=-6?'dusk':'night';}
export function raceLighting(race:Pick<Race,'season'|'slug'>,fallback?:LightPeriod,offsetMinutes=0):RaceLighting{
 const detail=raceEventFor(race),location=raceLocation(race),session=detail?.sessions.find(s=>s.name==='Race'),start=session?.start;
 const preset=fallback??(race.slug==='united-arab-emirates'?'dusk':['bahrain','saudi-arabia','singapore','las-vegas','qatar'].includes(race.slug)?'night':'day');
 if(detail&&start&&location&&Number.isFinite(Date.parse(start))){
  const instant=new Date(Date.parse(start)+Math.max(0,Math.min(120,offsetMinutes))*60000),position=getPosition(instant,location.latitude,location.longitude),a=position.altitude*rad,z=position.azimuth*rad;
  return {period:lightPeriod(position.altitude),basis:'schedule',start:instant.toISOString(),trackTime:new Intl.DateTimeFormat('en-GB',{timeZone:detail.timeZone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(instant),altitude:position.altitude,sun:[Math.sin(z)*Math.cos(a),Math.sin(a),-Math.cos(z)*Math.cos(a)],source:detail.source,checked:detail.checked};
 }
 const altitude=preset==='day'?45:preset==='dusk'?3:-25,a=altitude*rad;
 return {period:preset,basis:'study',start:null,trackTime:null,altitude:null,sun:[-.65*Math.cos(a),Math.sin(a),.76*Math.cos(a)],source:detail?.source??`https://www.formula1.com/en/racing/${race.season}/${race.slug}`,checked:detail?.checked??null};
}
export function raceLightLabel(light:RaceLighting){return light.basis==='schedule'?`${light.period==='day'?'Daylight':light.period==='dusk'?(light.altitude!==null&&light.altitude>0?'Low sun':'Dusk'):'Night'} · ${light.trackTime} track time`:`Time TBC · ${light.period==='day'?'day':light.period==='dusk'?'dusk':'night'} study`;}
