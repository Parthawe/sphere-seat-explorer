import {SurfaceMaterial,ShaderGuard} from './SceneMaterials';
import {seatedLookTarget} from "./seatLook";
import {groundHeight,roadSample} from './circuitTerrain';
import SilverstoneWing from './SilverstoneWing';
import ShanghaiCanopy from './ShanghaiCanopy';
import HardRockStadium from './HardRockStadium';
import CircuitPark,{createGrassTexture} from "./CircuitPark";
import FormulaCar from "./FormulaCar";
import {Canvas,useFrame,useThree,useLoader} from '@react-three/fiber';
import {Component,Suspense,useEffect,useLayoutEffect,useMemo,useRef,useState,type ReactNode,type RefObject} from 'react';
import * as T from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {bankGroundHeight,bankFrame,bankOverviewCamera,circuitOverviewCamera,footprintPlacement,localModelPosition,modelPosition,type CircuitModel,type ModelBank,type ModelPosition} from './circuitSeating';
export type ModelCameraControls={zoomIn:()=>void;zoomOut:()=>void;resetZoom:()=>void};
type Mode='circuit'|'stand'|'seat';
type Props={onZoomLimitsChange:(inward:boolean,outward:boolean)=>void;cameraControls:RefObject<ModelCameraControls|null>;model:CircuitModel;selection:ModelPosition;mode:Mode;playing:boolean;speed:number;pass:number;following:boolean;onManualLook:()=>void;roofs:boolean;reset:number;onSelect:(p:ModelPosition)=>void;onUnavailable:()=>void;onReady:()=>void};
function Instances({items,color,geometry,onClick,surface='coated'}:{surface?:'concrete'|'coated';items:{p:number[];s:number[];r?:number[]}[];color:string;geometry?:T.BufferGeometry;onClick?:(index:number)=>void}){
 const ref=useRef<T.InstancedMesh>(null),{invalidate}=useThree();
 // Switching the active bank replaces its mesh geometry. Restore instance transforms
 // on that replacement before rendering, even when the positions have not changed.
 useLayoutEffect(()=>{const o=new T.Object3D();items.forEach((v,i)=>{o.position.set(v.p[0],v.p[1],v.p[2]);o.scale.set(v.s[0],v.s[1],v.s[2]);o.rotation.set(...((v.r??[0,0,0]) as [number,number,number]));o.updateMatrix();ref.current?.setMatrixAt(i,o.matrix);});if(ref.current){ref.current.instanceMatrix.needsUpdate=true;ref.current.computeBoundingSphere();}invalidate();},[items,geometry,invalidate]);
 return <instancedMesh ref={ref} args={[geometry,undefined,items.length]} castShadow receiveShadow onClick={e=>{if(onClick&&e.instanceId!==undefined){e.stopPropagation();onClick(e.instanceId);}}}>{!geometry&&<boxGeometry/>}<SurfaceMaterial surface={surface} color={color} metalness={.32} roughness={.46} strength={.45}/></instancedMesh>;
}
function Bank({bank,model,selection,onSelect,roofs}:{bank:ModelBank;model:CircuitModel;selection:ModelPosition;onSelect:Props['onSelect'];roofs:boolean}){
 const rounded=useMemo(()=>new RoundedBoxGeometry(1,1,1,2,.12),[]);
 useEffect(()=>()=>rounded.dispose(),[rounded]);
 const active=selection.bank===bank.id,frame=useMemo(()=>bankFrame(model,bank),[model,bank]);
 const positions=useMemo(()=>Array.from({length:bank.sections*bank.rows*bank.seats},(_,i)=>({bank:bank.id,section:Math.floor(i/(bank.rows*bank.seats))+1,row:Math.floor(i/bank.seats)%bank.rows+1,seat:i%bank.seats+1})),[bank]);
 const chairs=useMemo(()=>positions.map(p=>{const v=localModelPosition(bank,p);return {p:[v[0],v[1]+.28,v[2]],s:[.48,.13,.48]};}),[positions,bank]);
 const backs=useMemo(()=>positions.map(p=>{const v=localModelPosition(bank,p);return {p:[v[0],v[1]+.55,v[2]-.24],s:[.48,.52,.09],r:[-.12,0,0]};}),[positions,bank]);
 const tiers=useMemo(()=>Array.from({length:bank.rows},(_,i)=>({p:[0,(.55+i*.43)/2,(bank.rows/2-i-1)*.88],s:[bank.width+2,.55+i*.43,.9]})),[bank]);
 const supports=useMemo(()=>Array.from({length:Math.ceil(bank.width/14)+1},(_,i)=>({p:[-bank.width/2+i*bank.width/Math.ceil(bank.width/14),bank.rows*.43/2,-bank.rows*.44],s:[.22,bank.rows*.43,.22]})),[bank]);
 const pitch=bank.width/(bank.sections*bank.seats+(bank.sections-1)*3),picked=localModelPosition(bank,selection);
 return <group position={[bank.center[0],bankGroundHeight(model,bank),bank.center[1]]} rotation={[0,frame.yaw,0]}>
  {bank.kind==='lawn'?<mesh position={[0,1.7,0]} scale={[bank.width/2,3.2,22]}><sphereGeometry args={[1,32,12]}/><meshStandardMaterial color="#777348" roughness={1}/></mesh>:<>
   <Instances items={tiers} color="#646a73" surface="concrete"/>
   <Instances items={supports} color="#b5bbc4"/>
   <Instances geometry={active?rounded:undefined} items={chairs} color={model.id==='qatar'?'#783b4d':model.id==='miami'?'#356d73':'#3d647c'} onClick={i=>onSelect(positions[i])}/>
   <Instances geometry={active?rounded:undefined} items={backs} color={model.id==='qatar'?'#8a4056':model.id==='miami'?'#447f86':'#4c7895'} onClick={i=>onSelect(positions[i])}/>
   {Array.from({length:bank.sections-1},(_,i)=><group key={i} position={[-bank.width/2+(i+1)*(bank.seats+3)*pitch-1.5*pitch,0,0]}>
    <mesh position={[0,.58+bank.rows*.215,0]} rotation={[Math.atan2(.43,.88),0,0]}><boxGeometry args={[1.5,.15,bank.rows*.98]}/><meshStandardMaterial color="#b1b6c0"/></mesh>
   </group>)}
   <mesh position={[0,bank.rows*.43+.45,-bank.rows*.44-.7]}><boxGeometry args={[bank.width+3,1.1,.12]}/><meshStandardMaterial color="#9fa6b3" wireframe/></mesh>
   {bank.roof&&roofs&&!(model.id==='china'&&bank.id==='a')&&<>
    <mesh position={[0,bank.rows*.43+5,-1]} rotation={[-.04,0,0]} castShadow><boxGeometry args={[bank.width+9,.4,bank.rows*.88+8]}/><meshStandardMaterial color="#d8dadd" metalness={.45} roughness={.4}/></mesh>
    {[-1,1].map(s=><mesh key={s} position={[s*(bank.width/2+2),(bank.rows*.43+5)/2,-bank.rows*.44]}><cylinderGeometry args={[.25,.35,bank.rows*.43+5,8]}/><meshStandardMaterial color="#b9c0ca" metalness={.6} roughness={.3}/></mesh>)}
   </>}
  </>}
  {active&&<group position={picked}>
   <mesh position={[0,.34,0]}><boxGeometry args={[bank.kind==='lawn'?1.2:.53,.18,bank.kind==='lawn'?1.2:.54]}/><meshBasicMaterial color="#ffcb69"/></mesh>
   <mesh position={[0,1.7,0]}><cylinderGeometry args={[.06,.06,2.3,8]}/><meshBasicMaterial color="#ffcc72" transparent opacity={.8}/></mesh>
  </group>}
 </group>;
}
function ribbon(track:number[][],width:number,height:number,heights?:number[],sample?:(x:number,z:number)=>number){
 const vertices:number[]=[],uv:number[]=[],indices:number[]=[],columns=sample?11:2;let distance=0;
 track.forEach((p,i)=>{const a=track[Math.max(0,i-1)],b=track[Math.min(track.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1;if(i)distance+=Math.hypot(p[0]-track[i-1][0],p[1]-track[i-1][1]);
  for(let col=0;col<columns;col++){const side=-1+2*col/(columns-1),x=p[0]-dz/l*width/2*side,z=p[1]+dx/l*width/2*side;vertices.push(x,height+(sample?sample(x,z):heights?.[i]??0),z);uv.push(col/(columns-1),distance/10);}
  if(i<track.length-1)for(let col=0;col<columns-1;col++){const j=i*columns+col;indices.push(j,j+1,j+columns,j+1,j+columns+1,j+columns);}
 });const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
function Track({model}:{model:CircuitModel}){
 const maps=useLoader(T.TextureLoader,['/materials/asphalt-color.jpg','/materials/asphalt-normal.jpg','/materials/asphalt-roughness.jpg']);
 const textures=useMemo(()=>maps.map((source,i)=>{const t=source.clone();t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(2,1);if(!i)t.colorSpace=T.SRGBColorSpace;return t;}),[maps]);
 const terrainGrass=useMemo(()=>model.terrain?createGrassTexture(2,1):null,[model]);
 useEffect(()=>()=>terrainGrass?.dispose(),[terrainGrass]);
 const road=useMemo(()=>ribbon(model.track,14,.07,model.trackHeights),[model]),runoff=useMemo(()=>ribbon(model.track,model.terrain?52:30,model.terrain?-1:.025,model.trackHeights,model.terrain?(x,z)=>roadSample(model,x,z).height:undefined),[model]);
 const curve=useMemo(()=>new T.CatmullRomCurve3(model.track.slice(0,-1).map((p,i)=>new T.Vector3(p[0],model.trackHeights?.[i]??0,p[1])),true,'centripetal'),[model]);
 const curbs=useMemo(()=>{const out:{p:number[];s:number[];r:number[]}[][]=[[],[]];const samples=curve.getSpacedPoints(Math.round(model.length/4));samples.forEach((p,i)=>{const tangent=curve.getTangentAt(i/(samples.length-1)),yaw=Math.atan2(tangent.x,tangent.z);for(const side of [-1,1])out[i%2].push({p:[p.x-tangent.z*7.7*side,(model.terrain?roadSample(model,p.x,p.z).height:p.y)+.13,p.z+tangent.x*7.7*side],s:[1.1,.18,4.1],r:[0,yaw,0]});});return out;},[curve,model]);
 useEffect(()=>()=>{road.dispose();runoff.dispose();textures.forEach(t=>t.dispose());},[road,runoff,textures]);
 return <><mesh geometry={runoff} receiveShadow><meshStandardMaterial map={terrainGrass} color={terrainGrass?'#ffffff':model.appearance==='day'?'#6d8976':model.id==='qatar'?'#355b69':model.id==='united-arab-emirates'?'#347c8c':'#967456'} roughness={.95}/></mesh><mesh geometry={road} receiveShadow><SurfaceMaterial surface="asphalt" grainScale={.7} strength={.4} map={textures[0]} normalMap={textures[1]} roughnessMap={textures[2]} normalScale={new T.Vector2(.35,.35)} color="#acb1ba" roughness={.78}/></mesh><Instances items={curbs[0]} color="#dc2529"/><Instances items={curbs[1]} color="#e9e8e5"/></>;
}
function Context({model,selection,roofs}:{model:CircuitModel;selection:ModelPosition;roofs:boolean}){
 const bank=model.banks.find(b=>b.id===selection.bank)!,frame=bankFrame(model,bank);
 const poles=useMemo(()=>{const c=new T.CatmullRomCurve3(model.track.slice(0,-1).map((p,i)=>new T.Vector3(p[0],model.trackHeights?.[i]??0,p[1])),true);return c.getSpacedPoints(Math.round(model.length/75)).map((p,i,a)=>{const d=c.getTangentAt(i/(a.length-1));return [p.x-d.z*20,p.z+d.x*20];});},[model]);
 const tower=model.features.find(f=>f.name==='Sakhir Tower'),towerCenter=tower?footprintPlacement(tower.points).center:undefined;
 const main=model.banks.find(b=>b.id===model.pitBank)??model.banks[0],mf=bankFrame(model,main),pit=[mf.target[0]+mf.forward[0]*28,mf.target[1]+mf.forward[1]*28];
 return <>
  {model.appearance!=='day'&&<mesh position={[0,-1,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[20000,20000]}/><meshStandardMaterial color={model.appearance==='day'?'#70905d':model.id==='qatar'?'#29282b':model.id==='united-arab-emirates'?'#25343b':'#493e36'} roughness={1}/></mesh>}
  {model.appearance!=='day'&&poles.map((p,i)=><group key={i} position={[p[0],0,p[1]]}><mesh position={[0,12,0]}><cylinderGeometry args={[.17,.33,24,6]}/><meshStandardMaterial color="#7c8796" metalness={.6}/></mesh><mesh position={[0,24,0]} rotation={[-.2,0,0]}><boxGeometry args={[4,.45,1.1]}/><meshBasicMaterial color={new T.Color(2.2,2.4,3)} toneMapped={false}/></mesh></group>)}
  {model.appearance!=='day'&&<pointLight position={[bank.center[0]+frame.forward[0]*20,30,bank.center[1]+frame.forward[1]*20]} intensity={12500} distance={220} decay={2} color="#d5e5ff"/>}
  {model.id==='great-britain'?<SilverstoneWing model={model}/>:<group position={[pit[0],groundHeight(model,pit[0],pit[1]),pit[1]]} rotation={[0,mf.yaw,0]}>
   <mesh position={[0,5,0]} castShadow><boxGeometry args={[model.id==='qatar'?310:285,10,16]}/><meshStandardMaterial color="#737d8a" metalness={.35} roughness={.6}/></mesh>
   <mesh position={[0,11,0]} castShadow><boxGeometry args={[model.id==='qatar'?320:295,.6,24]}/><meshStandardMaterial color="#c6cbd4"/></mesh>
   {Array.from({length:22},(_,i)=><group key={i} position={[-132+i*12.5,0,-8.1]}><mesh position={[0,2.5,0]}><boxGeometry args={[10,5,.15]}/><meshStandardMaterial color="#222a38"/></mesh><mesh position={[0,7.8,-.05]}><boxGeometry args={[10,2,.2]}/><meshPhysicalMaterial color="#37546b" metalness={.7} roughness={.15} clearcoat={1}/></mesh><mesh position={[0,5.4,-.1]}><boxGeometry args={[10,.4,.2]}/><meshBasicMaterial color={i%3===0?'#d02d36':'#bfc7d6'}/></mesh></group>)}
  </group>}
  {model.id==='china'&&roofs&&<ShanghaiCanopy model={model}/>}
  {model.id==='miami'&&<HardRockStadium model={model}/>}
  {model.id==='bahrain'&&towerCenter&&<group position={[towerCenter[0],0,towerCenter[1]]}>
   {Array.from({length:8},(_,i)=><group key={i} position={[0,5+i*3.2,0]}><mesh castShadow><cylinderGeometry args={[14+i*.8,14+i*.8,2.6,48]}/><meshStandardMaterial color="#243346" metalness={.7} roughness={.22}/></mesh><mesh position={[0,1.5,0]} castShadow><cylinderGeometry args={[16+i*.8,16+i*.8,.4,48]}/><meshStandardMaterial color="#d9d8d3" roughness={.45}/></mesh></group>)}
  </group>}
  <mesh position={[bank.center[0]+frame.forward[0]*10,bankGroundHeight(model,bank)+.5,bank.center[1]+frame.forward[1]*10]} rotation={[0,frame.yaw,0]}><boxGeometry args={[bank.width+12,1,.5]}/><meshStandardMaterial color="#c3cad2"/></mesh>
 </>;
}
function DemoCars({model,playing,selection,speed,pass,lead}:{model:CircuitModel;playing:boolean;selection:ModelPosition;speed:number;pass:number;lead:RefObject<T.Vector3>}){
 const refs=useRef<(T.Group|null)[]>([]),wheels=useRef<(T.Group|null)[]>([]),progress=useRef(0);const {invalidate,gl}=useThree();
 useEffect(()=>{gl.domElement.dataset.carsPlaying=String(playing);gl.domElement.dataset.carDetail='formula';gl.domElement.dataset.replaySpeed=String(speed);invalidate();},[playing,speed,gl,invalidate]);
 const curve=useMemo(()=>new T.CatmullRomCurve3(model.track.slice(0,-1).map((p,i)=>new T.Vector3(p[0],model.trackHeights?.[i]??0,p[1])),true,'centripetal'),[model]);
 useEffect(()=>{const b=model.banks.find(b=>b.id===selection.bank)!,samples=curve.getSpacedPoints(1500);let best=Infinity,index=0;samples.forEach((p,i)=>{const d=Math.hypot(p.x-b.center[0],p.z-b.center[1]);if(d<best){best=d;index=i;}});progress.current=(index/(samples.length-1)-8/105+1)%1;invalidate();},[model,selection.bank,pass,curve,invalidate]);
 useFrame((_,delta)=>{if(playing)progress.current=(progress.current+Math.min(delta,.05)*speed/105)%1;refs.current.forEach((r,i)=>{if(!r)return;const u=(progress.current-i*.008+1)%1,p=curve.getPointAt(u),t=curve.getTangentAt(u);r.position.set(p.x,(model.terrain?roadSample(model,p.x,p.z).height:p.y)+.45,p.z);if(i===0)lead.current.copy(r.position);r.rotation.set(-Math.atan2(t.y,Math.hypot(t.x,t.z)),Math.atan2(t.x,t.z),0,'YXZ');if(playing)wheels.current[i]?.children.forEach(w=>w.rotation.x-=Math.min(delta,.05)*speed*model.length/105/.36);});if(playing)invalidate();});
 return <>{['#eb3433','#24b9ad','#fc9d34','#668cd9','#f1f3f8'].map((c,i)=><group key={c} ref={r=>{refs.current[i]=r;}}><FormulaCar color={c} wheels={r=>{wheels.current[i]=r;}}/></group>)}</>;
}
function Rig({model,selection,mode,reset,cameraControls,onZoomLimitsChange,following,onManualLook,lead}:Props&{lead:RefObject<T.Vector3>}){
 const {camera,gl,invalidate,size,scene}=useThree(),control=useRef<OrbitControls|null>(null),tr=useRef<{p:T.Vector3;t:T.Vector3;elapsed:number;from:T.Vector3;fromT:T.Vector3}|null>(null),target=useRef(new T.Vector3());
 useEffect(()=>{const c=new OrbitControls(camera,gl.domElement);c.enablePan=false;c.minDistance=12;c.maxDistance=3000;c.maxPolarAngle=Math.PI*.495;control.current=c;const change=()=>invalidate(),start=()=>{tr.current=null;gl.domElement.dataset.modelReady='true';};c.addEventListener('change',change);c.addEventListener('start',start);return()=>{c.dispose();control.current=null;};},[camera,gl,invalidate]);
 useEffect(()=>{const bank=model.banks.find(b=>b.id===selection.bank)!,p=modelPosition(model,selection),f=bankFrame(model,bank);let position:T.Vector3,look:T.Vector3;
  if(mode==='seat'){position=new T.Vector3(p[0],p[1]+1.15,p[2]);look=new T.Vector3(p[0]+f.forward[0]*90,1.6+roadSample(model,p[0]+f.forward[0]*90,p[2]+f.forward[1]*90).height,p[2]+f.forward[1]*90);}
  else if(mode==='stand'){const top=Math.min(size.height*.5,size.width<760?250:220),fraction=Math.max(.2,1-(top+110)/size.height)*.95,view=bankOverviewCamera(model,bank,size.width/size.height,fraction);position=new T.Vector3(...view.eye);look=new T.Vector3(...view.target);}
  else {const top=Math.min(size.height*.35,size.width<760?250:220),bottom=110,fraction=Math.max(.2,1-(top+bottom)/size.height)*.95,overview=circuitOverviewCamera(model,size.width/size.height,fraction);position=new T.Vector3(...overview.eye);look=new T.Vector3(...overview.target);}
  if(scene.fog instanceof T.Fog){const d=position.distanceTo(look);scene.fog.near=mode==='circuit'?d+1000:1000;scene.fog.far=mode==='circuit'?d+3000:4500;}
  (camera as T.PerspectiveCamera).near=mode==='circuit'?10:mode==='stand'?.5:.15;
  (camera as T.PerspectiveCamera).far=mode==='circuit'?Math.max(6500,position.distanceTo(look)+4000):6500;
  const c=control.current;if(c){c.enabled=true;c.minDistance=mode==='seat'?.1:12;c.maxDistance=mode==='circuit'?Math.max(3000,position.distanceTo(look)*1.4):3000;c.enableZoom=mode!=='seat';}
  (camera as T.PerspectiveCamera).clearViewOffset();
  if(mode!=='seat'){const top=Math.min(size.height*(mode==='stand'?.5:.35),size.width<760?250:220);(camera as T.PerspectiveCamera).setViewOffset(size.width,size.height,0,(110-top)/2,size.width,size.height);}
  (camera as T.PerspectiveCamera).fov=mode==='seat'?(size.width<size.height?90:70):45;(camera as T.PerspectiveCamera).updateProjectionMatrix();gl.domElement.dataset.seatFov=String((camera as T.PerspectiveCamera).fov);onZoomLimitsChange((camera as T.PerspectiveCamera).fov>35,(camera as T.PerspectiveCamera).fov<105);
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){camera.position.copy(position);target.current.copy(look);camera.lookAt(look);c?.target.copy(look);tr.current=null;gl.domElement.dataset.modelReady='true';}
  else{tr.current={p:position,t:look,from:camera.position.clone(),fromT:target.current.clone(),elapsed:0};gl.domElement.dataset.modelReady='moving';}
  invalidate();
 },[model,selection.bank,selection.section,selection.row,selection.seat,mode,reset,size.width,size.height,camera,gl,invalidate,scene,onZoomLimitsChange]);
 // An OS preference change must also finish a transition already in progress.
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduce=()=>{const t=tr.current;if(!preference.matches||!t)return;camera.position.copy(t.p);target.current.copy(t.t);camera.lookAt(target.current);control.current?.target.copy(target.current);tr.current=null;gl.domElement.dataset.modelReady='true';invalidate();};
  preference.addEventListener('change',reduce);return()=>preference.removeEventListener('change',reduce);
 },[camera,gl,invalidate]);
 // Zoom updates the lens only, preserving the selected eye position and look direction.
 useEffect(()=>{
  if(mode!=='seat'){cameraControls.current=null;return;}
  const lens=camera as T.PerspectiveCamera,apply=(degrees:number)=>{lens.fov=T.MathUtils.clamp(degrees,35,105);lens.updateProjectionMatrix();gl.domElement.dataset.seatFov=String(lens.fov);onZoomLimitsChange(lens.fov>35,lens.fov<105);invalidate();};
  cameraControls.current={zoomIn:()=>apply(lens.fov-10),zoomOut:()=>apply(lens.fov+10),resetZoom:()=>apply(size.width<size.height?90:70)};
  return()=>{cameraControls.current=null;};
 },[mode,camera,gl,invalidate,size.width,size.height,cameraControls,onZoomLimitsChange]);
 // In seated mode orbit around the eye position, never move the camera through the stands.
 useEffect(()=>{if(mode!=='seat')return;const c=control.current;if(c)c.enabled=false;const el=gl.domElement;let last:{x:number;y:number}|null=null;const p=modelPosition(model,selection),f=bankFrame(model,model.banks.find(b=>b.id===selection.bank)!);let yaw=f.yaw,pitch=Math.atan2(1.6+roadSample(model,p[0]+f.forward[0]*90,p[2]+f.forward[1]*90).height-p[1]-1.15,90);
  const down=(e:PointerEvent)=>{onManualLook();const direction=camera.getWorldDirection(new T.Vector3());yaw=Math.atan2(direction.x,direction.z);pitch=Math.asin(T.MathUtils.clamp(direction.y,-1,1));last={x:e.clientX,y:e.clientY};el.setPointerCapture(e.pointerId);tr.current=null;gl.domElement.dataset.modelReady='true';};const move=(e:PointerEvent)=>{if(!last)return;yaw-=(e.clientX-last.x)*.003;pitch=T.MathUtils.clamp(pitch+(e.clientY-last.y)*.003,-1.1,.7);last={x:e.clientX,y:e.clientY};target.current.set(...seatedLookTarget(camera.position,yaw,pitch));camera.lookAt(target.current);invalidate();};const up=()=>{last=null;};const wheel=(e:WheelEvent)=>{e.preventDefault();const c=camera as T.PerspectiveCamera;c.fov=T.MathUtils.clamp(c.fov+e.deltaY*.03,35,105);c.updateProjectionMatrix();gl.domElement.dataset.seatFov=String(c.fov);onZoomLimitsChange(c.fov>35,c.fov<105);invalidate();};el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('wheel',wheel,{passive:false});return()=>{el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);el.removeEventListener('wheel',wheel);};
 },[mode,selection.bank,selection.section,selection.row,selection.seat,reset,model,camera,gl,invalidate,onZoomLimitsChange,onManualLook]);
 useFrame((_,delta)=>{const t=tr.current;if(!t){if(following&&mode==='seat'){target.current.lerp(lead.current,1-Math.exp(-delta*5));camera.lookAt(target.current);invalidate();}return;}t.elapsed+=Math.min(delta,.05);const f=Math.min(1,t.elapsed/.8),e=1-(1-f)**3;camera.position.lerpVectors(t.from,t.p,e);target.current.lerpVectors(t.fromT,t.t,e);camera.lookAt(target.current);control.current?.target.copy(target.current);if(f===1){tr.current=null;gl.domElement.dataset.modelReady='true';}invalidate();});
 return null;
}
function Lighting({model,selection}:{model:CircuitModel;selection:ModelPosition}){const {gl,scene}=useThree(),p=modelPosition(model,selection);useEffect(()=>{const pmrem=new T.PMREMGenerator(gl),room=new RoomEnvironment(),map=pmrem.fromScene(room,.05);scene.environment=map.texture;scene.environmentIntensity=.3;return()=>{scene.environment=null;map.dispose();room.dispose();pmrem.dispose();};},[gl,scene]);const target=useMemo(()=>new T.Object3D(),[]);target.position.set(p[0],model.terrain?p[1]:0,p[2]);target.updateMatrixWorld();return <><primitive object={target}/><ambientLight intensity={model.appearance==='day'?.45:.18}/><hemisphereLight args={model.appearance==='day'?['#deedff','#687c4c',1.2]:['#c9d9f5','#554439',.55]}/><directionalLight target={target} position={[p[0]-60,(model.terrain?p[1]:0)+130,p[2]+50]} intensity={model.appearance==='day'?2.4:2.1} color={model.appearance==='day'?'#fff4de':'#deeaff'} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-250} shadow-camera-right={250} shadow-camera-top={250} shadow-camera-bottom={-250} shadow-camera-far={350} shadow-bias={-.00015}/></>;}
function TrackFence({model}:{model:CircuitModel}){
 const geometry=useMemo(()=>{const c=new T.CatmullRomCurve3(model.track.slice(0,-1).map((p,i)=>new T.Vector3(p[0],model.trackHeights?.[i]??0,p[1])),true,'centripetal'),samples=c.getSpacedPoints(Math.round(model.length/8)),vertices:number[]=[];for(const side of [-1,1]){let previous:T.Vector3|undefined;samples.forEach((p,i)=>{const t=c.getTangentAt(i/(samples.length-1)),q=new T.Vector3(p.x-t.z*12*side,(model.terrain?roadSample(model,p.x,p.z).height:p.y)+.4,p.z+t.x*12*side);vertices.push(q.x,q.y,q.z,q.x,q.y+3,q.z);if(previous)for(const y of [.8,1.7,2.6,3.4])vertices.push(previous.x,previous.y+y-.4,previous.z,q.x,q.y+y-.4,q.z);previous=q;});}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));return g;},[model]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);return <lineSegments geometry={geometry}><lineBasicMaterial color="#7e8b9e" transparent opacity={.65}/></lineSegments>;
}
function Finish(){const {gl,scene,camera,size}=useThree();const composer=useMemo(()=>{const c=new EffectComposer(gl);c.addPass(new RenderPass(scene,camera));c.addPass(new UnrealBloomPass(new T.Vector2(size.width,size.height),.18,.35,1.3));c.addPass(new OutputPass());return c;},[gl,scene,camera]);useEffect(()=>{composer.setSize(size.width,size.height);},[composer,size]);useEffect(()=>()=>composer.dispose(),[composer]);useFrame((_,delta)=>composer.render(delta),1);return null;}
function Watch({onUnavailable,onReady}:{onUnavailable:Props['onUnavailable'];onReady:()=>void}){const {gl}=useThree();const done=useRef(false);useFrame(()=>{if(!done.current){done.current=true;gl.domElement.dataset.geometryReady='true';onReady();}});useEffect(()=>{const loss=(e:Event)=>{e.preventDefault();onUnavailable();};gl.domElement.addEventListener('webglcontextlost',loss);return()=>gl.domElement.removeEventListener('webglcontextlost',loss);},[gl,onUnavailable]);return null;}
class Boundary extends Component<{children:ReactNode;onUnavailable:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(){this.props.onUnavailable();}render(){return this.state.failed?null:this.props.children;}}
export default function CircuitSeatingScene(props:Props){const lead=useRef(new T.Vector3());return <Boundary onUnavailable={props.onUnavailable}><Canvas frameloop="demand" shadows dpr={[1,1.5]} camera={{position:[900,1500,1350],near:.15,far:6500,fov:45}} gl={{antialias:true,powerPreference:'high-performance'}}><ShaderGuard onUnavailable={props.onUnavailable}/><color attach="background" args={[props.model.appearance==='day'?'#bfd7e7':'#111b2c']}/><fog attach="fog" args={[props.model.appearance==='day'?'#d4e2df':'#263146',1000,4500]}/><Suspense fallback={null}><Lighting {...props}/><Context {...props}/>{props.model.appearance==='day'&&<CircuitPark model={props.model}/>}<Track model={props.model}/><TrackFence model={props.model}/>{props.model.banks.map(bank=><Bank key={bank.id} bank={bank} model={props.model} selection={props.selection} onSelect={props.onSelect} roofs={props.roofs}/>)}<DemoCars model={props.model} playing={props.playing} selection={props.selection} speed={props.speed} pass={props.pass} lead={lead}/><Watch onUnavailable={props.onUnavailable} onReady={props.onReady}/></Suspense><Rig {...props} lead={lead}/><Finish/></Canvas></Boundary>;}
