import type {RaceLighting} from './raceLighting';
import {ShaderGuard} from './SceneMaterials';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {Suspense,useEffect,useRef,type RefObject} from 'react';
import * as T from 'three';
import {World} from './World';
import {HERO_SELECTION,heroCameraEase,heroCameraPose,type HeroCameraView} from './heroCamera';

type Props={lighting?:RaceLighting;autoRotate?:boolean;view:HeroCameraView;motion:boolean;reduced:boolean;active:boolean;interactionRef:RefObject<HTMLElement|null>;onReady:()=>void;onUnavailable:()=>void};
function HeroRig({autoRotate,view,motion,reduced,active,interactionRef,onReady}:Props) {
 const {camera,gl,size,invalidate}=useThree();
 const pose=heroCameraPose(view,size.width/Math.max(1,size.height));
 const baseEye=useRef(new T.Vector3(...pose.eye)),baseTarget=useRef(new T.Vector3(...pose.target));
 const look=useRef(new T.Vector3(...pose.target)),initialized=useRef(false),sentReady=useRef(false),frames=useRef(0);
 const destination=useRef({eye:new T.Vector3(...pose.eye),target:new T.Vector3(...pose.target),fov:pose.fov});
 const flight=useRef<{fromEye:T.Vector3;fromTarget:T.Vector3;fromFov:number;elapsed:number}|null>(null);
 const orbitTime=useRef(0);
 const desired=useRef({x:0,y:0,scroll:0}),smooth=useRef({x:0,y:0,scroll:0});
 const scratch=useRef({direction:new T.Vector3(),eye:new T.Vector3(),target:new T.Vector3(),euler:new T.Euler(),axis:new T.Vector3(0,1,0)});
 function snap(){(camera as T.PerspectiveCamera).fov=destination.current.fov;(camera as T.PerspectiveCamera).updateProjectionMatrix();camera.position.copy(destination.current.eye);look.current.copy(destination.current.target);baseEye.current.copy(camera.position);baseTarget.current.copy(look.current);camera.lookAt(look.current);flight.current=null;gl.domElement.dataset.heroCameraState='ready';invalidate();}
 function begin(){
  if(camera.position.distanceTo(destination.current.eye)<.001&&look.current.distanceTo(destination.current.target)<.001&&Math.abs((camera as T.PerspectiveCamera).fov-destination.current.fov)<.001){snap();return;}
  flight.current={fromEye:camera.position.clone(),fromTarget:look.current.clone(),fromFov:(camera as T.PerspectiveCamera).fov,elapsed:0};gl.domElement.dataset.heroCameraState='moving';invalidate();
 }
 useEffect(()=>{
  const next=heroCameraPose(view,size.width/Math.max(1,size.height));destination.current={eye:new T.Vector3(...next.eye),target:new T.Vector3(...next.target),fov:next.fov};
  if(!initialized.current||reduced||!motion){initialized.current=true;snap();}else begin();
  // View/resize determines the pose; pausing is handled separately below.
 },[view,size.width,size.height]);
 useEffect(()=>{
  gl.domElement.dataset.heroMotion=String(motion&&!reduced);
  if(reduced){snap();smooth.current={x:0,y:0,scroll:0};}
  else if(!motion){flight.current=null;gl.domElement.dataset.heroCameraState='paused';invalidate();}
  else if(!autoRotate)begin();else invalidate();
 },[motion,reduced,autoRotate]);
 useEffect(()=>{gl.domElement.dataset.heroActive=String(active);if(active)invalidate();},[active,gl,invalidate]);
 useEffect(()=>{
  const element=interactionRef.current;if(!element)return;
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const pointer=(event:PointerEvent)=>{if(!fine.matches)return;const rect=element.getBoundingClientRect();desired.current.x=T.MathUtils.clamp((event.clientX-rect.left)/rect.width*2-1,-1,1);desired.current.y=T.MathUtils.clamp((event.clientY-rect.top)/rect.height*2-1,-1,1);};
  const leave=()=>{desired.current.x=0;desired.current.y=0;};
  const scroll=()=>{const rect=element.getBoundingClientRect();desired.current.scroll=T.MathUtils.clamp((innerHeight/2-rect.top-rect.height/2)/innerHeight,-1,1);};
  element.addEventListener('pointermove',pointer);element.addEventListener('pointerleave',leave);window.addEventListener('scroll',scroll,{passive:true});scroll();
  return()=>{element.removeEventListener('pointermove',pointer);element.removeEventListener('pointerleave',leave);window.removeEventListener('scroll',scroll);};
 },[interactionRef]);
 useFrame((_,delta)=>{
  if(!active)return;
  frames.current++;gl.domElement.dataset.heroFrames=String(frames.current);
  if(!sentReady.current){sentReady.current=true;onReady();}
  if(!motion||reduced)return;
  const step=Math.min(delta,.05),current=flight.current;
  if(current){
   current.elapsed+=step;const progress=Math.min(1,current.elapsed/1.45),ease=heroCameraEase(progress);
   (camera as T.PerspectiveCamera).fov=T.MathUtils.lerp(current.fromFov,destination.current.fov,ease);(camera as T.PerspectiveCamera).updateProjectionMatrix();camera.position.lerpVectors(current.fromEye,destination.current.eye,ease);look.current.lerpVectors(current.fromTarget,destination.current.target,ease);camera.lookAt(look.current);
   if(progress===1){baseEye.current.copy(camera.position);baseTarget.current.copy(look.current);flight.current=null;gl.domElement.dataset.heroCameraState='ready';}
   return;
  }
  smooth.current.x=T.MathUtils.damp(smooth.current.x,desired.current.x,5,step);smooth.current.y=T.MathUtils.damp(smooth.current.y,desired.current.y,5,step);smooth.current.scroll=T.MathUtils.damp(smooth.current.scroll,desired.current.scroll,5,step);
  const s=scratch.current;s.eye.copy(baseEye.current);s.target.copy(baseTarget.current);
  if(view==='circuit'){
   orbitTime.current+=step;gl.domElement.dataset.previewOrbit=String(autoRotate?orbitTime.current:0);
   s.eye.sub(baseTarget.current).applyAxisAngle(s.axis,smooth.current.x*.025+(autoRotate?Math.sin(orbitTime.current*.22)*.12:0)).add(baseTarget.current);s.eye.y+=smooth.current.scroll*4;s.target.y+=smooth.current.y*2;
  }else{
   s.direction.subVectors(baseTarget.current,baseEye.current);s.euler.set(-smooth.current.y*.018+smooth.current.scroll*.008,smooth.current.x*.025,0,'YXZ');s.direction.applyEuler(s.euler);s.target.copy(baseEye.current).add(s.direction);
  }
  camera.position.copy(s.eye);look.current.copy(s.target);camera.lookAt(look.current);
 });
 return null;
}
export default function HeroScene(props:Props) {
 const visibleMotion=props.active&&props.motion&&!props.reduced;
 return <Canvas frameloop={!props.active?'never':visibleMotion?'always':'demand'} shadows="soft" dpr={[1,1.25]} camera={{position:[210,260,-365],fov:46,near:.25,far:1800}} gl={{antialias:true,powerPreference:'default'}} fallback={<span>3D unavailable</span>} onCreated={({gl})=>{gl.domElement.setAttribute('aria-label','Live illustrative Las Vegas 3D scene');gl.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();props.onUnavailable();},{once:true});}}>
  <ShaderGuard onUnavailable={props.onUnavailable}/><Suspense fallback={null}><World lighting={props.lighting} selection={HERO_SELECTION} mode={props.view==='circuit'?'overview':'seat'} playing={visibleMotion} ambientMotion={visibleMotion} atmosphere sphereDisplay="moon"/><HeroRig {...props}/></Suspense>
 </Canvas>;
}
