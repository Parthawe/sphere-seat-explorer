import type {Race} from './races';
import {circuitLayoutId,validateCircuitLayout,type CircuitLayout} from './circuitLayouts';

/** Bound both the response and body read; leaving a race cancels quietly. */
export async function loadCircuitLayout(
 race:Pick<Race,'season'|'slug'>,
 signal:AbortSignal,
 timeoutMs=15000,
 fetcher:typeof fetch=fetch,
):Promise<CircuitLayout>{
 signal.throwIfAborted();
 const controller=new AbortController();
 const cancel=()=>controller.abort(signal.reason);
 let onAbort:()=>void=()=>{};
 const aborted=new Promise<never>((_,reject)=>{
  onAbort=()=>reject(controller.signal.reason);
  controller.signal.addEventListener('abort',onAbort,{once:true});
 });
 signal.addEventListener('abort',cancel,{once:true});
 const timer=setTimeout(()=>controller.abort(new DOMException('Circuit data took too long to load.','TimeoutError')),timeoutMs);
 try{
  return await Promise.race([aborted,(async()=>{
   const response=await fetcher('/data/circuit-layouts.json',{signal:controller.signal});
   if(!response.ok)throw Error('Circuit data unavailable');
   const data:unknown=await response.json();
   const id=circuitLayoutId(race.season,race.slug);
   const layout=validateCircuitLayout(data&&typeof data==='object'?(data as Record<string,unknown>)[id??'']:null,race);
   if(!layout)throw Error('Circuit identity unavailable');
   return layout;
  })()]);
 }finally{
  clearTimeout(timer);
  signal.removeEventListener('abort',cancel);
  controller.signal.removeEventListener('abort',onAbort);
 }
}
