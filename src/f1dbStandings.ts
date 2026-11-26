import {parse} from 'yaml';
import {emptyRacingFeed,validateRacingFeed,type RacingFeed,type Standing} from './racingData';
import type {Season} from './races';
const ROOT='https://raw.githubusercontent.com/f1db/f1db/main/src/data/';
export type F1dbIdentities={drivers:Record<string,string>;constructors:Record<string,string>};
type Row=Record<string,unknown>;
const id=(value:unknown)=>{if(typeof value!=='string'||!/^[a-z0-9-]{1,100}$/.test(value))throw Error('Invalid source identity');return value;};
function rows(value:unknown,max=100):Row[]{if(!Array.isArray(value)||value.length>max||value.some(v=>!v||typeof v!=='object'||Array.isArray(v)))throw Error('Invalid F1DB table');return value as Row[];}
export function parseF1dbYaml(text:string):unknown {if(text.length>150000)throw Error('Source response is too large');return parse(text,{maxAliasCount:0,uniqueKeys:true,logLevel:'error'});}
export function normalizeF1dbStandings(season:Season,drivers:unknown,teams:unknown,entrants:unknown,names:F1dbIdentities,at=new Date().toISOString()):RacingFeed {
 const ds=rows(drivers,50),ts=rows(teams,30),es=rows(entrants,30);
 const name=(key:string,type:keyof F1dbIdentities)=>{const n=names[type]?.[key];if(typeof n!=='string'||!n.trim()||n.length>200)throw Error('Missing F1DB identity');return n;};
 const teamMap=new Map<string,Set<string>>();for(const entrant of es){const team=name(id(entrant.constructorId),'constructors');for(const d of rows(entrant.drivers,80)){const key=id(d.driverId);if(!teamMap.has(key))teamMap.set(key,new Set());teamMap.get(key)!.add(team);}}
 const standing=(row:Row,type:'drivers'|'constructors'):Standing=>{const key=id(row[type==='drivers'?'driverId':'constructorId']);if(typeof row.position!=='number'||!Number.isInteger(row.position)||row.position<1||typeof row.points!=='number'||!Number.isFinite(row.points)||row.points<0)throw Error('Missing or invalid points/position');return {position:row.position,name:name(key,type),team:type==='drivers'?[...(teamMap.get(key)??[])].join(' / '):'',points:row.points,wins:null};};
 if(!ds.length||!ts.length)throw Error('Empty standings response');
 const feed:RacingFeed={...emptyRacingFeed(season),provider:'F1DB',status:'published',fetchedAt:at,drivers:ds.map(r=>standing(r,'drivers')).sort((a,b)=>a.position-b.position),teams:ts.map(r=>standing(r,'constructors')).sort((a,b)=>a.position-b.position)};
 const validated=validateRacingFeed(feed,season);if(!validated)throw Error('Invalid F1DB standings');return validated;
}
export async function fetchF1dbStandings(season:Season,signal?:AbortSignal,fetcher:typeof fetch=fetch):Promise<RacingFeed>{
 if(season!==2026&&season!==2027)throw Error('Unsupported season');
 const options={signal,cache:'no-cache' as RequestCache};
 const [dr,te,en]=await Promise.all(['driver-standings.yml','constructor-standings.yml','entrants.yml'].map(file=>fetcher(`${ROOT}seasons/${season}/${file}`,options)));
 if(dr.status===404&&te.status===404){return {...emptyRacingFeed(season),status:'not-published',provider:'F1DB',fetchedAt:new Date().toISOString()};}
 for(const r of [dr,te,en])if(!r.ok)throw Error(`F1DB returned HTTP ${r.status}`);
 const [drivers,teams,entrants]=await Promise.all([dr,te,en].map(async r=>parseF1dbYaml(await r.text())));
 const identityResponse=await fetcher('/data/racing/f1db-identities.json',{signal});if(!identityResponse.ok)throw Error('Identity lookup unavailable');
 const names=await identityResponse.json() as F1dbIdentities;
 const pending:{type:keyof F1dbIdentities;id:string}[]=[];
 const requireName=(key:unknown,type:keyof F1dbIdentities)=>{const identity=id(key);if(!names[type]?.[identity]&&!pending.some(v=>v.type===type&&v.id===identity))pending.push({type,id:identity});};
 for(const r of rows(drivers,50))requireName(r.driverId,'drivers');for(const r of rows(teams,30))requireName(r.constructorId,'constructors');for(const e of rows(entrants,30))requireName(e.constructorId,'constructors');
 if(pending.length>12)throw Error('Too many unknown source identities');
 // New drivers/constructors can appear after the bundled identity release. Fetch only those records.
 for(const entry of pending){const r=await fetcher(`${ROOT}${entry.type}/${entry.id}.yml`,options);if(!r.ok)throw Error('New source identity unavailable');const record=parseF1dbYaml(await r.text()) as Row;if(record?.id!==entry.id||typeof record.name!=='string'||record.name.length>200)throw Error('Identity mismatch');if(!names[entry.type])names[entry.type]={};names[entry.type][entry.id]=record.name;}
 return normalizeF1dbStandings(season,drivers,teams,entrants,names);
}
