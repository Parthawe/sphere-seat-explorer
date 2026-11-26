import {useLayoutEffect, useMemo, type RefObject} from 'react';
import {useFrame, useThree, type ThreeElements} from '@react-three/fiber';
import * as T from 'three';

type StandardProps=Omit<ThreeElements['meshStandardMaterial'],'onBeforeCompile'|'customProgramCacheKey'>;
type Shader=Parameters<T.MeshStandardMaterial['onBeforeCompile']>[0];
type Surface='asphalt'|'concrete'|'coated';
export function ShaderGuard({onUnavailable}:{onUnavailable:()=>void}) {
  const {gl}=useThree();
  useLayoutEffect(()=>{
    const previous=gl.debug.onShaderError;
    const failed:NonNullable<typeof previous>=(context,program,vertex,fragment)=>{
      previous?.(context,program,vertex,fragment);
      onUnavailable();
    };
    gl.debug.onShaderError=failed;
    return()=>{if(gl.debug.onShaderError===failed)gl.debug.onShaderError=previous;};
  },[gl,onUnavailable]);
  return null;
}
const surfaceIds:Record<Surface,number>={asphalt:0,concrete:1,coated:2};
const noiseGLSL=`
float atlasHash(vec2 p) {
  vec3 p3=fract(vec3(p.xyx)*.1031);
  p3+=dot(p3,p3.yzx+33.33);
  return fract((p3.x+p3.y)*p3.z);
}
float atlasNoise(vec2 p) {
  vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(atlasHash(i),atlasHash(i+vec2(1.,0.)),f.x),
    mix(atlasHash(i+vec2(0.,1.)),atlasHash(i+vec2(1.,1.)),f.x),f.y);
}
vec2 atlasGrain(vec3 world) {
  vec2 p=(world.xz+world.y*vec2(.73,1.21))*uAtlasScale;
  float coarse=atlasNoise(p*.65);
  vec2 fine=p*38.;
  float footprint=max(length(dFdx(fine)),length(dFdy(fine)));
  float filtered=mix(atlasHash(floor(fine)),.5,smoothstep(.3,1.3,footprint));
  return vec2(coarse,filtered);
}`;

/** Procedural surface detail layered into Three's existing PBR/shadow pipeline.
 * World coordinates include instance transforms, so instanced seats retain detail.
 * No textures, additional draw calls, time uniforms or continuous render loop. */
export function SurfaceMaterial({surface,grainScale=1,strength=.65,...props}:StandardProps&{
  surface:Surface;grainScale?:number;strength?:number;
}) {
  const {gl}=useThree();
  const compile=useMemo(()=>(shader:Shader)=>{
    shader.uniforms.uAtlasScale={value:grainScale};
    shader.uniforms.uAtlasStrength={value:strength};
    shader.uniforms.uAtlasKind={value:surfaceIds[surface]};
    shader.vertexShader=`varying vec3 vAtlasWorld;\n${shader.vertexShader}`.replace(
      '#include <begin_vertex>',`#include <begin_vertex>
      vec4 atlasPosition=vec4(transformed,1.);
      #ifdef USE_INSTANCING
        atlasPosition=instanceMatrix*atlasPosition;
      #endif
      vAtlasWorld=(modelMatrix*atlasPosition).xyz;`);
    shader.fragmentShader=`uniform float uAtlasScale,uAtlasStrength,uAtlasKind;
      varying vec3 vAtlasWorld;\n${noiseGLSL}\n${shader.fragmentShader}`
      .replace('#include <color_fragment>',`#include <color_fragment>
        vec2 atlasDetail=atlasGrain(vAtlasWorld);
        float atlasVariation=mix(.94,1.06,atlasDetail.x)*mix(.88,1.10,atlasDetail.y);
        float atlasDose=uAtlasStrength*(uAtlasKind>1.5?.22:1.);
        diffuseColor.rgb*=mix(1.,atlasVariation,atlasDose);`)
      .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
        roughnessFactor=clamp(roughnessFactor+(atlasDetail.y-.5)*.22*uAtlasStrength,.08,1.);`)
      .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
        vec3 atlasDX=dFdx(-vViewPosition),atlasDY=dFdy(-vViewPosition);
        vec3 atlasRX=cross(atlasDY,normal),atlasRY=cross(normal,atlasDX);
        float atlasDet=dot(atlasDX,atlasRX);
        float atlasHeight=(atlasDetail.x*.008+atlasDetail.y*.0015)*atlasDose;
        vec3 atlasGradient=sign(atlasDet)*(dFdx(atlasHeight)*atlasRX+dFdy(atlasHeight)*atlasRY);
        normal=normalize(max(abs(atlasDet),.000001)*normal-atlasGradient);`);
    gl.domElement.dataset.surfaceShaders='ready';
  },[surface,grainScale,strength,gl]);
  return <meshStandardMaterial {...props} onBeforeCompile={compile} customProgramCacheKey={()=>'atlas-surface-v1'}/>;
}

/** Circuit accent follows normalized path length, driven only by Play marker. */
export function CircuitTraceMaterial({phase,playing}:{phase:RefObject<number>;playing:boolean}) {
  const uniforms=useMemo(()=>({uTracePhase:{value:0},uTracePlaying:{value:0}}),[]);
  const compile=useMemo(()=>(shader:Shader)=>{
    Object.assign(shader.uniforms,uniforms);
    shader.vertexShader=`varying vec2 vTraceUv;\n${shader.vertexShader}`.replace(
      '#include <begin_vertex>','#include <begin_vertex>\nvTraceUv=uv;');
    shader.fragmentShader=`varying vec2 vTraceUv;uniform float uTracePhase,uTracePlaying;\n${shader.fragmentShader}`
      .replace('#include <color_fragment>',`#include <color_fragment>
        float traceEdge=smoothstep(.65,.94,abs(vTraceUv.y));
        float traceDistance=abs(vTraceUv.x-uTracePhase);
        traceDistance=min(traceDistance,1.-traceDistance);
        float tracePulse=exp(-pow(traceDistance/.035,2.))*uTracePlaying;
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.76,.015,.008),traceEdge*.9);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(1.,.32,.22),tracePulse*.7);`)
      .replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
        totalEmissiveRadiance+=vec3(.7,.008,.003)*traceEdge*.35+vec3(1.,.09,.025)*tracePulse*1.4;`);
  },[uniforms]);
  useFrame(()=>{uniforms.uTracePhase.value=phase.current;uniforms.uTracePlaying.value=playing?1:0;});
  return <meshStandardMaterial color="#c8c6c4" metalness={.55} roughness={.32} side={T.DoubleSide}
    onBeforeCompile={compile} customProgramCacheKey={()=>'atlas-trace-v1'}/>;
}

export function StudioBackdrop(){
  return <mesh renderOrder={-100} scale={250}>
    <sphereGeometry args={[1,24,16]}/>
    <shaderMaterial side={T.BackSide} depthWrite={false} toneMapped={false}
      vertexShader={`varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
      fragmentShader={`varying vec3 vDirection;void main(){vec3 d=normalize(vDirection);
        vec3 sky=mix(vec3(.038,.038,.048),vec3(.12,.12,.14),smoothstep(-.12,.8,d.y));
        float key=pow(max(dot(d,normalize(vec3(-.5,.6,.4))),0.),12.);
        gl_FragColor=vec4(sky+vec3(.07,.06,.045)*key,1.);
        #include <colorspace_fragment>
      }`}/>
  </mesh>;
}
