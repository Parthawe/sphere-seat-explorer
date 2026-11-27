import type {Race} from './races';
import {raceCoverage} from './raceCoverage';
import {raceStudyLink} from './raceCards';
import {circuitLayoutId} from './circuitLayouts';
export function racePreview(race:Race){
 const coverage=raceCoverage(race.season,race.slug),kind=coverage.kind==='model'?'model':coverage.kind==='reference3d'?'vegas':'outline';
 const key=kind==='model'?`model-${race.season}-${race.slug}`:kind==='vegas'?'vegas-2026':`outline-${circuitLayoutId(race.season,race.slug)}`;
 return {kind,key,poster:`/circuit-previews/${key}.png`,href:raceStudyLink(race),note:kind==='model'?`Illustrative ${race.season} venue · seats unverified`:kind==='vegas'?'Illustrative 2026 reference · seats unverified':'Flat circuit study · no seating or elevation'} as const;
}
