import {calendars,type Season} from './races';
export type HomeExperience={race:string|null;view:'world'|'circuit'};
const key=(season:Season)=>`home-experience-v1:${season}`;
export function readHomeExperience(season:Season,storage?:Pick<Storage,'getItem'>):HomeExperience{
 try{const value=JSON.parse((storage??sessionStorage).getItem(key(season))??'null');return {race:calendars[season].some(r=>r.slug===value?.race)?value.race:null,view:value?.view==='circuit'?'circuit':'world'};}catch{return {race:null,view:'world'};}
}
export function saveHomeExperience(season:Season,value:HomeExperience,storage?:Pick<Storage,'setItem'>){
 const clean={race:calendars[season].some(r=>r.slug===value.race)?value.race:null,view:value.view==='circuit'?'circuit':'world'};
 try{(storage??sessionStorage).setItem(key(season),JSON.stringify(clean));}catch{}
}
