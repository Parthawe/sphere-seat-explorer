import geography from './monaco-track.json';
import type {VenueArea} from './venueRegistry';
export const MONACO_ROOT='https://monaco-grandprix.com/edition/formula-1-grand-prix-de-monaco-2027/';
export const MONACO_MAP=MONACO_ROOT+'evenement/circuit-de-monaco/';
export const MONACO_CATEGORIES=MONACO_ROOT+'evenement/tarifs-2027/';
export const MONACO_BUY=MONACO_ROOT+'billets/acheter-des-billets/';
export const MONACO_CHECKED='2026-11-25';
// Broad authored anchors interpreted from the current organizer diagram and
// licensed street geography. No temporary stand envelope or exact chair is surveyed.
const rows:[string,string,string,number[],number[],string[]][]=[
 ['a','A · Sainte-Dévote','Opening corner · Sainte-Dévote',[180,266],[105,225],['A']],
 ['b','B · Casino','Casino Square',[350,159],[295,105],['B','B-GOLD']],
 ['e','E · Quai Albert Ier','Quai Albert Ier · pool approach',[198,313],[105,300],['E']],
 ['k','K · Quai Albert Ier','Northern harbour grandstand family',[190,282],[110,270],['K1–K2','K3–K4–K5–K6','K-GOLD']],
 ['l','L · Piscine Rainier III','Swimming-pool complex',[191,345],[100,350],['L','L-GOLD']],
 ['n','N · Piscine Panne Nord','Northern harbour pier · pool complex',[221,330],[280,315],['N']],
 ['o','O · Piscine Plongeur','Harbour pier · pool complex',[227,356],[285,355],['O haut · upper','O bas · lower']],
 ['p','P · Piscine Panne Sud','Southern harbour pier · pool complex',[233,382],[290,395],['P']],
 ['t','T · Cale de Halage','Harbour-side pit and pool region',[199,404],[110,410],['T couverte · covered','T haut · upper','T bas · lower']],
 ['v','V · Antony Noghès','Final corner · Antony Noghès',[194,443],[130,490],['V','V-GOLD']],
 ['z','Z · Avenue J.-F. Kennedy','Broad Kennedy standing area',[228,260],[280,225],['Z · standing, unnumbered']],
 ['rocher','Secteur Rocher','Broad hillside standing region',[143,439],[50,460],['Rocher · standing, unnumbered']],
];
export const monacoVariants:Record<string,string[]>=Object.fromEntries(rows.map(r=>[r[0],r[5]]));
export const monacoAreas:VenueArea[]=rows.map(([id,name,position,point,label])=>({id,name,short:id==='rocher'?'ROCHER':id.toUpperCase(),point,label,position,focus:position,kind:id==='z'||id==='rocher'?'Standing · unnumbered':'Grandstand family',source:MONACO_CATEGORIES,confidence:'Estimated broad region from the current organizer diagram and licensed street geography; no surveyed stand boundary',description:id==='z'||id==='rocher'?'The current organizer list describes this as an unnumbered standing zone. The marker identifies a broad area, not a chair, walking route or single expected view.':id==='t'?'Covered, upper and lower T products are listed separately. This shared horizontal marker does not identify your tier, roof coverage, screen angle or exact chair.':id==='o'?'Upper and lower O products are distinct options. This shared harbour-pier region cannot locate a tier, row or physical sightline.':id==='k'?'The current category list separates K1–K2, K3–K6 and K-GOLD. Their exact subdivisions and row allocations are not reconstructed here.':'The current organizer diagram and category list identify this grandstand family. Gold options, where listed, remain separate ticket categories; their individual blocks and chairs are not mapped.'}));
export const monacoOtherOptions=[
 {id:'x-pmr',name:'X-PMR · Boulevard Albert Ier',source:MONACO_CATEGORIES,note:'The current organizer diagram names this dedicated accessible grandstand and provides a separate PMR category sheet. No platform position or accessible route is certified by ordinary stand markers.'},
 {id:'chiron',name:'Espace Chiron · Jardin Princesse Stéphanie',source:MONACO_CATEGORIES,note:'A separately marked accessible viewing area in the organizer diagram. Check the current PMR information and arrangements with the organizer; no ordinary grandstand coordinates or companion allocation are assigned.'},
 {id:'loges',name:'Loges VIP · above T',source:MONACO_ROOT+'hospitalite/',note:'A separate hospitality offer above T. A T grandstand marker does not locate a suite, table or hospitality view.'},
 {id:'belvedere',name:'Le Belvédère · above L',source:MONACO_ROOT+'hospitalite/',note:'A separate hospitality platform above L. Ordinary L or L-GOLD seating does not establish hospitality access or a table location.'},
 {id:'garage1',name:'Garage 1 · diagram reference',source:MONACO_MAP,note:'The current diagram labels Garage 1 near the final sector. No checked bookable package, room, table or individual view is supplied here.'},
 {id:'paddock-club',name:'Paddock Club · diagram reference',source:MONACO_MAP,note:'The organizer diagram identifies a Paddock Club area. This is a source reference, not a confirmed public offer or a mapped hospitality seat.'},
];
export const monacoGeography=geography;
