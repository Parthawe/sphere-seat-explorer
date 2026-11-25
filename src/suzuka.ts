import geography from './suzuka-track.json';
import type {VenueArea} from './venueRegistry';
export const SUZUKA_TICKETS='https://www.suzukacircuit.jp/f1/ticket/index.html';
export const SUZUKA_CHECKED='2026-11-25';
const source=(path:string)=>path.startsWith('https://')?path:'https://www.suzukacircuit.jp/f1/ticket/'+path;
// Named licensed source-envelope centers provide broad context only. A2/H/I use
// authored corner-region anchors; no unnamed footprint is promoted to a product.
const rows:[string,string,string,string,string,number[],number[],string?][]=[
 ['v1','V1 · Lower grandstand','Main straight · T0','Individual seats','184107052',[489.76,276.02],[580,275]],
 ['v2','V2 · Upper grandstand','Main straight · T0','Individual seats','183394522',[478.22,252.4],[560,220]],
 ['a1','A1 · Main straight','Main straight · T0','Bench seating','184120096',[528.25,323.99],[580,330]],
 ['a2','A2 · First-corner approach','End of main straight · T1','Bench seating','',[553,371],[580,380]],
 ['b1','B1 · Second corner','Second corner · T2','Bench seating','184143131',[556.57,429.22],[535,465]],
 ['b2','B2 · Second corner','Second corner · T2','Bench seating','184143132',[564.8,425.16],[585,495]],
 ['c','C · Honda supporters','Second corner to S Curves · T2–3','Bench seating','184143133',[519.52,413.07],[470,475]],
 ['d','D · S Curves & reverse bank','S Curves to reverse bank · T5–6','Bench seating','469368057',[423.92,320.81],[380,410]],
 ['e','E · NIPPO Corner','NIPPO Corner · T7','Bench seating','467982372',[401.28,259.74],[355,355]],
 ['g','G · 130R & crossover','130R / crossover · T15 / T9–10','Bench seating','184102012',[278,252],[220,340]],
 ['h','H · 110R','110R · T10','Bench seating','',[250,216],[200,120]],
 ['i','I · NISSIN Brake Hairpin','Hairpin · T11','Bench seating','',[260,180],[275,100]],
 ['m','M · Spoon Curve','Spoon Curve · T14','Bench seating','183953761',[43.47,149.18],[38,90]],
 ['o','O · West straight','West straight · T14–15','Bench seating','184415310',[190.52,256.32],[90,300]],
 ['p','P · Chicane approach','Astemo chicane approach · T15–16','Bench seating','184419745',[319.38,240.2],[310,300]],
 ['q1','Q1 · Astemo chicane','Astemo chicane · T16–17','Bench / individual seats','183393132',[394.26,202.45],[390,140]],
 ['q2','Q2 · Astemo chicane','Astemo chicane · T16','Individual seats','183393101',[378.07,202.07],[330,150]],
 ['r','R · Final corner','Final corner · T18','Bench seating','183393129',[421.02,201.91],[440,130]],
 ['s','S · Family seating','Final corner · T18','Family bench / box options','183394069',[442.25,215.76],[515,160],'family-seat.html'],
];
export const suzukaAreas:VenueArea[]=rows.map(([id,name,position,kind,feature,point,label,path])=>({id,name,short:id.toUpperCase(),position,kind,point,label,source:source(path??'seat_'+id+'.html'),focus:position,confidence:feature?'Estimated region using named OSM grandstand context and the current organizer diagram':'Estimated corner region from organizer location and licensed GP geography; no named footprint association',description:id==='v1'?'Lower and upper grandstands are distinct products. V1 outlet variants may have restricted visibility; open the organizer’s exact variant and view references before buying.':id==='v2'?'Upper grandstand product, separate from V1. This shared horizontal area map cannot distinguish tier height, sections, roofs or obstructed-view variants.':id==='q1'?'Q1-1 uses bench seating and Q1-2 individual seats. This broad region does not map those internal boundaries or imply a view from either exact row.':id==='s'?'S family seating and S-BOX share a source page. This marker identifies the broad final-corner region, not an individual box or its eligibility, allocation or view.':id==='g'?'The current catalogue associates G with both 130R and the crossover. One broad marker does not describe every G subsection, its facing or bridge obstruction.':id==='d'?'The D family spans multiple S Curves/reverse-bank sections. This is a broad reference point, not the full product boundary or a particular D row.':'The current 2027 organizer catalogue identifies this product and corner region. The marker estimates its broad location; sections, rows, actual seat numbers and physical sightlines are not mapped.'}));
export const suzukaOtherOptions=[
 ['west','West Area admission','west_seat.html','Roaming west-side admission is separate from reserved grandstands. No single chair, walking route or fixed view is assigned.'],
 ['wheel','Wheelchair tickets','wheel.html','Check the organizer’s current platforms, companion conditions and access arrangements. Ordinary stand markers do not certify accessible seating or routes.'],
 ['camera','Photographer areas','cameraman-seat.html','Special viewing areas have their own conditions and locations. They do not inherit a reserved grandstand view.'],
 ['fwl','Ferris Wheel Lounge','fwl.html','The source lists lounge access with an R ticket. The R region does not locate a lounge table or certify its view.'],
 ['vip','VIP Suite Premium','vip-suite.html','Top-of-grandstand hospitality is distinct from V1/V2 seating; no room, table or hospitality sightline is mapped.'],
 ['rbox','R-BOX','r-box.html','A separate final-corner box product, not a particular R or S chair. Confirm group allocation and conditions with the organizer.'],
 ['paddock','Formula 1 Paddock Club','paddock-club.html','Separate main-straight hospitality; no room, terrace, table or package-specific view is assigned.'],
 ['champions','Champions Club packages','https://f1experiences.com/ja/champions-club','The organizer links this external package catalogue. Confirm the Japan event, year, inclusions and allocated seating before purchasing.'],
 ['thursday','Thursday-only ticket','thursday.html','A limited-day pass is not a full race-weekend grandstand ticket. Check the current sale schedule and allowed viewing areas.'],
 ['thursday-friday','Thursday–Friday ticket','friday.html','Limited-day access is separate from reserved weekend products; no Sunday chair or roaming route is assigned.'],
 ['zero','16–23 ZERO pass','zero.html','A separate age-limited Thursday/Friday programme. Check eligibility, registration and access conditions with the organizer; it does not assign a race-day seat.'],
].map(([id,name,path,note])=>({id,name,source:source(path),note}));
export const suzukaGeography=geography;
