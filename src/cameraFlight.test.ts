import test from 'node:test';
import assert from 'node:assert/strict';
import {Vector3,PerspectiveCamera} from 'three';
import {flightEase,flightDuration,flightProgress,sampleFlight,settleCamera} from './cameraFlight';

test('camera ease has stationary ends and remains monotone',()=>{
 assert.equal(flightEase(-1),0);assert.equal(flightEase(2),1);
 assert(flightEase(.001)<1e-7);assert(1-flightEase(.999)<1e-7);
 let previous=-1;for(let i=0;i<=100;i++){const value=flightEase(i/100);assert(value>=previous);previous=value;}
});
test('long approach arcs settle at the exact destination without changing seat geometry',()=>{
 const a=new Vector3(0,100,200),b=new Vector3(10,5,0),ta=new Vector3(),tb=new Vector3(0,2,-30),eye=new Vector3(),target=new Vector3();
 sampleFlight(a,b,ta,tb,0,eye,target);assert.deepEqual(eye,a);assert.deepEqual(target,ta);
 sampleFlight(a,b,ta,tb,.5,eye,target);assert(eye.y>(a.y+b.y)/2);assert(Number.isFinite(eye.length()));
 sampleFlight(a,b,ta,tb,1,eye,target);assert(eye.distanceTo(b)<1e-10);assert.deepEqual(target,tb);assert.deepEqual(a,new Vector3(0,100,200));
 assert(flightDuration(1)<flightDuration(500));assert(flightDuration(100000)<=1.35);
});
test('retargeting a flight starts at the current pose; nearby seats do not gain an arc',()=>{
 const from=new Vector3(1,2,3),to=new Vector3(2,2,4),look=new Vector3(0,1,-20),eye=new Vector3(),target=new Vector3();
 sampleFlight(from,to,look,look,.5,eye,target);assert.equal(eye.y,2);
 const interrupted=eye.clone();sampleFlight(interrupted,new Vector3(10,5,4),target.clone(),look,0,eye,target);assert.deepEqual(eye,interrupted);
});

test('slow frames finish on time and long idle before a new flight cannot skip it',()=>{
 assert.equal(flightProgress(60000,60000,1.2),0);
 assert.equal(flightProgress(60000,60600,1.2),.5);
 assert.equal(flightProgress(60000,90000,1.2),1);
 assert.equal(flightProgress(60000,59000,1.2),0);
});

test('direct manipulation during seat arrival completes the destination eye, target and lens',()=>{
 const camera=new PerspectiveCamera(45),target=new Vector3(),eye=new Vector3(42,8,-120),look=new Vector3(43,2,-30);
 const sourceEye=eye.clone(),sourceLook=look.clone();
 sampleFlight(new Vector3(800,1000,400),eye,new Vector3(),look,.15,camera.position,target);
 assert(camera.position.distanceTo(eye)>100);
 settleCamera(camera,target,eye,look,90);
 assert.deepEqual(camera.position,eye);assert.deepEqual(target,look);assert.equal(camera.fov,90);
 assert(camera.getWorldDirection(new Vector3()).distanceTo(look.clone().sub(eye).normalize())<1e-12);
 assert.deepEqual(eye,sourceEye);assert.deepEqual(look,sourceLook);
});
