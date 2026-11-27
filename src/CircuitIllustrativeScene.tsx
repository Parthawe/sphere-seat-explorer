import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {useEffect,useMemo,useRef} from 'react';
import * as T from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {SurfaceMaterial,ShaderGuard,StudioReflections} from './SceneMaterials';
import {CircuitCars} from './PassingCars';
import {buildStudyGeometry,sampleStudy,type StudySelection} from './circuitStudy';
import type {CircuitLayout} from './circuitLayouts';
import {circuitRibbon} from './circuitRibbon';

type Props={layout:CircuitLayout;selection:StudySelection;playing:boolean;visible:boolean;reset:number;zoom:number;onReady:()=>void;onUnavailable:()=>void};
export default function CircuitIllustrativeScene(props:Props){
 return <Canvas shadows dpr={[1,1.5]} frameloop={!props.visible?'never':props.playing?'always':'demand'} camera={{fov:44,near:.015,far:120,position:[12,15,15]}} gl={{antialias:true}} fallback={<span>3D requires WebGL.</span>}><ShaderGuard onUnavailable={props.onUnavailable}/><World {...props} playing={props.playing&&props.visible}/></Canvas>;
}
function World({layout,selection,playing,reset,zoom,onReady,onUnavailable}:Props){
 const {camera,gl,invalidate,size}=useThree(),controls=useRef<OrbitControls|null>(null),goal=useRef<{eye:T.Vector3;target:T.Vector3}|null>(null),phase=useRef(.1),reported=useRef(false);
 const geometry=useMemo(()=>buildStudyGeometry(layout),[layout]),at=useMemo(()=>sampleStudy(geometry,selection.sample),[geometry,selection.sample]);
 const points=useMemo(()=>geometry.points.map(p=>new T.Vector3(p[0],.11,p[1])),[geometry]);
 const road=useMemo(()=>circuitRibbon(points,.09),[points]);
 const path=useMemo(()=>{const p=new T.CurvePath<T.Vector3>();for(let i=1;i<points.length;i++)p.add(new T.LineCurve3(points[i-1],points[i]));p.updateArcLengths();return p;},[points]);
 const previousZoom=useRef(zoom);
 const sign=selection.side==='left'?1:-1,nx=at.normal[0]*sign,nz=at.normal[1]*sign;
 const cameraGoal=useMemo(()=>{
  if(selection.camera==='sample'){
   const h=selection.height==='low'?.35:selection.height==='high'?.675:.545,offset=selection.height==='low'?.21:selection.height==='high'?.62:.45;
   return {eye:new T.Vector3(at.point[0]+nx*offset,h,at.point[1]+nz*offset),target:new T.Vector3(at.point[0]+at.tangent[0]*.25,.14,at.point[1]+at.tangent[1]*.25)};
  }
  const direction=new T.Vector3(10,12,13).normalize(),right=new T.Vector3().crossVectors(new T.Vector3(0,1,0),direction).normalize(),up=new T.Vector3().crossVectors(direction,right).normalize(),tanY=Math.tan(44*Math.PI/360),tanX=tanY*size.width/size.height;
  let distance=10;for(const p of points){const depth=p.dot(direction);distance=Math.max(distance,Math.abs(p.dot(right))/(tanX*.78)+depth,Math.abs(p.dot(up))/(tanY*.78)+depth);}
  return {eye:direction.multiplyScalar(distance*1.08),target:new T.Vector3()};
 },[selection.camera,selection.height,at,nx,nz,points,size.width,size.height]);
 useEffect(()=>{gl.setClearColor('#15151e');const lost=(e:Event)=>{e.preventDefault();onUnavailable();};gl.domElement.addEventListener('webglcontextlost',lost);return()=>gl.domElement.removeEventListener('webglcontextlost',lost);},[gl,onUnavailable]);
 useEffect(()=>{const c=new OrbitControls(camera,gl.domElement);c.enableDamping=true;c.enablePan=false;c.minDistance=.2;c.maxDistance=55;c.maxPolarAngle=Math.PI*.48;const change=()=>invalidate(),manual=()=>{goal.current=null;};c.addEventListener('change',change);c.addEventListener('start',manual);controls.current=c;return()=>{c.dispose();controls.current=null;};},[camera,gl,invalidate]);
 useEffect(()=>{
  if(controls.current)controls.current.enabled=selection.camera==='overview';goal.current=cameraGoal;
  const q=matchMedia('(prefers-reduced-motion: reduce)'),settle=()=>{if(q.matches&&goal.current){camera.position.copy(goal.current.eye);controls.current?.target.copy(goal.current.target);camera.lookAt(goal.current.target);goal.current=null;invalidate();}};
  settle();q.addEventListener('change',settle);invalidate();return()=>q.removeEventListener('change',settle);
 },[cameraGoal,selection.camera,reset,camera,invalidate]);
 useEffect(()=>{const delta=zoom-previousZoom.current;previousZoom.current=zoom;if(!delta||selection.camera!=='overview')return;goal.current=null;const target=controls.current?.target??new T.Vector3();camera.position.sub(target).multiplyScalar(delta>0?.85:1.18).add(target);controls.current?.update();invalidate();},[zoom,selection.camera,camera,invalidate]);
 useEffect(()=>{phase.current=(selection.sample/100-.008+1)%1;invalidate();},[selection.sample,invalidate]);
 useEffect(()=>{gl.domElement.dataset.studyCamera=selection.camera;gl.domElement.dataset.studySample=String(selection.sample);gl.domElement.dataset.studyHeight=selection.height;gl.domElement.dataset.studySide=selection.side;invalidate();},[selection,gl,invalidate]);
 useEffect(()=>()=>road.dispose(),[road]);
 useFrame((_,delta)=>{
  if(goal.current){const t=1-Math.exp(-Math.min(delta,.05)*8);camera.position.lerp(goal.current.eye,t);controls.current?.target.lerp(goal.current.target,t);camera.lookAt(controls.current?.target??goal.current.target);if(camera.position.distanceTo(goal.current.eye)<.002){camera.position.copy(goal.current.eye);goal.current=null;}else invalidate();}
  if(selection.camera==='overview')controls.current?.update();
  if(playing)phase.current=(phase.current+Math.min(delta,.05)/35)%1;
  if(!reported.current){reported.current=true;onReady();}
 });
 return <><StudioReflections intensity={.55}/><ambientLight intensity={.25}/><hemisphereLight args={['#f7f4f1','#24242b',.65]}/><directionalLight position={[-7,13,7]} intensity={2.7} color="#fff2e3" castShadow shadow-mapSize={[1024,1024]} shadow-bias={-.0001} shadow-normalBias={.003} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8}/><directionalLight position={[8,4,-8]} intensity={.6}/>
  <mesh position={[0,-.13,0]} receiveShadow><boxGeometry args={[15,.3,15]}/><SurfaceMaterial surface="concrete" color="#49494f" roughness={.9} grainScale={3} strength={.18}/></mesh>
  <mesh geometry={road} receiveShadow><SurfaceMaterial surface="asphalt" color="#202025" roughness={.92} grainScale={14} strength={.2}/></mesh>
  <CircuitCars path={path} phase={phase} playing={playing}/>
  <group position={[at.point[0]+nx*.24,.12,at.point[1]+nz*.24]} rotation={[0,Math.atan2(nx,nz),0]}>
   {Array.from({length:6},(_,r)=><group key={r}><mesh castShadow receiveShadow position={[0,r*.065+.035,r*.085]}><boxGeometry args={[.82,.07,.085]}/><SurfaceMaterial surface="concrete" color="#b1b0ad" grainScale={12}/></mesh>{Array.from({length:8},(_,c)=><mesh key={c} castShadow position={[(c-3.5)*.09,r*.065+.09,r*.085]}><boxGeometry args={[.065,.035,.055]}/><SurfaceMaterial surface="coated" color="#e10600" roughness={.35} grainScale={25}/></mesh>)}</group>)}
   <mesh position={[0,.44,.46]} castShadow><boxGeometry args={[.85,.025,.025]}/><meshStandardMaterial color="#b5b5bb" metalness={.7} roughness={.3}/></mesh>
  </group>
 </>;
}
