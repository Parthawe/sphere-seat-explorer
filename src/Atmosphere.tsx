import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as T from "three";
import { getStand, type Selection } from "./model";
const poles: [number, number, number][] = [
  [-94, 22, -112],
  [-46, 22, -82],
  [37, 22, -78],
  [115, 22, -55],
  [111, 22, 65],
  [-85, 22, 60],
];
export function LightShaft({
  origin,
  target,
  strength=1,
}: {
  origin: [number, number, number];
  target: [number, number, number];
  strength?:number;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new T.Vector3(...origin),
      b = new T.Vector3(...target);
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new T.Quaternion().setFromUnitVectors(
        new T.Vector3(0, 1, 0),
        a.clone().sub(b).normalize(),
      ),
      length: a.distanceTo(b),
    };
  }, [origin, target]);
  return (
    <mesh position={position} quaternion={quaternion} renderOrder={3}>
      <cylinderGeometry args={[0.25, 8, length, 32, 1, true]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        side={T.DoubleSide}
        blending={T.AdditiveBlending}
        uniforms={{ tint: { value: new T.Color("#b8ceff") }, strength:{value:strength} }}
        vertexShader={`varying vec2 vUv;varying vec3 vWorld;varying vec3 vNormal;void main(){vUv=uv;vWorld=(modelMatrix*vec4(position,1.)).xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);}`}
        fragmentShader={`uniform vec3 tint;uniform float strength;varying vec2 vUv;varying vec3 vWorld;varying vec3 vNormal;void main(){float facing=pow(abs(dot(normalize(vNormal),normalize(cameraPosition-vWorld))),1.6);float falloff=pow(vUv.y,.7);float edge=smoothstep(0.,.13,vUv.y)*(1.-smoothstep(.8,1.,vUv.y));float haze=.88+.12*sin(vWorld.y*.63+sin(vWorld.x*.15+vWorld.z*.13));float softRange=smoothstep(0.,3.,distance(cameraPosition,vWorld));float alpha=facing*mix(.018,.075,falloff)*edge*strength*haze*softRange;gl_FragColor=vec4(tint,alpha);}`}
      />
    </mesh>
  );
}
function Motes({
  selection,
  animate,
}: {
  selection: Selection;
  animate: boolean;
}) {
  const ref = useRef<T.Points>(null),
    time = useRef(0);
  const center = useMemo(
    () => getStand(selection.stand).center,
    [selection.stand],
  );
  const seeds = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        x: Math.sin(i * 73.3) * 34,
        z: Math.cos(i * 17.9) * 25,
        y: 2 + ((i * 7.3) % 20),
        speed: 0.12 + (i % 7) * 0.03,
      })),
    [],
  );
  const positions = useMemo(() => new Float32Array(seeds.length * 3), [seeds]);
  useFrame((_, delta) => {
    if (animate) time.current += Math.min(delta, 0.05);
    const t = time.current;
    for (let i = 0; i < seeds.length; i++) {
      const p = seeds[i];
      positions[i * 3] = center[0] + p.x + Math.sin(t * p.speed + i) * 1.3;
      positions[i * 3 + 1] = p.y + Math.sin(t * 0.45 + i) * 0.6;
      positions[i * 3 + 2] = center[2] + p.z + Math.cos(t * p.speed + i) * 1.5;
    }
    if (ref.current)
      ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={T.AdditiveBlending}
        vertexShader={`varying float alpha;void main(){vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(75./-p.z,1.,2.8);alpha=clamp(1.-(-p.z/75.),0.,1.)*.24;}`}
        fragmentShader={`varying float alpha;void main(){float a=smoothstep(.5,.05,length(gl_PointCoord-.5));gl_FragColor=vec4(.78,.84,1.,a*alpha);}`}
      />
    </points>
  );
}
export function Atmosphere({
  selection,
  animate,
}: {
  selection: Selection;
  animate: boolean;
}) {
  const { invalidate, scene } = useThree();
  const spot = useRef<T.SpotLight>(null);
  const stand = getStand(selection.stand);
  const target = useMemo(() => new T.Object3D(), []);
  useEffect(() => {
    scene.add(target);
    return () => {
      scene.remove(target);
    };
  }, [scene, target]);
  useEffect(() => {
    target.position.set(stand.center[0], 0, stand.center[2] + 35);
    if (spot.current) spot.current.target = target;
    invalidate();
  }, [stand, target, invalidate]);
  return (
    <group>
      {poles.map((p, i) => (
        <LightShaft
          key={i}
          origin={p}
          target={[p[0] + (i % 2 ? -12 : 12), 0, p[2] + 15]}
        />
      ))}
      {stand.zone && (
        <LightShaft
          origin={[stand.center[0] - 25, 26, stand.center[2]]}
          target={[stand.center[0], 0, stand.center[2] + 25]}
        />
      )}
      <spotLight
        ref={spot}
        position={[stand.center[0] - 24, 32, stand.center[2] - 12]}
        color="#dfebff"
        intensity={4200}
        angle={0.72}
        penumbra={0.8}
        distance={155}
        decay={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.06}
      />
      <Motes selection={selection} animate={animate} />
    </group>
  );
}
