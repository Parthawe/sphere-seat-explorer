import type {Season} from './races';
export type Standing={position:number;name:string;team:string;points:number;wins:number|null};
export type RaceResult={position:number;name:string;team:string;points:number;status:string};
export type RacingFeed={schema:1;season:Season;status:'not-connected'|'not-published'|'published';provider:string;fetchedAt:string|null;driverRound:number|null;teamRound:number|null;drivers:Standing[];teams:Standing[];latest:{name:string;date:string;round:number;results:RaceResult[]}|null;schedule:{round:number;name:string;circuitId:string;date:string;time:string|null}[]};
export function emptyRacingFeed(season:Season):RacingFeed{return {schema:1,season,status:'not-connected',provider:'',fetchedAt:null,driverRound:null,teamRound:null,drivers:[],teams:[],latest:null,schedule:[]};}
const number=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)&&v>=0;
const text=(v:unknown)=>typeof v==='string'&&v.length>0&&v.length<=200;
export function validateRacingFeed(value:unknown,season:Season):RacingFeed|null {
 try {
 if(!value||typeof value!=='object')return null;const d=value as RacingFeed;
 if(d.schema!==1||d.season!==season||!['published','not-connected','not-published'].includes(d.status))return null;
 if(d.status==='not-connected')return emptyRacingFeed(season);
 if(!['Jolpica F1','F1DB'].includes(d.provider)||!d.fetchedAt||!Number.isFinite(Date.parse(d.fetchedAt))||Date.parse(d.fetchedAt)>Date.now()+60000)return null;
 if(d.status==='not-published')return d.provider==='F1DB'?{...emptyRacingFeed(season),status:'not-published',provider:'F1DB',fetchedAt:d.fetchedAt}:null;
 const rows=(items:Standing[])=>Array.isArray(items)&&items.length<=50&&items.every(r=>number(r.position)&&r.position>=1&&Number.isInteger(r.position)&&text(r.name)&&typeof r.team==='string'&&r.team.length<=200&&number(r.points)&&(r.wins===null||number(r.wins)))&&new Set(items.map(r=>r.position)).size===items.length;
 if(!rows(d.drivers)||!rows(d.teams)||![d.driverRound,d.teamRound].every(r=>r===null||(number(r)&&Number.isInteger(r))))return null;
 if(!Array.isArray(d.schedule)||d.schedule.length>40||d.schedule.some(r=>!number(r.round)||!text(r.name)||!text(r.circuitId)||!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||!r.date.startsWith(String(season))||(r.time!==null&&!/^\d{2}:\d{2}:\d{2}Z$/.test(r.time))))return null;
 if(d.latest&&(!text(d.latest.name)||!d.latest.date.startsWith(String(season))||!number(d.latest.round)||!Array.isArray(d.latest.results)||d.latest.results.length>50||d.latest.results.some(r=>!number(r.position)||!text(r.name)||typeof r.team!=='string'||!number(r.points)||!text(r.status))))return null;
 return d;
 } catch {return null;}
}
export function feedIsStale(feed:RacingFeed,now=Date.now()){return !feed.fetchedAt||now-Date.parse(feed.fetchedAt)>30*60*1000;}
