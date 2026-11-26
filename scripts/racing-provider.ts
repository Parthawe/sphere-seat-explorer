import {emptyRacingFeed,validateRacingFeed,type RacingFeed,type Standing} from '../src/racingData';
import type {Season} from '../src/races';
type RecordValue=Record<string,any>;
function table(raw:RecordValue,key:string,season:Season){if(raw?.MRData?.series!=='f1')throw Error('Unexpected series');const t=raw.MRData[key];if(String(t?.season)!==String(season))throw Error('Provider season mismatch');return t;}
function amount(v:unknown){if(v===null||v===''||v===undefined)throw Error('Missing numeric value');const n=Number(v);if(!Number.isFinite(n)||n<0)throw Error('Invalid numeric value');return n;}
function person(v:RecordValue){if(typeof v?.givenName!=='string'||typeof v?.familyName!=='string')throw Error('Missing driver name');return `${v.givenName} ${v.familyName}`;}
export function normalizeJolpica(season:Season,payloads:{drivers:RecordValue;teams:RecordValue;races:RecordValue;results:RecordValue},fetchedAt=new Date().toISOString()):RacingFeed{
 const drivers=table(payloads.drivers,'StandingsTable',season).StandingsLists,teams=table(payloads.teams,'StandingsTable',season).StandingsLists;
 if(!Array.isArray(drivers)||drivers.length>1||!Array.isArray(teams)||teams.length>1)throw Error('Unexpected standings response');
 for(const list of [drivers,teams])if(list[0]&&String(list[0].season)!==String(season))throw Error('Standings season mismatch');
 const standings=(list:RecordValue[],kind:'DriverStandings'|'ConstructorStandings'):Standing[]=>!list.length?[]:list[0][kind].map((r:RecordValue)=>({position:amount(r.position),name:kind==='DriverStandings'?person(r.Driver):r.Constructor?.name,team:kind==='DriverStandings'?(r.Constructors??[]).map((c:RecordValue)=>c.name).join(' / '):'',points:amount(r.points),wins:amount(r.wins)})).sort((a:Standing,b:Standing)=>a.position-b.position);
 const races=table(payloads.races,'RaceTable',season).Races,results=table(payloads.results,'RaceTable',season).Races;
 if(!Array.isArray(races)||!Array.isArray(results)||results.length>1)throw Error('Unexpected race response');
 const latest=results[0];
 const output:RacingFeed={...emptyRacingFeed(season),status:'published',provider:'Jolpica F1',fetchedAt,driverRound:drivers[0]?amount(drivers[0].round):null,teamRound:teams[0]?amount(teams[0].round):null,drivers:standings(drivers,'DriverStandings'),teams:standings(teams,'ConstructorStandings'),schedule:races.map((r:RecordValue)=>({round:amount(r.round),name:r.raceName,circuitId:r.Circuit?.circuitId,date:r.date,time:r.time??null})),latest:latest?{name:latest.raceName,date:latest.date,round:amount(latest.round),results:latest.Results.map((r:RecordValue)=>({position:amount(r.position),name:person(r.Driver),team:r.Constructor?.name,points:amount(r.points),status:r.status}))}:null};
 const valid=validateRacingFeed(output,season);if(!valid)throw Error('Invalid normalized racing feed');return valid;
}
export async function fetchJolpica(season:Season,permission:{enabled:boolean;commercialPermissionReference:string},fetcher:typeof fetch=fetch){
 if(permission.enabled!==true||!permission.commercialPermissionReference?.trim())throw Error('Commercial data permission is not configured. No provider requests made.');
 const paths={drivers:'driverstandings',teams:'constructorstandings',races:'',results:'last/results'};const payloads:Record<string,RecordValue>={};
 for(const [key,path] of Object.entries(paths)){
  const url=`https://api.jolpi.ca/ergast/f1/${season}/${path?path+'/':''}.json`.replace('/.json','.json');
  const response=await fetcher(url,{headers:{'User-Agent':'F1TicketsOnline/1.0 (+https://f1tickets.online)','Accept':'application/json'},signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error(`Racing provider returned HTTP ${response.status}. Previous snapshot retained.`);
  payloads[key]=await response.json();await new Promise(resolve=>setTimeout(resolve,300));
 }
 return normalizeJolpica(season,payloads as Parameters<typeof normalizeJolpica>[1]);
}
