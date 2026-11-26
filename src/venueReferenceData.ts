import type {Race} from './races';
import {circuitGuideFor,circuitGuideSource,circuitTicketSource} from './circuitGuides';
import {findVenue} from './venueRegistry';
import {venueStandCatalogue} from './standCatalogueData';
import {findCircuitModel} from './circuitSeating';
import {spectatorReferences} from './photoReferences';

export {standAnchor,raceGuideUrl} from './venueLinks';
export type VenueReferenceLink={title:string;url:string;note:string};
/** Links retain their source edition. No source media is downloaded or rehosted. */
export function venueReferenceData(race:Pick<Race,'season'|'slug'>,optionId?:string){
 const catalogue=venueStandCatalogue(race),option=catalogue.entries.find(e=>e.id===optionId),venue=findVenue(race.season,race.slug),guide=circuitGuideFor(race.season,race.slug);
 const links:VenueReferenceLink[]=[];
 if(option)links.push({title:`${option.name} · original product`,url:option.source,note:`${catalogue.referenceSeason} reference. Check the seller’s current edition, days and category.`});
 const productSources=[...new Set(catalogue.entries.map(e=>e.source))];
 if(!option&&productSources.length===1)links.push({title:`${catalogue.referenceSeason} · reviewed product catalogue`,url:productSources[0],note:'Source for the listed viewing options. Product names do not establish stock, exact seat locations or current prices.'});
 if(venue)links.push({title:`${venue.season} · organizer map / guide`,url:venue.officialMap,note:`Source recorded ${venue.checked}. An approximate area map does not identify a ticket seat.`});
 const tickets=guide&&circuitTicketSource(guide,race.season);
 if(tickets)links.push({title:`${race.season} · ticket information`,url:tickets,note:'External ticket page; availability, fees and allocation are checked with the seller.'});
 if(guide)links.push({title:`${guide.referenceSeason} · F1 circuit guide`,url:circuitGuideSource(guide),note:'Circuit context. This is not a seat map.'});
 if(race.slug==='japan'&&race.season===2027)links.unshift({title:'2027 · Suzuka viewing changes',url:'https://www.suzukacircuit.jp/eng/f1/change.html',note:'Checked 26 Nov 2026. Revised fences, seat categories and restricted views; use the organizer’s individual stand pages to compare views.'});
 if(race.slug==='singapore'&&race.season===2027)links.unshift({title:'2027 · organizer panoramic views',url:'https://singaporegp.sg/en/tickets/general-tickets/grandstands/',note:'Checked 26 Nov 2026. Choose “180° Panoramic Views” on the organizer page. Capture year and exact seat match are unverified.'});
 const reports=spectatorReferences.filter(r=>r.venue===race.slug&&!(race.slug==='bahrain'&&race.season===2026)).sort((a,b)=>b.year-a.year);
 // Source identifiers only; never fuzzy-match stand names to a report location.
 const areaId=option?.kind==='model'?findCircuitModel(race.season,race.slug)?.banks.find(b=>'model-'+b.id===option.id)?.product:option?.kind==='area'?option.id:undefined;
 return {option,links:links.filter((link,i,all)=>all.findIndex(other=>other.url===link.url)===i),reports,areaReports:areaId?reports.filter(r=>r.areas.includes(areaId)):[]};
}
