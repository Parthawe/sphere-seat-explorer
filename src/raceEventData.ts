import records from './raceDetails.json';
import type {Race} from './races';
export type RaceSession={id:string;name:string;date:string;start:string|null;end:string|null;status:string};
export type RaceEventData={season:number;race:string;source:string;checked:string;timeZone:string;status:string;sessions:RaceSession[];facts:{lengthKm?:number;firstGrandPrix?:number;laps?:number;distanceKm?:number;lapRecord?:{time:string;credit:string}};videos:{label:string;duration:string|null;url:string}[];articles:{label:string;url:string}[]};
export function raceEventFor(race:Pick<Race,'season'|'slug'>):RaceEventData|undefined {
 const value=records[`${race.season}:${race.slug}` as keyof typeof records] as RaceEventData|undefined;
 return value?.season===race.season&&value.race===race.slug?value:undefined;
}
export function sessionDisplay(session:RaceSession,timeZone:string){
 const date=new Date(session.start??session.date+'T12:00:00Z'),zone=session.start?timeZone:'UTC';
 const day=new Intl.DateTimeFormat('en-GB',{timeZone:zone,day:'2-digit',month:'short'}).format(date);
 if(!session.start)return {day,time:'TBC'};
 const fmt=new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}),start=fmt.format(date);
 if(!session.end)return {day,time:start};
 const end=new Date(session.end),endDay=new Intl.DateTimeFormat('en-GB',{timeZone:zone,day:'2-digit',month:'short'}).format(end);
 return {day,time:`${start} – ${fmt.format(end)}${day!==endDay?` (${endDay})`:''}`};
}
export function sessionCalendar(race:Race,detail:RaceEventData,now=new Date()){
 const utc=(s:string)=>s.replaceAll('-','').replaceAll(':','').replace(/\.\d{3}Z$/,'Z');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//F1 Tickets Online//Published sessions//EN'];
 for(const session of detail.sessions){if(!session.start)continue;lines.push('BEGIN:VEVENT',`UID:${race.season}-${race.slug}-${session.id}@f1tickets.online`,`DTSTAMP:${utc(now.toISOString())}`,`DTSTART:${utc(session.start)}`,...(session.end?[`DTEND:${utc(session.end)}`]:[]),`SUMMARY:${race.name} - ${session.name}`,`URL:${detail.source}`,'DESCRIPTION:Published session schedule. Times can change. Not ticket admission.','END:VEVENT');}
 const fold=(line:string)=>{let out='',part='',length=0;for(const c of line){const bytes=new TextEncoder().encode(c).length;if(length+bytes>74){out+=part+'\r\n';part=' ';length=1;}part+=c;length+=bytes;}return out+part;};
 return [...lines,'END:VCALENDAR',''].map(fold).join('\r\n');
}
