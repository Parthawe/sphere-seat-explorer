import type {StandOption} from './standCatalogueData';
import type {Race} from './races';
export type StandConceptKind='grandstand'|'admission'|'hospitality'|'platform'|'multi';
/** These classify generic illustration types, never actual stand geometry or placement. */
export function standConceptKind(option:StandOption):StandConceptKind|null {
 if(option.kind==='model')return null;
 const name=option.name.toLowerCase(),note=option.note.toLowerCase();
 if(/wheelchair|companion|pmr|chiron|accessible/.test(name))return 'platform';
 if(/hopping|3 corner|grandstand pass|combination/.test(name))return 'multi';
 if(/camping|parking|transport|360|tour|report|thursday|friday|zero pass|reduced|photographer|camera|pitlane walk|pit lane walk|pit walk/.test(name))return null;
 if(/hospitality|suite|lounge|club|skybox|loges|belvédère|belvedere|r-box|garage|yacht/.test(name))return 'hospitality';
 if(/general admission|walkabout|west area|bronze|lawn|hill|rocher/.test(name)||/^(standing|roaming admission)/.test(note)||name==='z')return 'admission';
 return 'grandstand';
}
export const CONCEPT_ROWS=16,CONCEPT_POSITIONS=24;
export function conceptSample(row:number,position:number){return {row:Math.max(1,Math.min(CONCEPT_ROWS,Math.round(Number.isFinite(row)?row:8))),position:Math.max(1,Math.min(CONCEPT_POSITIONS,Math.round(Number.isFinite(position)?position:12)))};}
export function standConceptUrl(race:Pick<Race,'season'|'slug'>,id:string){return '?'+new URLSearchParams({season:String(race.season),race:race.slug,screen:'stand-study',option:id});}
export const conceptLabels:Record<StandConceptKind,string>={grandstand:'Generic grandstand',admission:'Open viewing area',hospitality:'Generic hospitality deck',platform:'Generic viewing platform',multi:'Multiple stand examples'};
