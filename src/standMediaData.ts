import {venueStandCatalogue} from './standCatalogueData';
import {findCircuitModel} from './circuitSeating';
import {spectatorReferences,type SpectatorReference} from './photoReferences';
import suzukaMedia from './suzukaStandMedia.json';
import {suzukaAreas} from './suzuka';
import {jeddahReference} from './jeddahReference';
import type {Race} from './races';
export type StandMedia={id:string;name:string;location:string;source:string;credit:string;capture:string;videos:{id:string;label:string;sourceIndex:number;credit?:string;capture?:string}[];photos:{url:string;sourceLabel:string}[];panoramas:number;areaUrl?:string;reports?:SpectatorReference[];virtualView?:boolean};
export function standMediaFor(race:Pick<Race,'slug'|'season'>):StandMedia[]{
 if(race.slug==='japan'&&race.season===2027)return suzukaMedia.map(media=>{
  const area=suzukaAreas.find(a=>a.id===media.id)!;
  return {...media,name:area.name,location:area.position,credit:'Suzuka Circuit · organizer-linked viewing media',capture:'Capture year unverified · linked from the 2027 organizer catalogue',areaUrl:`?season=2027&race=japan&area=${area.id}#viewing-areas`};
 });
 if(race.slug==='saudi-arabia'&&race.season===2027)return jeddahReference.grandstands.map((name,i)=>({id:String(i),name,location:'Jeddah Corniche Circuit · exact stand placement unverified',source:jeddahReference.catalogue,credit:i===2?'Race Experience · travel operator, not the organizer':'Jeddah Corniche Circuit',capture:i===2?'2025 visit · year and stand reported in the video title':'No matched stand media',videos:i===2?[{id:'IcFl-XbcX-o',label:'Central Grandstand A · 2025',sourceIndex:1}]:[],photos:[],panoramas:0}));
 const model=findCircuitModel(race.season,race.slug);
 return venueStandCatalogue(race).entries.map(entry=>{
  const bank=entry.kind==='model'?model?.banks.find(b=>'model-'+b.id===entry.id):undefined;
  const product=bank?.product??(entry.kind==='area'?entry.id:undefined);
  const reports=spectatorReferences.filter(r=>r.venue===race.slug&&r.match!=='venue-only'&&product!==undefined&&r.areas.includes(product)&&!(race.slug==='bahrain'&&race.season===2026));
  const videos:StandMedia['videos']=reports.flatMap(r=>r.embed?.type==='youtube'?[{id:r.embed.videoId,label:r.title,sourceIndex:1,credit:r.author+' · '+r.publisher,capture:`${r.year} visit · publisher-reported location and year`}]:[]);
  const newClip=additionalStandVideos.find(v=>v.race===race.slug&&v.season===race.season&&v.option===entry.id);
  if(newClip)videos.push({id:newClip.id,label:newClip.title,sourceIndex:videos.length+1,credit:'Race Experience · travel publisher',capture:'2025 visit · source-reported stand and year; current seat correspondence unverified'});
  return {id:entry.id,name:entry.name,location:bank?'Named viewing bank · modeled placement is approximate':entry.kind==='area'?'Approximate viewing area':'Source-only option · no mapped viewing position',source:entry.source,credit:'Original source reference',capture:'Capture year varies by source',videos,photos:[],reports,panoramas:0,virtualView:bank?.officialView,areaUrl:entry.kind==='area'?entry.href:undefined};
 });
}
// Public YouTube oEmbed title/channel metadata checked 26 November 2026.
const additionalStandVideos=[
 {race:'hungary',season:2027,option:'stand-0',id:'H-a210pBFGc',title:'Hungaroring Platinum · 2025'},
 {race:'belgium',season:2027,option:'model-silver-3',id:'SWrnIncCgtw',title:'Silver 3 · Spa 2025'},
 {race:'belgium',season:2027,option:'model-fanzone',id:'tXp4t7X0gpo',title:'Fanzone Grandstand · Spa 2025'},
];
export const validVideoId=(id:string)=>/^[A-Za-z0-9_-]{11}$/.test(id);
