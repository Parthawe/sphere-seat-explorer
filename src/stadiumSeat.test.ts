import test from 'node:test';
import assert from 'node:assert/strict';
import {Mesh,MeshBasicMaterial,Raycaster,Vector3,DoubleSide} from 'three';
import {stadiumSeatPanel,modelSeatAccent,distantStadiumSeat} from './stadiumSeat';
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

test('seat shells have a dished horizontal pan, curved back and finite unit normals',()=>{
 const pan=stadiumSeatPanel(),back=stadiumSeatPanel(true),material=new MeshBasicMaterial({side:DoubleSide});
 const sample=(g:typeof pan,x:number,y:number,z:number,dx:number,dy:number,dz:number)=>{const mesh=new Mesh(g,material);mesh.updateMatrixWorld();return new Raycaster(new Vector3(x,y,z),new Vector3(dx,dy,dz)).intersectObject(mesh)[0]?.point;};
 try{
  const center=sample(pan,0,2,0,0,-1,0)!,rim=sample(pan,.38,2,0,0,-1,0)!;assert(center&&rim);assert(rim.y>center.y+.1);
  const middle=sample(back,0,0,2,0,0,-1)!,side=sample(back,.35,0,2,0,0,-1)!;assert(middle&&side);assert(side.z>middle.z+.1);
  for(const g of [pan,back]){const normals=g.getAttribute('normal');for(let i=0;i<normals.count;i++){const length=Math.hypot(normals.getX(i),normals.getY(i),normals.getZ(i));assert(Number.isFinite(length));assert(Math.abs(length-1)<1e-5);}}
 }finally{pan.dispose();back.dispose();material.dispose();}
});

test('distant chairs preserve individual pan and back silhouettes with bounded geometry',()=>{
 const geometry=distantStadiumSeat();try{assert(geometry.getAttribute('position').count<=72);assert(geometry.boundingBox!.max.y>.75);assert(geometry.boundingBox!.min.y>.2);for(const value of geometry.getAttribute('position').array)assert(Number.isFinite(value));}finally{geometry.dispose();}
});
