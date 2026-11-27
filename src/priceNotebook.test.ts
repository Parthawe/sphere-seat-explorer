import {test} from 'node:test';
import assert from 'node:assert/strict';
import {notebookKey,priceAdmissionWindow,priceSummary,publicProductUrl,readWatches,validPriceAdmission,type PriceWatch} from './ticketPriceHistory';
const race={slug:'qatar',season:2026 as const,start:'2026-11-27',end:'2026-11-29'};
const now=Date.parse('2026-11-26T18:00:00Z');
const option:PriceWatch={id:'one',product:'Main grandstand weekend adult',seller:'Example seller',url:'https://example.com/product',currency:'QAR',start:race.start,end:race.end,target:950,points:[{id:'a',amount:1000,observedAt:'2026-11-24T12:00:00Z'},{id:'b',amount:900,observedAt:'2026-11-25T12:00:00Z'}]};
test('personal price history measures exact-option change and target without a market forecast',()=>{
 const s=priceSummary(option);assert.equal(s.change,-100);assert.equal(s.min,900);assert.equal(s.max,1000);assert.equal(s.withinTarget,true);assert.equal(priceSummary({...option,points:[option.points[0]]}).change,null);
});
test('race and season notebooks cannot borrow each other’s notes',()=>{
 assert.notEqual(notebookKey(race),notebookKey({...race,season:2027}));assert.notEqual(notebookKey(race),notebookKey({...race,slug:'bahrain'}));assert.deepEqual(readWatches([option],{start:'2027-12-03',end:'2027-12-05'},now),[]);
});
test('corrupt, private and executable product links are rejected; links with query strings and fragments are rejected',()=>{
 for(const u of ['javascript:alert(1)','http://example.com','https://user:secret@example.com','not a link'])assert.equal(publicProductUrl(u),null);
 assert.equal(publicProductUrl('https://example.com/product?token=private#checkout'),null);assert.equal(publicProductUrl('https://example.com/product'),'https://example.com/product');
});
test('future observations, duplicate points and invalid amounts cannot become price changes',()=>{
 const invalid=[{id:'future',amount:1,observedAt:'2027-01-01T00:00:00Z'},{id:'zero',amount:0,observedAt:option.points[0].observedAt},{id:'infinite',amount:Infinity,observedAt:option.points[0].observedAt},{id:'bad',amount:1,observedAt:'not a date'},option.points[0]];
 const result=readWatches([{...option,points:[...option.points,...invalid]}],race,now);assert.equal(result[0].points.length,2);assert.equal(priceSummary(result[0]).change,-100);
});
test('restored observations sort by observation time and do not merge sellers or currencies',()=>{
 const other={...option,id:'two',seller:'Other seller',currency:'USD',points:[{id:'other',amount:15,observedAt:option.points[0].observedAt}]};
 const result=readWatches([{...option,points:[...option.points].reverse()},other],race,now);assert.equal(result.length,2);assert.equal(priceSummary(result[0]).change,-100);assert.equal(priceSummary(result[1]).change,null);assert.equal(result[1].currency,'USD');
});
test('stored notes reject unknown currencies, duplicate options and out-of-event admission',()=>{
 assert.deepEqual(readWatches([{...option,currency:'FAKE'},{...option,start:'2026-11-26'},{...option,end:'2026-11-30'},{...option,start:race.end,end:race.start}],race,now),[]);assert.equal(readWatches([option,option],race,now).length,1);assert.deepEqual(readWatches({options:[option]},race,now),[]);
});
test('verified Abu Dhabi Thursday admission saves and restores without changing Friday defaults',()=>{
 const yas={season:2026 as const,slug:'united-arab-emirates',start:'2026-12-04',end:'2026-12-06'};
 const bounds=priceAdmissionWindow(yas);
 assert.equal(bounds.start,'2026-12-03');assert.equal(bounds.end,yas.end);assert.match(bounds.source!,/tickets-2026/);
 const fourDays={...option,start:'2026-12-03',end:yas.end};
 assert.equal(readWatches([fourDays],yas,now).length,1);
 assert.equal(readWatches([{...fourDays,start:yas.start}],yas,now).length,1);
 assert.equal(validPriceAdmission('2026-12-02',yas.end,yas),false);
 assert.equal(validPriceAdmission(yas.start,'2026-12-07',yas),false);
});
test('an admission exception cannot cross events, years or a changed session calendar',()=>{
 const yas={season:2026 as const,slug:'united-arab-emirates',start:'2026-12-04',end:'2026-12-06'};
 for(const other of [{...yas,season:2027 as const},{...yas,slug:'qatar'},{start:yas.start,end:yas.end},{...yas,start:'2026-12-05'}])assert.equal(validPriceAdmission('2026-12-03',yas.end,other),false);
 assert.deepEqual(priceAdmissionWindow(race),{start:race.start,end:race.end});
 assert.equal(validPriceAdmission('2026-11-26',race.end,race),false);
});
test('calendar-invalid dates and reversed ranges never restore as valid price notes',()=>{
 const boundary={start:'2027-04-30',end:'2027-05-02'};
 assert.equal(validPriceAdmission('2027-04-31','2027-05-02',boundary),false);
 assert.equal(validPriceAdmission('2027-04-30','2027-05-02',boundary),true);
 assert.equal(validPriceAdmission('2027-05-02','2027-04-30',boundary),false);
 assert.equal(validPriceAdmission('not a date','2027-05-02',boundary),false);
 assert.deepEqual(readWatches([{...option,start:'2027-04-31',end:'2027-05-02'}],boundary,now),[]);
});

test('cross-tab edits preserve independent new quotes, local deletions and the latest target',async()=>{
 const {mergePriceWatches}=await import('./ticketPriceHistory');const base={...option,points:[option.points[0]]};const local={...base,points:[...base.points,{id:'local',amount:800,observedAt:'2026-11-25T13:00:00Z'}]};const remote={...base,target:1100,points:[...base.points,{id:'remote',amount:950,observedAt:'2026-11-25T12:00:00Z'}]};
 const merged=mergePriceWatches([base],[local],[remote]);assert.deepEqual(merged[0].points.map(p=>p.id),['a','remote','local']);assert.equal(merged[0].target,1100);
 const deleted=mergePriceWatches([base],[],[remote]);assert.deepEqual(deleted[0].points.map(p=>p.id),['remote']);
});
test('a target update cannot replace another tab’s quotes or revive a removed option',async()=>{
 const {mergePriceWatches}=await import('./ticketPriceHistory');const remote={...option,points:[...option.points,{id:'new',amount:850,observedAt:'2026-11-25T13:00:00Z'}]};const merged=mergePriceWatches([option],[{...option,target:800}],[remote]);assert.equal(merged[0].points.length,3);assert.equal(merged[0].target,800);assert.throws(()=>mergePriceWatches([option],[{...option,target:800}],[]),/removed in another tab/);
});
test('undo restores only the local removed quote while preserving another tab’s additions',async()=>{
 const {mergePriceWatches}=await import('./ticketPriceHistory');const afterRemove={...option,points:[option.points[0]]};const remote={...afterRemove,points:[...afterRemove.points,{id:'external',amount:850,observedAt:'2026-11-25T13:00:00Z'}]};const restored=mergePriceWatches([afterRemove],[option],[remote]);assert.deepEqual(restored[0].points.map(p=>p.id),['a','b','external']);
});
