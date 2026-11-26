import {test} from 'node:test';
import assert from 'node:assert/strict';
import {notebookKey,priceSummary,publicProductUrl,readWatches,type PriceWatch} from './ticketPriceHistory';
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
