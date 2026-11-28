import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bindDoubleTap} from './useDoubleTapFocus';

test('double-tap focus excludes single taps, drags, pinches and cancelled touches',()=>{
 const original=globalThis.window;
 globalThis.window=new EventTarget() as unknown as Window & typeof globalThis;
 const element=new EventTarget() as HTMLElement;
 let calls=0;
 const dispose=bindDoubleTap(element,()=>calls++);
 const send=(type:string,x=20,y=20,id=1)=>{
  const e=new Event(type);Object.assign(e,{clientX:x,clientY:y,pointerId:id,pointerType:'touch',isPrimary:id===1,button:0});element.dispatchEvent(e);
 };
 const tap=()=>{send('pointerdown');send('pointerup');};
 try{
  tap();assert.equal(calls,0);
  tap();assert.equal(calls,1);
  send('pointerdown');send('pointermove',60);send('pointerup',60);tap();assert.equal(calls,1);
  send('pointercancel');
  send('pointerdown');send('pointerdown',40,40,2);send('pointerup',40,40,2);send('pointerup');tap();assert.equal(calls,1);
  send('pointercancel');
  send('pointerdown');send('pointercancel');tap();assert.equal(calls,1);
  send('pointercancel');tap();tap();assert.equal(calls,2);
  dispose();tap();tap();assert.equal(calls,2,'Unmount removes gesture listeners');
 }finally{dispose();globalThis.window=original;}
});
