import type {Race} from './races';
import {raceCoverage} from './raceCoverage';
import {raceStudyLink} from './raceCards';
import {circuitLayoutId} from './circuitLayouts';
export function racePreview(race:Race){
 const coverage=raceCoverage(race.season,race.slug),kind=coverage.kind==='model'?'model':coverage.kind==='reference3d'?'vegas':'outline';
 const key=kind==='model'?`model-${race.season}-${race.slug}`:kind==='vegas'?'vegas-2026':`outline-${circuitLayoutId(race.season,race.slug)}`;
 return {kind,key,action:kind==='outline'?'Explore circuit':'Explore seats',poster:`/circuit-previews/${key}.png`,href:raceStudyLink(race),note:kind==='model'?`Illustrative ${race.season} venue · seats unverified`:kind==='vegas'?'Illustrative 2026 reference · seats unverified':'Flat circuit study · no seating or elevation'} as const;
}

/** Preview links preserve the demonstrated camera and never offer seats on outline studies. */
export function racePreviewLink(race:Race,camera:'circuit'|'seat'){
 const spec=racePreview(race),params=new URLSearchParams(spec.href.slice(1));
 if(spec.kind==='model')params.set('camera',camera);
 else if(spec.kind==='vegas'){params.set('screen','seats');params.set('seat','C:12:18');params.set('view',camera);}
 return '?'+params;
}
