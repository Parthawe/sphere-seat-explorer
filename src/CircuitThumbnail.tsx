import {calendarEntryFor} from './calendarIndex';
import UiIcon from './UiIcon';
export default function CircuitThumbnail({season,race}:{season:number;race:string}) {
 const path=calendarEntryFor(season,race)?.outline;
 if(!path)return <span className="circuit-thumbnail circuit-thumbnail-empty" aria-hidden="true"><UiIcon name={race==='las-vegas'?'cube':'map'}/></span>;
 return <svg className="circuit-thumbnail" viewBox="0 0 100 64" aria-hidden="true" data-circuit-outline={`${season}-${race}`}><path className="circuit-outline-base" d={path}/><path className="circuit-outline-active" d={path}/></svg>;
}
