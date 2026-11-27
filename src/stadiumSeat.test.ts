import test from 'node:test';
import assert from 'node:assert/strict';
import {stadiumSeatPanel,modelSeatAccent} from './stadiumSeat';
import {circuitModels,normalizeModelPosition} from './circuitSeating';

test('molded seat shells fit the existing unit envelope and remain finite with a grip opening',()=>{
 for(const grip of [false,true]){const geometry=stadiumSeatPanel(grip),box=geometry.boundingBox!;for(const axis of ['x','y','z'] as const){assert(Math.abs(box.min[axis]+.5)<1e-6);assert(Math.abs(box.max[axis]-.5)<1e-6);}for(const value of geometry.getAttribute('position').array)assert(Number.isFinite(value));geometry.dispose();}
});
test('each supported model highlights only its selected model position and section row',()=>{
 for(const model of Object.values(circuitModels)){
  const selection=normalizeModelPosition(model,{}),bank=model.banks.find(b=>b.id===selection.bank)!;
  const row=Array.from({length:bank.seats},(_,i)=>({...selection,seat:i+1}));
  assert.equal(row.filter(p=>modelSeatAccent(p,selection,'#123456')==='#e8453d').length,1);
  assert.equal(modelSeatAccent({...selection,row:selection.row+1},selection,'#123456'),'#123456');
  assert.equal(modelSeatAccent({...selection,section:selection.section+1},selection,'#123456'),'#123456');
  assert.equal(modelSeatAccent({...selection,bank:'other'},selection,'#123456'),'#123456');
 }
});
