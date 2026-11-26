import type {Race} from './races';
export const standAnchor=(id:string)=>`stand-option-${encodeURIComponent(id)}`;
export const raceGuideUrl=(race:Pick<Race,'season'|'slug'>,anchor='venue-stands')=>`?season=${race.season}&race=${encodeURIComponent(race.slug)}#${anchor}`;
