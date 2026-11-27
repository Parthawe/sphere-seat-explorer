import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {useEffect,useMemo,useRef} from 'react';
import * as T from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {SurfaceMaterial,ShaderGuard,StudioReflections} from './SceneMaterials';
import {CircuitCars} from './PassingCars';
import {buildStudyGeometry} from './circuitStudy';
import type {CircuitLayout} from './circuitLayouts';
import {circuitRibbon} from './circuitRibbon';

type Props={layout:CircuitLayout;playing:boolean;visible:boolean;reset:number;zoom:number;onReady:()=>void;onUnavailable:()=>void};
export default function CircuitIllustrativeScene(props:Props){
 return <Canvas shadows dpr={[1,1.5]} frameloop={!props.visible?'never':props.playing?'always':'demand'} camera={{fov:44,near:.015,far:120,position:[12,15,15]}} gl={{antialias:true}} fallback={<span>3D requires WebGL.</span>}><ShaderGuard onUnavailable={props.onUnavailable}/><World {...props} playing={props.playing&&props.visible}/></Canvas>;
}
function World({layout,playing,reset,zoom,onReady,onUnavailable}:Props){
 const {camera,gl,invalidate,size}=useThree(),controls=useRef<OrbitControls|null>(null),goal=useRef<{eye:T.Vector3;target:T.Vector3}|null>(null),phase=useRef(.1),reported=useRef(false);
 const geometry=useMemo(()=>buildStudyGeometry(layout),[layout]);
 const points=useMemo(()=>geometry.points.map(p=>new T.Vector3(p[0],.11,p[1])),[geometry]);
 const road=useMemo(()=>circuitRibbon(points,.09),[points]);
 const path=useMemo(()=>{const p=new T.CurvePath<T.Vector3>();for(let i=1;i<points.length;i++)p.add(new T.LineCurve3(points[i-1],points[i]));p.updateArcLengths();return p;},[points]);
 const previousZoom=useRef(zoom);
 const cameraGoal=useMemo(()=>{
  const direction=new T.Vector3(10,12,13).normalize(),right=new T.Vector3().crossVectors(new T.Vector3(0,1,0),direction).normalize(),up=new T.Vector3().crossVectors(direction,right).normalize(),tanY=Math.tan(44*Math.PI/360),tanX=tanY*size.width/size.height;
  let distance=10;for(const p of points){const depth=p.dot(direction);distance=Math.max(distance,Math.abs(p.dot(right))/(tanX*.78)+depth,Math.abs(p.dot(up))/(tanY*.78)+depth);}
  return {eye:direction.multiplyScalar(distance*1.08),target:new T.Vector3()};
 },[points,size.width,size.height]);
 useEffect(()=>{gl.setClearColor('#15151e');const lost=(e:Event)=>{e.preventDefault();onUnavailable();};gl.domElement.addEventListener('webglcontextlost',lost);return()=>gl.domElement.removeEventListener('webglcontextlost',lost);},[gl,onUnavailable]);
 useEffect(()=>{const c=new OrbitControls(camera,gl.domElement);c.enableDamping=true;c.enablePan=false;c.minDistance=.2;c.maxDistance=55;c.maxPolarAngle=Math.PI*.48;const change=()=>invalidate(),manual=()=>{goal.current=null;};c.addEventListener('change',change);c.addEventListener('start',manual);controls.current=c;return()=>{c.dispose();controls.current=null;};},[camera,gl,invalidate]);
 useEffect(()=>{
  goal.current=cameraGoal;
  const q=matchMedia('(prefers-reduced-motion: reduce)'),settle=()=>{if(q.matches&&goal.current){camera.position.copy(goal.current.eye);controls.current?.target.copy(goal.current.target);camera.lookAt(goal.current.target);goal.current=null;invalidate();}};
  settle();q.addEventListener('change',settle);invalidate();return()=>q.removeEventListener('change',settle);
 },[cameraGoal,reset,camera,invalidate]);
 useEffect(()=>{const delta=zoom-previousZoom.current;previousZoom.current=zoom;if(!delta)return;goal.current=null;const target=controls.current?.target??new T.Vector3();camera.position.sub(target).multiplyScalar(delta>0?.85:1.18).add(target);controls.current?.update();invalidate();},[zoom,camera,invalidate]);
 useEffect(()=>{gl.domElement.dataset.studyCamera='overview';gl.domElement.dataset.studySeats='none';invalidate();},[gl,invalidate]);
 useEffect(()=>()=>road.dispose(),[road]);
 useFrame((_,delta)=>{
  if(goal.current){const t=1-Math.exp(-Math.min(delta,.05)*8);camera.position.lerp(goal.current.eye,t);controls.current?.target.lerp(goal.current.target,t);camera.lookAt(controls.current?.target??goal.current.target);if(camera.position.distanceTo(goal.current.eye)<.002){camera.position.copy(goal.current.eye);goal.current=null;}else invalidate();}
  controls.current?.update();
  if(playing)phase.current=(phase.current+Math.min(delta,.05)/35)%1;
  if(!reported.current){reported.current=true;onReady();}
 });
 return <><StudioReflections intensity={.55}/><ambientLight intensity={.25}/><hemisphereLight args={['#f7f4f1','#24242b',.65]}/><directionalLight position={[-7,13,7]} intensity={2.7} color="#fff2e3" castShadow shadow-mapSize={[1024,1024]} shadow-bias={-.0001} shadow-normalBias={.003} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8}/><directionalLight position={[8,4,-8]} intensity={.6}/>
  <mesh position={[0,-.13,0]} receiveShadow><boxGeometry args={[15,.3,15]}/><SurfaceMaterial surface="concrete" color="#49494f" roughness={.9} grainScale={3} strength={.18}/></mesh>
  <mesh geometry={road} receiveShadow><SurfaceMaterial surface="asphalt" color="#202025" roughness={.92} grainScale={14} strength={.2}/></mesh>
  <CircuitCars path={path} phase={phase} playing={playing}/>
 </>;
}
