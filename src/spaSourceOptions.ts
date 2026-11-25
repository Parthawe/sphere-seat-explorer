// Public organizer routes checked 25 November 2026. These are information
// handoffs, not availability records or locations in the seating model.
export const spaSourceOptions = [
 {id:'gold-6-bis',group:'Other grandstands',name:'Gold 6 Bis · Chicane',source:'https://www.spagrandprix.com/en/gold-6-bis',note:'The organizer lists a separate uncovered Chicane product. Its location map does not identify a distinct Gold 6 Bis region, so no seat view is assigned here.'},
 {id:'bronze',group:'General admission',name:'Bronze · roaming areas',source:'https://www.spagrandprix.com/en/bronze-area',note:'Access to multiple unassigned viewing zones, including Kemmel, Blanchimont and the Pouhon descent. There is no assigned chair or single seat view. Paths, gradients and actual viewing positions are not mapped here.'},
 {id:'bronze-bruxelles',group:'General admission',name:'Bronze · Bruxelles',source:'https://www.spagrandprix.com/en/bronze-area-bruxelles',note:'A separately listed pedestrian area inside the Bruxelles corner. It is not Silver 4 and has no assigned model chairs. Confirm access and the selected season’s terms with the organizer.'},
 {id:'prm-chicane',group:'Accessible platforms',name:'PRM · Chicane',source:'https://www.spagrandprix.com/en/prm-chicane',note:'Organizer information for a reduced-mobility platform near Gold 1. Platform dimensions, wheelchair spaces, companion positions and step-free routes are unverified; no accessibility claim is made for this model.'},
 {id:'prm-source',group:'Accessible platforms',name:'PRM · Source',source:'https://www.spagrandprix.com/en/prm-source',note:'Organizer information for a reduced-mobility platform at the La Source exit. Confirm eligibility and access arrangements directly; this model has no verified platform geometry or accessible route.'},
 ...[
  ['mezzanines','Mezzanines','mezzanines'],
  ['loge-raidillon','Loges Raidillon','tickets-loge-raidillon'],
  ['champions-eau-rouge','Champions Club · Eau Rouge','champions-club-eau-rouge'],
  ['champions-business','Champions Club · Business Tower','champions-club-business'],
  ['loge-rx','Loge RX','loge-rx'],
  ['paddock-club','Paddock Club','paddock-club'],
  ['ardennes-club','Ardennes Club','ardennes-4-jours'],
  ['campus','Campus Automobile','vip-campus'],
 ].map(([id,name,slug])=>({id,group:'Hospitality',name,source:'https://www.spagrandprix.com/en/'+slug,note:'Official information only. Hospitality rooms, assigned tables, package facilities, access routes and their views are not reconstructed. Confirm current inclusions and availability with the organizer.'})),
];
