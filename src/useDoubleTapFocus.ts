import {useEffect,useRef} from 'react';
import {useThree} from '@react-three/fiber';
import {Mesh,Object3D,Raycaster,Vector2,Vector3} from 'three';

/** Two short, nearby taps; never interpret a drag or a pinch as entry. */
export function bindDoubleTap(element:HTMLElement,onDoubleTap:(x:number,y:number)=>void){
 const active=new Set<number>();
 let down:{id:number;x:number;y:number;at:number}|null=null;
 let previous:{x:number;y:number;at:number;type:string}|null=null;
 const clear=()=>{down=null;previous=null;};
 const start=(e:PointerEvent)=>{
  active.add(e.pointerId);
  if(active.size!==1||!e.isPrimary||e.button!==0){clear();return;}
  down={id:e.pointerId,x:e.clientX,y:e.clientY,at:performance.now()};
 };
 const move=(e:PointerEvent)=>{if(down&&e.pointerId===down.id&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>10)clear();};
 const end=(e:PointerEvent)=>{
  active.delete(e.pointerId);
  const tap=down;down=null;
  if(!tap||tap.id!==e.pointerId||active.size||performance.now()-tap.at>300||Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>10){previous=null;return;}
  const at=performance.now();
  if(previous&&previous.type===e.pointerType&&at-previous.at<=350&&Math.hypot(e.clientX-previous.x,e.clientY-previous.y)<=24){previous=null;onDoubleTap(e.clientX,e.clientY);}
  else previous={x:e.clientX,y:e.clientY,at,type:e.pointerType};
 };
 const cancel=(e:PointerEvent)=>{active.delete(e.pointerId);clear();};
 const blur=()=>{active.clear();clear();};
 const prevent=(e:MouseEvent)=>e.preventDefault();
 element.addEventListener('pointerdown',start);element.addEventListener('pointermove',move);
 element.addEventListener('pointerup',end);element.addEventListener('pointercancel',cancel);
 element.addEventListener('dblclick',prevent);window.addEventListener('blur',blur);
 return()=>{element.removeEventListener('pointerdown',start);element.removeEventListener('pointermove',move);element.removeEventListener('pointerup',end);element.removeEventListener('pointercancel',cancel);element.removeEventListener('dblclick',prevent);window.removeEventListener('blur',blur);};
}

/** Focus existing scene geometry only; this never invents a seat or a location. */
export default function useDoubleTapFocus(enabled:boolean,minDistance:number,onFocus:(eye:Vector3,target:Vector3)=>void){
 const {camera,scene,gl}=useThree(),callback=useRef(onFocus);callback.current=onFocus;
 useEffect(()=>{
  if(!enabled)return;
  const ray=new Raycaster(),pointer=new Vector2();
  return bindDoubleTap(gl.domElement,(x,y)=>{
   const bounds=gl.domElement.getBoundingClientRect();if(!bounds.width||!bounds.height)return;
   pointer.set((x-bounds.left)/bounds.width*2-1,-(y-bounds.top)/bounds.height*2+1);
   camera.updateMatrixWorld();scene.updateMatrixWorld();ray.setFromCamera(pointer,camera);
   const hit=ray.intersectObjects(scene.children,true).find(h=>{
    if(!(h.object instanceof Mesh))return false;
    for(let object:Object3D|null=h.object;object;object=object.parent)if(!object.visible)return false;
    const materials=Array.isArray(h.object.material)?h.object.material:[h.object.material];
    return materials.some(m=>m.visible&&(!m.transparent||m.opacity>0));
   });
   if(!hit)return;
   const target=hit.point.clone(),offset=camera.position.clone().sub(target),distance=offset.length();
   const next=Math.max(minDistance,distance*.55);if(next>=distance)return;
   callback.current(target.clone().add(offset.multiplyScalar(next/distance)),target);
   gl.domElement.dataset.focusCount=String(Number(gl.domElement.dataset.focusCount??0)+1);
  });
 },[enabled,minDistance,camera,scene,gl]);
}
