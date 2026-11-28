import {raceLighting,raceLightLabel} from './raceLighting';
import type {Race} from './races';
/** No live-weather claim; unknown starts retain an explicit study label. */
export default function RaceLightNotice({race}:{race:Pick<Race,'season'|'slug'>}){
 const light=raceLighting(race);
 return <span className="race-light-notice" data-race-light={light.period} title={light.basis==='schedule'?'Estimated sun position at the published race start. Generic sky; weather and sightlines are not verified.':'The source has no published start time. This is an illustrative lighting preset.'}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{light.period==='night'?<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/>:<><circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/></>}</svg>{raceLightLabel(light)}</span>;
}
