import type {Race,Season} from './races';
import {raceStatus} from './races';
import photos from './racePhotos.json';
import {raceCoverage} from './raceCoverage';
const countries:Record<string,string>={australia:'au',china:'cn',japan:'jp',miami:'us',canada:'ca',monaco:'mc','barcelona-catalunya':'es',austria:'at','great-britain':'gb',belgium:'be',hungary:'hu',netherlands:'nl',italy:'it',spain:'es',azerbaijan:'az',malaysia:'my',singapore:'sg','united-states':'us',mexico:'mx',brazil:'br','las-vegas':'us',qatar:'qa','united-arab-emirates':'ae',bahrain:'bh','saudi-arabia':'sa',portugal:'pt',turkey:'tr'};
export const raceVisualKey=(race:Pick<Race,'season'|'slug'>)=>race.season===2026&&race.slug==='bahrain'?'malaysia':race.slug;
export const racePhotoFor=(race:Pick<Race,'season'|'slug'>)=>photos[raceVisualKey(race) as keyof typeof photos];
export const raceFlagFor=(race:Pick<Race,'season'|'slug'>)=>countries[raceVisualKey(race)];
export function raceStudyLink(race:Race){const kind=raceCoverage(race.season,race.slug).kind;return '?'+new URLSearchParams({season:String(race.season),race:race.slug,screen:kind==='model'?'circuit':kind==='reference3d'?'vegas':'track-study'});}
export function seasonHighlights(races:Race[],today=new Date().toISOString().slice(0,10)){
 const previous=races.filter(r=>raceStatus(r,today)==='Past').at(-1),next=races.filter(r=>raceStatus(r,today)!=='Past');
 const result:{race:Race;label:string}[]=[];
 if(previous)result.push({race:previous,label:'Previous'});
 if(next[0])result.push({race:next[0],label:raceStatus(next[0],today)==='Race weekend'?'This weekend':next[0].round===1?'Season opener':'Next race'});
 if(next[1])result.push({race:next[1],label:'Following'});
 if(!previous&&next[2])result.push({race:next[2],label:'Then'});
 return result;
}
export function seasonCalendarFile(races:Race[],season:Season,now=new Date()){
 const date=(s:string)=>s.replaceAll('-',''),lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//F1 Tickets Online//Race weekends//EN','CALSCALE:GREGORIAN'];
 for(const race of races.filter(r=>r.season===season)){const end=new Date(race.end+'T00:00:00Z');end.setUTCDate(end.getUTCDate()+1);lines.push('BEGIN:VEVENT',`UID:${race.season}-${race.slug}@f1tickets.online`,`DTSTAMP:${now.toISOString().replaceAll('-','').replaceAll(':','').replace(/\.\d{3}Z$/,'Z')}`,`DTSTART;VALUE=DATE:${date(race.start)}`,`DTEND;VALUE=DATE:${date(end.toISOString().slice(0,10))}`,`SUMMARY:${race.name.replaceAll(',','\\,')} Grand Prix ${season}`,`URL:https://f1tickets.online/?season=${season}&race=${race.slug}`,'DESCRIPTION:Race weekend dates only. Session times and ticket admission vary. Confirm with the organizer.','END:VEVENT');}
 const fold=(line:string)=>{let result='',part='',bytes=0;for(const char of line){const length=new TextEncoder().encode(char).length;if(bytes+length>74){result+=part+'\r\n';part=' ';bytes=1;}part+=char;bytes+=length;}return result+part;};
 return [...lines,'END:VCALENDAR',''].map(fold).join('\r\n');
}
