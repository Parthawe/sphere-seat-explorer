import test from 'node:test';
import assert from 'node:assert/strict';
import {PerspectiveCamera,Vector3} from 'three';
import {attachSeatedPointerControls,pinchedFieldOfView} from './seatedPointerControls';
import {seatedLookTarget} from './seatLook';

class Surface extends EventTarget{
 captures=new Set<number>();
 setPointerCapture(id:number){this.captures.add(id);}
 hasPointerCapture(id:number){return this.captures.has(id);}
 releasePointerCapture(id:number){this.captures.delete(id);}
 point(type:string,id:number,x:number,y:number){this.dispatchEvent(Object.assign(new Event(type),{pointerId:id,clientX:x,clientY:y,pointerType:'touch',button:0}));}
}
test('pinch lens scale follows the perspective projection and respects seat zoom limits',()=>{
 const start=78,closer=pinchedFieldOfView(start,100,180);
 assert(closer<start);assert(Math.abs(pinchedFieldOfView(closer,180,100)-start)<1e-10);
 assert.equal(pinchedFieldOfView(78,100,10000),35);assert.equal(pinchedFieldOfView(78,10000,100),105);
 for(const distance of [0,NaN,Infinity,3])assert.equal(pinchedFieldOfView(78,100,distance),78);
});
test('pinch keeps the eye and look fixed; remaining finger resumes without a jump; cancel and cleanup release input',()=>{
 const surface=new Surface(),camera=new PerspectiveCamera(78);camera.position.set(213,12,-71);camera.lookAt(220,10,20);
 const eye=camera.position.clone(),look=camera.getWorldDirection(new Vector3());let looked=0,zoomed=0;
 const detach=attachSeatedPointerControls(surface as unknown as HTMLElement,camera,{onStart:()=>{},onLook:(yaw,pitch)=>{looked++;camera.lookAt(new Vector3(...seatedLookTarget(camera.position,yaw,pitch)));},onZoom:()=>zoomed++,invalidate:()=>{}});
 surface.point('pointerdown',1,100,200);surface.point('pointerdown',2,200,200);surface.point('pointermove',1,80,200);surface.point('pointermove',2,220,200);
 assert(zoomed>0);assert(camera.fov<78);assert.equal(looked,0);assert.deepEqual(camera.position,eye);assert(camera.getWorldDirection(new Vector3()).distanceTo(look)<1e-12);
 surface.point('pointerup',2,220,200);surface.point('pointermove',1,80,200);assert(camera.getWorldDirection(new Vector3()).distanceTo(look)<1e-12);
 surface.point('pointermove',1,90,200);assert(camera.getWorldDirection(new Vector3()).distanceTo(look)>.001);assert.deepEqual(camera.position,eye);
 surface.point('pointercancel',1,90,200);const previous=looked;surface.point('pointermove',1,180,200);assert.equal(looked,previous);
 surface.point('pointerdown',3,100,200);detach();assert.equal(surface.captures.size,0);surface.point('pointermove',3,180,200);assert.equal(looked,previous);
});
