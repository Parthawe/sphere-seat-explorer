import type { Race } from './races';
export const PRICE_CURRENCIES = ['USD','EUR','GBP','QAR','BHD','AED','AUD','CAD','SGD','JPY','CHF','MXN','BRL'] as const;
export type PriceCurrency = typeof PRICE_CURRENCIES[number];
export type PricePoint = { id:string; amount:number; observedAt:string };
export type PriceWatch = { id:string; product:string; seller:string; url:string; currency:PriceCurrency; start:string; end:string; target:number|null; points:PricePoint[] };
export const notebookKey = (race:Pick<Race,'season'|'slug'>) => `f1tickets:prices:v1:${race.season}:${race.slug}`;
export function publicProductUrl(value:unknown):string|null {
 try { const url=new URL(String(value));if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)return null;return url.href;}catch{return null;}
}
export function validAmount(value:unknown):value is number {return typeof value==='number'&&Number.isFinite(value)&&value>0&&value<=100000000;}
const text=(value:unknown,max:number)=>typeof value==='string'&&value.trim().length>0&&value.trim().length<=max;
export function readWatches(raw:unknown,race:Pick<Race,'start'|'end'>,now=Date.now()):PriceWatch[] {
 if(!Array.isArray(raw))return [];
 const ids=new Set<string>();
 return raw.slice(0,30).flatMap((item:unknown)=>{
  if(!item||typeof item!=='object')return [];
  const w=item as PriceWatch;
  if(!text(w.id,100)||ids.has(w.id)||!text(w.product,100)||!text(w.seller,80)||!PRICE_CURRENCIES.includes(w.currency)||!publicProductUrl(w.url)||typeof w.start!=='string'||typeof w.end!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(w.start)||!/^\d{4}-\d{2}-\d{2}$/.test(w.end)||w.start<race.start||w.end>race.end||w.start>w.end||!Array.isArray(w.points))return [];
  const pointIds=new Set<string>();
  const points=w.points.slice(-200).filter(p=>p&&text(p.id,100)&&!pointIds.has(p.id)&&validAmount(p.amount)&&typeof p.observedAt==='string'&&Number.isFinite(Date.parse(p.observedAt))&&Date.parse(p.observedAt)<=now&&(pointIds.add(p.id),true)).sort((a,b)=>Date.parse(a.observedAt)-Date.parse(b.observedAt)).map(p=>({id:p.id,amount:p.amount,observedAt:p.observedAt}));
  if(!points.length)return [];ids.add(w.id);
  return [{id:w.id,product:w.product.trim(),seller:w.seller.trim(),url:publicProductUrl(w.url)!,currency:w.currency,start:w.start,end:w.end,target:validAmount(w.target)?w.target:null,points}];
 });
}
export function priceSummary(watch:PriceWatch) {
 const first=watch.points[0],latest=watch.points.at(-1)!;
 return {first,latest,change:watch.points.length>1?latest.amount-first.amount:null,min:Math.min(...watch.points.map(p=>p.amount)),max:Math.max(...watch.points.map(p=>p.amount)),withinTarget:watch.target!==null&&latest.amount<=watch.target};
}
export const priceMoney=(amount:number,currency:PriceCurrency)=>new Intl.NumberFormat(undefined,{style:'currency',currency,maximumFractionDigits:2}).format(amount);

/** Apply local edits to the newest stored notebook without replacing another tab's quotes. */
export function mergePriceWatches(base:PriceWatch[],next:PriceWatch[],latest:PriceWatch[]):PriceWatch[] {
 const result=latest.map(w=>({...w,points:[...w.points]}));
 for(const before of base){
  const after=next.find(w=>w.id===before.id),index=result.findIndex(w=>w.id===before.id),remote=result[index];
  const removed=new Set(before.points.filter(p=>!after?.points.some(n=>n.id===p.id)).map(p=>p.id));
  const added=after?.points.filter(p=>!before.points.some(b=>b.id===p.id))??[];
  const changedTarget=after&&after.target!==before.target;
  if(!remote){if(added.length||changedTarget)throw Error('This option was removed in another tab. Add it again to record a new quote.');continue;}
  if(after&&(remote.product!==before.product||remote.seller!==before.seller||remote.currency!==before.currency||remote.start!==before.start||remote.end!==before.end||remote.url!==before.url))throw Error('This option changed in another tab. Reload it before editing.');
  remote.points=remote.points.filter(p=>!removed.has(p.id));
  for(const point of added)if(!remote.points.some(p=>p.id===point.id))remote.points.push(point);
  if(changedTarget)remote.target=after!.target;
 }
 for(const watch of next.filter(w=>!base.some(b=>b.id===w.id))){const remote=result.find(w=>w.id===watch.id);if(remote){for(const point of watch.points)if(!remote.points.some(p=>p.id===point.id))remote.points.push(point);}else result.push({...watch,points:[...watch.points]});}
 const clean=result.filter(w=>w.points.length).map(w=>({...w,points:w.points.sort((a,b)=>Date.parse(a.observedAt)-Date.parse(b.observedAt))}));
 if(clean.length>30||clean.some(w=>w.points.length>200))throw Error('The saved-note limit was reached in another tab. Export or remove older notes first.');
 return clean;
}
