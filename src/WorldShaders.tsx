import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as T from 'three';

/** Static, camera-relative atmosphere. No time uniform or animation loop. */
export function WorldSky({day=false}:{day?:boolean}){
 const uniforms=useMemo(()=>({zenith:{value:new T.Color(day?'#739fc5':'#070c19')},horizon:{value:new T.Color(day?'#d9e1df':'#263246')},glow:{value:new T.Color(day?'#fff2dc':'#72523c')},daylight:{value:day?1:0}}),[day]);
 return <mesh frustumCulled={false} renderOrder={-1000}>
  <sphereGeometry args={[1,24,16]}/>
  <shaderMaterial uniforms={uniforms} side={T.BackSide} depthWrite={false} toneMapped={false}
   vertexShader={`varying vec3 skyDirection;void main(){skyDirection=position;vec4 p=projectionMatrix*mat4(mat3(viewMatrix))*vec4(position,1.);gl_Position=p.xyww;}`}
   fragmentShader={`uniform vec3 zenith,horizon,glow;uniform float daylight;varying vec3 skyDirection;
    void main(){vec3 d=normalize(skyDirection);float altitude=max(d.y,0.);
     vec3 color=mix(horizon,zenith,pow(smoothstep(0.,1.,altitude),.42));
     float forwardGlow=pow(max(dot(d,normalize(vec3(-.6,.12,.7))),0.),mix(10.,20.,daylight));
     color+=glow*forwardGlow*mix(.16,.1,daylight)*exp(-abs(d.y)*4.);
     gl_FragColor=vec4(color,1.);
     #include <colorspace_fragment>
    }`}/>
 </mesh>;
}

type Shader=Parameters<T.MeshStandardMaterial['onBeforeCompile']>[0];
/** Object-space detail stays attached to cars as they move. */
export function VehicleSurface({kind}:{kind:'carbon'|'rubber'}){
 const {gl}=useThree();
 const compile=useMemo(()=>(shader:Shader)=>{
  shader.uniforms.vehicleKind={value:kind==='carbon'?0:1};
  shader.vertexShader=`varying vec3 vehicleLocal,vehicleNormal;\n${shader.vertexShader}`.replace('#include <begin_vertex>','#include <begin_vertex>\nvehicleLocal=position;vehicleNormal=normal;');
  shader.fragmentShader=`varying vec3 vehicleLocal,vehicleNormal;uniform float vehicleKind;\n${shader.fragmentShader}`
   .replace('#include <color_fragment>',`#include <color_fragment>
    vec3 axis=abs(normalize(vehicleNormal));vec2 plane=axis.y>max(axis.x,axis.z)?vehicleLocal.xz:(axis.x>axis.z?vehicleLocal.yz:vehicleLocal.xy);
    vec2 weave=plane*95.;float fade=1.-smoothstep(.4,1.4,max(fwidth(weave.x),fwidth(weave.y)));
    float twill=step(2.,mod(floor(weave.x)+floor(weave.y),4.));
    float thread=mix(sin(weave.x*6.28318),sin(weave.y*6.28318),twill)*fade;
    float scuff=sin(plane.x*183.+sin(plane.y*41.))*sin(plane.y*127.)*fade;
    float detail=mix(thread,scuff,vehicleKind);
    diffuseColor.rgb*=1.+detail*mix(.12,.065,vehicleKind);`)
   .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+detail*.055,.12,.98);');
  gl.domElement.dataset.vehicleShaders='ready';
 },[kind,gl]);
 return <meshStandardMaterial color={kind==='carbon'?'#20242d':'#111217'} metalness={kind==='carbon'?.3:0} roughness={kind==='carbon'?.38:.88} onBeforeCompile={compile} customProgramCacheKey={()=>'vehicle-surface-v1'}/>;
}

/** Small normal ripples on existing water polygons; never moves their boundaries. */
export function WaterSurface({normalMap,playing}:{normalMap:T.Texture;playing:boolean}){
 const {gl}=useThree(),reduced=useRef(matchMedia('(prefers-reduced-motion: reduce)').matches);
 const uniforms=useMemo(()=>({waterPhase:{value:0}}),[]);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'),update=()=>{reduced.current=q.matches;};q.addEventListener('change',update);return()=>q.removeEventListener('change',update);},[]);
 useFrame((_,delta)=>{if(playing&&!reduced.current)uniforms.waterPhase.value+=Math.min(delta,.05);});
 const compile=useMemo(()=>(shader:Shader)=>{
  Object.assign(shader.uniforms,uniforms);
  shader.vertexShader=`varying vec3 waterWorld;\n${shader.vertexShader}`.replace('#include <begin_vertex>','#include <begin_vertex>\nwaterWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
  shader.fragmentShader=`varying vec3 waterWorld;uniform float waterPhase;\n${shader.fragmentShader}`
   .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
    vec2 p=waterWorld.xz;float wave=sin(p.x*.7+p.y*.35+waterPhase*.6)*.018+sin(p.y*1.1-p.x*.22-waterPhase*.42)*.009;
    float farFade=1.-smoothstep(.35,1.8,max(length(dFdx(p)),length(dFdy(p))));
    vec3 dx=dFdx(-vViewPosition),dy=dFdy(-vViewPosition),rx=cross(dy,normal),ry=cross(normal,dx);float det=dot(dx,rx);
    vec3 gradient=sign(det)*(dFdx(wave)*rx+dFdy(wave)*ry)*farFade;
    normal=normalize(max(abs(det),.000001)*normal-gradient);`);
  gl.domElement.dataset.waterShader='ready';
 },[uniforms,gl]);
 return <meshPhysicalMaterial color="#3b7485" roughness={.23} metalness={.05} clearcoat={.85} clearcoatRoughness={.18} normalMap={normalMap} normalScale={new T.Vector2(.12,.12)} onBeforeCompile={compile} customProgramCacheKey={()=>'mapped-water-v1'}/>;
}
