import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadCircuitLayout} from './loadCircuitLayout';

const race={season:2027 as const,slug:'japan'};
const source=JSON.parse(readFileSync(new URL('../public/data/circuit-layouts.json',import.meta.url),'utf8'));
const fetcher=(run:(...args:Parameters<typeof fetch>)=>unknown)=>run as typeof fetch;

test('loads the requested physical circuit and rejects mismatched or unavailable data',async()=>{
 const signal=new AbortController().signal;
 const layout=await loadCircuitLayout(race,signal,100,fetcher(async()=>Response.json(source)));
 assert.equal(layout.id,'jp-1962');
 await assert.rejects(loadCircuitLayout(race,signal,100,fetcher(async()=>Response.json({'jp-1962':source['bh-2002']}))),/identity/);
 await assert.rejects(loadCircuitLayout(race,signal,100,fetcher(async()=>new Response('',{status:503}))),/unavailable/);
});

test('stalled headers and stalled JSON both time out and abort the request',async()=>{
 for(const body of [false,true]){
  let requestSignal:AbortSignal|undefined;
  const pending=new Promise<never>(()=>{});
  const request=fetcher(async(_url,init)=>{
   requestSignal=init?.signal??undefined;
   return body?{ok:true,json:()=>pending}:pending;
  });
  await assert.rejects(loadCircuitLayout(race,new AbortController().signal,10,request),{name:'TimeoutError'});
  assert.equal(requestSignal?.aborted,true);
 }
});

test('leaving a race cancels immediately and a fresh retry can succeed',async()=>{
 const owner=new AbortController();
 const pending=loadCircuitLayout(race,owner.signal,1000,fetcher(()=>new Promise(()=>{})));
 owner.abort();
 await assert.rejects(pending,{name:'AbortError'});
 const layout=await loadCircuitLayout(race,new AbortController().signal,100,fetcher(async()=>Response.json(source)));
 assert.equal(layout.id,'jp-1962');
 let fetched=false;
 await assert.rejects(loadCircuitLayout(race,owner.signal,100,fetcher(()=>{fetched=true;})),{name:'AbortError'});
 assert.equal(fetched,false);
});
