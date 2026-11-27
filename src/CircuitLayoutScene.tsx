import StudyTrackSurface from './StudyTrackSurface';
import useSceneQuality from './useSceneQuality';
import {CircuitCars} from './PassingCars';
import {ShaderGuard,StudioReflections} from './SceneMaterials';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {useEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import type {CircuitLayout} from './circuitLayouts';
export type LayoutCamera='perspective'|'top';
export default function CircuitLayoutScene({layout,mode,reset,zoom,playing,visible,onReady,onUnavailable}:{layout:CircuitLayout;mode:LayoutCamera;reset:number;zoom:number;playing:boolean;visible:boolean;onReady:()=>void;onUnavailable:()=>void}) {
 const quality=useSceneQuality();
 return <Canvas shadows dpr={quality.dpr} frameloop={!visible?'never':playing?'always':'demand'} camera={{position:[10,13,14],fov:44,near:.05,far:200}} gl={{antialias:true,alpha:false}} fallback={<span>3D requires WebGL.</span>}><ShaderGuard onUnavailable={onUnavailable}/><World {...{layout,mode,reset,zoom,onReady,onUnavailable}} playing={playing&&visible} shadowSize={quality.shadowSize}/></Canvas>;
}
function World({layout,mode,reset,zoom,playing,onReady,onUnavailable,shadowSize}:{shadowSize:number;layout:CircuitLayout;mode:LayoutCamera;reset:number;zoom:number;playing:boolean;onReady:()=>void;onUnavailable:()=>void}) {
 const {camera,gl,invalidate,size}=useThree(),controls=useRef<OrbitControls|null>(null),target=useRef<THREE.Vector3|null>(null),phase=useRef(.1);
 const points=useMemo(()=>{const xs=layout.points.map(p=>p[0]),zs=layout.points.map(p=>p[1]),span=Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...zs)-Math.min(...zs));const cx=(Math.max(...xs)+Math.min(...xs))/2,cz=(Math.max(...zs)+Math.min(...zs))/2;return layout.points.map(p=>new THREE.Vector3((p[0]-cx)/span*12,.11,(p[1]-cz)/span*12));},[layout]);
 const lastZoom=useRef(zoom);

 const path=useMemo(()=>new THREE.CurvePath<THREE.Vector3>(),[]);
 useMemo(()=>{path.curves=[];for(let i=1;i<points.length;i++)path.add(new THREE.LineCurve3(points[i-1],points[i]));path.updateArcLengths();},[path,points]);
 const cameraGoal=useMemo(()=>{
  const direction=(mode==='top'?new THREE.Vector3(0,1,.005):new THREE.Vector3(10,12,13)).normalize();
  const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),direction).normalize(),up=new THREE.Vector3().crossVectors(direction,right).normalize();
  const tanY=Math.tan(44*Math.PI/360),tanX=tanY*size.width/size.height,vertical=.82;
  let distance=10;for(const p of points){const depth=p.dot(direction);distance=Math.max(distance,Math.abs(p.dot(right))/(tanX*.84)+depth,Math.abs(p.dot(up))/(tanY*vertical)+depth);}
  return direction.multiplyScalar(distance*1.06);
 },[points,mode,size.width,size.height]);
 useEffect(()=>{gl.setClearColor('#15151e');const lost=(event:Event)=>{event.preventDefault();onUnavailable();};gl.domElement.addEventListener('webglcontextlost',lost);onReady();return()=>gl.domElement.removeEventListener('webglcontextlost',lost);},[gl,onReady,onUnavailable]);
 useEffect(()=>{const c=new OrbitControls(camera,gl.domElement);c.enableDamping=!matchMedia('(prefers-reduced-motion: reduce)').matches;c.dampingFactor=.08;c.minDistance=5;c.maxDistance=45;c.minPolarAngle=.03;c.maxPolarAngle=Math.PI*.47;c.enablePan=false;c.target.set(0,0,0);const change=()=>invalidate(),manual=()=>{target.current=null;};c.addEventListener('change',change);c.addEventListener('start',manual);controls.current=c;return()=>{c.dispose();controls.current=null;};},[camera,gl,invalidate]);
 useEffect(()=>{const v=cameraGoal.clone();target.current=v;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced){camera.position.copy(v);camera.lookAt(0,0,0);target.current=null;}invalidate();},[cameraGoal,reset,camera,invalidate]);
 useEffect(()=>{const delta=zoom-lastZoom.current;lastZoom.current=zoom;if(!delta)return;target.current=null;camera.position.multiplyScalar(delta>0?.85:1.18);controls.current?.update();invalidate();},[zoom,camera,invalidate]);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'),update=()=>{if(q.matches&&target.current){camera.position.copy(target.current);target.current=null;controls.current?.update();invalidate();}};q.addEventListener('change',update);return()=>q.removeEventListener('change',update);},[camera,invalidate]);

 useFrame((_,dt)=>{if(target.current){camera.position.lerp(target.current,1-Math.exp(-Math.min(dt,.05)*7));if(camera.position.distanceTo(target.current)<.01){camera.position.copy(target.current);target.current=null;}else invalidate();}controls.current?.update();if(playing)phase.current=(phase.current+Math.min(dt,.05)/24)%1;});
 return <><StudioReflections intensity={.45}/><ambientLight intensity={.25}/><hemisphereLight args={['#f7f4f1','#202028',.55]}/><directionalLight position={[-8,16,8]} intensity={2.5} color="#fff2e3" castShadow shadow-bias={-.0001} shadow-normalBias={.006} shadow-mapSize={[shadowSize,shadowSize]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12}/><directionalLight position={[10,5,-10]} intensity={.6} color="#e6e8f1"/>
  <StudyTrackSurface points={points}/>
  <CircuitCars path={path} phase={phase} playing={playing}/>
 </>;
}
