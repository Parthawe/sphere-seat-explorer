import geography from './austria-track.json';
import type {VenueArea} from './venueRegistry';
export const AUSTRIA_ROOT='https://www.redbullring.com/en/events-tickets/formula-1/';
export const AUSTRIA_TICKETS='https://tickets.redbullring.com/en/f1/f1-grand-prix-oesterreich-2027/tickets.html';
export const AUSTRIA_CHECKED='2026-11-26';
// Broad authored anchors interpreted from the current 2027 ticket diagram and
// independent licensed GP geography. They are not event footprints or chairs.
const rows:[string,string,string,number[],number[],string][]=[
 ['start-ziel','Start-Ziel · Start / Finish','Main straight',[380,429],[365,485],'SZ'],
 ['steiermark','Steiermark','Opening corner · Turn 1',[250,440],[160,480],'ST'],
 ['t3','T3 · Interwetten Turn','Uphill corner · Turn 3',[85,143],[40,105],'T3'],
 ['t10','T10 · Final corner','Final corner and straight',[536,365],[540,425],'T10'],
 ['red-bull-a','Red Bull A','Turn 1 end of the Red Bull grandstand',[230,400],[70,430],'RB A'],
 ['red-bull-b','Red Bull B','Lower Red Bull grandstand',[215,375],[70,385],'RB B'],
 ['red-bull-cde','Red Bull C / D / E','Lower-middle Red Bull grandstand group',[185,330],[70,340],'RB C–E'],
 ['red-bull-fghi','Red Bull F / G / H / I','Middle Red Bull grandstand group',[155,285],[70,295],'RB F–I'],
 ['red-bull-jk','Red Bull J / K','Upper-middle Red Bull grandstand group',[132,245],[70,250],'RB J–K'],
 ['red-bull-lmn','Red Bull L / M / N','Turn 3 end of the listed Red Bull groups',[111,205],[70,205],'RB L–N'],
 ['general-admission','General Admission','Broad northern hillside reference',[265,125],[255,75],'GA'],
];
export const austriaVariants:Record<string,string[]>=Object.fromEntries(rows.map(([id])=>[id,id==='start-ziel'?['Start-Ziel · weekend / Sunday','Start-Ziel A,B,C,O,P,Q · weekend / Sunday']:id==='steiermark'||id==='red-bull-a'?['Weekend entries in the checked catalogue']:['Weekend / Sunday entries in the checked catalogue']]));
export const austriaAreas:VenueArea[]=rows.map(([id,name,position,point,label,short])=>({id,name,short,controlLabel:short,point,label,position,focus:position,kind:id==='general-admission'?'Roaming admission · no assigned chair':'Grandstand product family',source:AUSTRIA_TICKETS,confidence:'Estimated broad region from the current 2027 ticket diagram and licensed GP plan; no surveyed event boundary or measured vertical view',description:id==='general-admission'?'A broad hillside reference for roaming admission. It does not locate a reserved chair, a particular slope position, an accessible route or a guaranteed sightline. The diagram’s Schönberg labels do not independently establish a ticket subdivision.':id==='start-ziel'?'The catalogue separates the general Start-Ziel family from the A,B,C,O,P,Q group. This shared main-straight marker does not locate an allocated block, tier or chair. Wheelchair and companion tickets remain separate source-only products.':id.startsWith('red-bull')?'This named sector group is retained separately in the current catalogue. The marker follows broad diagram order along the uphill straight; the group’s exact subdivisions, tiers, cover and row allocations are unverified. A hopping package does not stay in this region every day.':'The current ticket diagram identifies this family. Its broad geographic anchor does not establish an actual sector, row, cover, screen angle or physical seat view.'}));
export const austriaHopping=[
 {id:'hopping-platin',name:'3 Corner · Platin',days:['Friday: Red Bull H','Saturday: Red Bull A','Sunday: Start-Finish']},
 {id:'hopping-gold',name:'3 Corner · Gold',days:['Friday: Start-Finish','Saturday: Red Bull H','Sunday: Red Bull A']},
 {id:'hopping-silver',name:'3 Corner · Silver',days:['Friday: Red Bull A','Saturday: Start-Finish','Sunday: Red Bull H']},
 {id:'hopping-steiermark',name:'3 Corner · Steiermark',days:['Friday: Red Bull C,D,E','Saturday: Start-Finish','Sunday: Steiermark']},
 {id:'hopping-start-ziel',name:'3 Corner · Start-Ziel',days:['Friday: Steiermark','Saturday: Red Bull C,D,E','Sunday: Start-Finish']},
 {id:'hopping-red-bull-cde',name:'3 Corner · Red Bull C,D,E',days:['Friday: Start-Finish','Saturday: Steiermark','Sunday: Red Bull C,D,E']},
];
export const austriaOtherOptions=[
 ...austriaHopping.map(p=>({id:p.id,name:p.name,source:AUSTRIA_TICKETS,note:p.days.join(' · ')+'. A different grandstand each day; this package is not assigned one fixed map marker or chair.'})),
 {id:'wheelchair',name:'Start-Ziel · wheelchair ticket',source:AUSTRIA_TICKETS,note:'The checked catalogue restricts wheelchair spaces to this designated Start-Ziel product and states that the other grandstands are not barrier-free accessible. No ordinary marker supplies a platform coordinate or verified access route.'},
 {id:'companion',name:'Start-Ziel · wheelchair companion',source:AUSTRIA_TICKETS,note:'A separate companion ticket, limited to one per wheelchair ticket in the checked catalogue. No companion chair is assigned to an ordinary Start-Ziel row.'},
 {id:'reduced',name:'Reduced categories',source:AUSTRIA_TICKETS,note:'The catalogue uses Reduced for disability eligibility. A reduced ordinary-grandstand ticket is not the designated wheelchair-space product; check current documentation and admission requirements with the provider.'},
 ...['Nord','Mitte','T8','T9','Red Bull O / P','Schönberg A / B'].map((name,i)=>({id:'diagram-'+i,name:name+' · diagram reference',source:AUSTRIA_TICKETS,note:'Named by the current source diagram but not established here as an independently listed public ticket family in the checked catalogue. No available offer, chair inventory or ordinary grandstand substitution is inferred.'})),
 {id:'paddock-club',name:'Paddock Club',source:AUSTRIA_TICKETS,note:'Separate hospitality information is linked by the organizer. No suite, table, lounge level or ordinary grandstand view is assigned; the standard child-ticket guidance does not establish Paddock Club terms.'},
 {id:'camping-transport',name:'Camping, parking & transport',source:AUSTRIA_TICKETS,note:'Separate event services in the organizer navigation. These do not identify a race-viewing seat or establish an accessible walking route.'},
];
export const austriaGeography=geography;
