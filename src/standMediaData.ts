import suzukaMedia from './suzukaStandMedia.json';
import {suzukaAreas} from './suzuka';
import {jeddahReference} from './jeddahReference';
import type {Race} from './races';
export type StandMedia={id:string;name:string;location:string;source:string;credit:string;capture:string;videos:{id:string;label:string;sourceIndex:number}[];photos:{url:string;sourceLabel:string}[];panoramas:number;areaUrl?:string};
export function standMediaFor(race:Pick<Race,'slug'|'season'>):StandMedia[]{
 if(race.season!==2027)return [];
 if(race.slug==='japan')return suzukaMedia.map(media=>{
  const area=suzukaAreas.find(a=>a.id===media.id)!;
  return {...media,name:area.name,location:area.position,credit:'Suzuka Circuit · organizer-linked viewing media',capture:'Capture year unverified · linked from the 2027 organizer catalogue',areaUrl:`?season=2027&race=japan&area=${area.id}#viewing-areas`};
 });
 if(race.slug==='saudi-arabia')return jeddahReference.grandstands.map((name,i)=>({id:String(i),name,location:'Jeddah Corniche Circuit · exact stand placement unverified',source:jeddahReference.catalogue,credit:i===2?'Race Experience · travel operator, not the organizer':'Jeddah Corniche Circuit',capture:i===2?'2025 visit · year and stand reported in the video title':'No matched stand media',videos:i===2?[{id:'IcFl-XbcX-o',label:'Central Grandstand A · 2025',sourceIndex:1}]:[],photos:[],panoramas:0}));
 return [];
}
export const validVideoId=(id:string)=>/^[A-Za-z0-9_-]{11}$/.test(id);
