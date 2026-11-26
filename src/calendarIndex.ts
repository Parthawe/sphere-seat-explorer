import index from './calendarIndex.json';
import type {Race} from './races';

type CalendarEntry=(typeof index)[keyof typeof index];
export function calendarEntryFor(season:number,race:string):CalendarEntry|undefined {
  return (index as Record<string,CalendarEntry>)[`${season}:${race}`];
}
export function matchesCalendarSearch(race:Race,query:string){
  const normalize=(text:string)=>text.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim();
  return normalize(calendarEntryFor(race.season,race.slug)?.search??`${race.name} ${race.slug}`).includes(normalize(query));
}
