import {raceStudyLink} from './raceCards';
import locations from './circuitLocations.json';
import {circuitLayoutId} from './circuitLayouts';
import type {Race} from './races';
export type EarthPoint=[number,number,number];
export function raceLocation(race:Pick<Race,'season'|'slug'>){const id=circuitLayoutId(race.season,race.slug);return id?(locations as Record<string,{latitude:number;longitude:number;name:string;source:string}>)[id]:undefined;}
/** Matches Three's unrotated equirectangular sphere and NASA's -180..180 image. */
export function earthVector(latitude:number,longitude:number):EarthPoint{const lat=latitude*Math.PI/180,lon=longitude*Math.PI/180;return [Math.cos(lat)*Math.cos(lon),Math.sin(lat),-Math.cos(lat)*Math.sin(lon)];}
export function arcDirection(from:EarthPoint,to:EarthPoint,t:number):EarthPoint{
 const normalize=(v:EarthPoint)=>{const l=Math.hypot(...v)||1;return v.map(n=>n/l) as EarthPoint;},a=normalize(from),b=normalize(to),dot=Math.max(-1,Math.min(1,a.reduce((s,n,i)=>s+n*b[i],0))),u=Math.max(0,Math.min(1,t));
 if(u===0)return a;if(u===1)return b;
 if(dot>.9995)return normalize(a.map((n,i)=>n+(b[i]-n)*u) as EarthPoint);
 if(dot<-.9995){const axis=normalize(Math.abs(a[1])<.9?[-a[2],0,a[0]]:[0,-a[2],a[1]]);return a.map((n,i)=>n*Math.cos(Math.PI*u)+axis[i]*Math.sin(Math.PI*u)) as EarthPoint;}
 const angle=Math.acos(dot),s=Math.sin(angle);return a.map((n,i)=>(n*Math.sin((1-u)*angle)+b[i]*Math.sin(u*angle))/s) as EarthPoint;
}
export function earthFlight(from:EarthPoint,to:EarthPoint,progress:number){
 const p=Math.max(0,Math.min(1,progress)),smooth=(v:number)=>v*v*(3-2*v),direction=arcDirection(from,to,smooth(Math.min(1,p/.48))),approach=smooth(Math.max(0,(p-.28)/.72));
 const initialHeight=Math.max(.2,Math.hypot(...from)-1),height=Math.exp(Math.log(initialHeight)*(1-approach)+Math.log(.008)*approach);
 return direction.map(v=>v*(1+height)) as EarthPoint;
}

/** Vegas lands in its actual 3D circuit, with the same reference selection as the atlas. */
export function earthStudyLink(race:Race){return race.slug==='las-vegas'?'?'+new URLSearchParams({season:String(race.season),race:race.slug,screen:'seats',seat:'C:12:18',view:'circuit'}):raceStudyLink(race);}
