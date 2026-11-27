import {VehicleSurface} from './WorldShaders';
import {useEffect,useMemo,type Ref} from 'react';
import * as T from 'three';
// Authored illustrative open-wheel body, shared across geographic scenes.
// No team marks or manufacturer CAD; simulation and replay motion live in their parents.
function Beam({
  a,
  b,
  r = 0.08,
  color = "#89909d",
}: {
  a: [number, number, number];
  b: [number, number, number];
  r?: number;
  color?: string;
}) {
  const d = new T.Vector3(...b).sub(new T.Vector3(...a));
  const q = new T.Quaternion().setFromUnitVectors(
    new T.Vector3(0, 1, 0),
    d.clone().normalize(),
  );
  return (
    <mesh
      position={new T.Vector3(...a)
        .add(new T.Vector3(...b))
        .multiplyScalar(0.5)}
      quaternion={q}
    >
      <cylinderGeometry args={[r, r, d.length(), 5]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
    </mesh>
  );
}
export default function FormulaCar({color,wheels,compact=false}:{color:string;wheels?:Ref<T.Group>;compact?:boolean}){
  const body = useMemo(() => {
    const sections = [
      [-2.2, 0.38, 0.35],
      [-1.5, 0.72, 0.5],
      [-0.45, 0.84, 0.42],
      [0.45, 0.48, 0.38],
      [1.6, 0.18, 0.25],
      [2.6, 0.12, 0.17],
    ];
    const vertices: number[] = [],
      indices: number[] = [];
    sections.forEach(([z, w, h]) =>
      vertices.push(-w, 0.12, z, w, 0.12, z, w, h, z, -w, h, z),
    );
    for (let j = 0; j < sections.length - 1; j++)
      for (let k = 0; k < 4; k++) {
        const a = j * 4 + k,
          b = j * 4 + ((k + 1) % 4),
          c = (j + 1) * 4 + k,
          d = (j + 1) * 4 + ((k + 1) % 4);
        indices.push(a, b, c, b, d, c);
      }
    indices.push(0, 2, 1, 0, 3, 2, 20, 21, 22, 20, 22, 23);
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, []);
  const halo = useMemo(
    () =>
      new T.TubeGeometry(
        new T.CatmullRomCurve3([
          new T.Vector3(-0.4, 0.65, -0.65),
          new T.Vector3(-0.4, 0.9, 0.1),
          new T.Vector3(0, 0.94, 0.6),
          new T.Vector3(0.4, 0.9, 0.1),
          new T.Vector3(0.4, 0.65, -0.65),
        ]),
        20,
        0.04,
        6,
        false,
      ),
    [],
  );
  useEffect(
    () => () => {
      body.dispose();
      halo.dispose();
    },
    [body, halo],
  );
  if(compact)return <group name="formula-car-miniature">
    <mesh geometry={body} castShadow receiveShadow><meshPhysicalMaterial color={color} metalness={.4} roughness={.24} clearcoat={1} clearcoatRoughness={.12}/></mesh>
    <mesh position={[0,.14,2.25]} castShadow><boxGeometry args={[1.95,.1,.5]}/><meshStandardMaterial color="#26262b" metalness={.45} roughness={.3}/></mesh>
    <mesh position={[0,.85,-2.12]} castShadow><boxGeometry args={[1.9,.12,.5]}/><meshStandardMaterial color={color} metalness={.45} roughness={.3}/></mesh>
    <mesh position={[0,.6,-.2]}><sphereGeometry args={[.3,8,6]}/><meshStandardMaterial color="#15151e" roughness={.3}/></mesh>
    <group ref={wheels}>{[-1,1].flatMap(x=>[-1.5,1.5].map(z=><group key={`${x}:${z}`} position={[x*1.02,0,z]}><mesh rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[.36,.36,.42,12]}/><VehicleSurface kind="rubber"/></mesh></group>))}</group>
    <CarContactShadow/>
  </group>;
  return <group name="formula-car-body">
      <mesh geometry={body} castShadow>
        <meshPhysicalMaterial
          color={color}
          metalness={0.4}
          roughness={0.22}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </mesh>
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[1.9, 0.09, 4.8]} />
        <VehicleSurface kind="carbon"/>
      </mesh>
      <mesh position={[0, 0.5, -0.2]} castShadow>
        <sphereGeometry args={[0.33, 16, 10]} />
        <meshStandardMaterial color="#080b11" />
      </mesh>
      <mesh position={[0, 0.7, -0.2]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshStandardMaterial color="#d6dbe5" roughness={0.25} />
      </mesh>
      <mesh geometry={halo} castShadow>
        <meshStandardMaterial
          color="#15191f"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>
      <Beam a={[0, 0.85, 0.55]} b={[0, 0.4, 0.9]} r={0.045} color="#15191f" />
      {[0, 1, 2].map((i) => (
        <mesh
          key={"front-" + i}
          position={[0, 0.11 + i * 0.045, 2.3 - i * 0.14]}
          castShadow
        >
          <boxGeometry args={[1.95, 0.035, 0.26]} />
          <meshPhysicalMaterial
            color={i === 0 ? color : "#20252f"}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.88, -2.12]} castShadow>
        <boxGeometry args={[1.9, 0.09, 0.48]} />
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.24} />
      </mesh>
      {[-0.95, 0.95].map((x) => (
        <mesh key={"end-" + x} position={[x, 0.72, -2.12]} castShadow>
          <boxGeometry args={[0.055, 0.44, 0.65]} />
          <VehicleSurface kind="carbon"/>
        </mesh>
      ))}
      {[-0.45, 0.45].map((x) => (
        <mesh key={"wingpost" + x} position={[x, 0.47, -2.06]} castShadow>
          <boxGeometry args={[0.06, 0.8, 0.1]} />
          <VehicleSurface kind="carbon"/>
        </mesh>
      ))}
      {[-1, 1].flatMap((x) =>
        [-1.5, 1.5].flatMap((z) => [
          <Beam
            key={"s1" + x + z}
            a={[x * 0.35, 0.35, z * 0.8]}
            b={[x * 1.02, 0, z]}
            r={0.025}
            color="#555d6b"
          />,
          <Beam
            key={"s2" + x + z}
            a={[x * 0.35, 0.1, z * 0.6]}
            b={[x * 1.02, 0, z]}
            r={0.025}
            color="#555d6b"
          />,
        ]),
      )}
      <group ref={wheels}>
        {[-1, 1].flatMap((x) =>
          [-1.5, 1.5].map((z) => (
            <group key={x + ":" + z} position={[x * 1.02, 0, z]}>
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.36, 0.36, 0.4, 24]} />
                <VehicleSurface kind="rubber"/>
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]} position={[x * 0.205, 0, 0]}>
                <torusGeometry args={[0.27, 0.012, 4, 24]} />
                <meshBasicMaterial color="#bdae6a" />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]} position={[x * 0.21, 0, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 0.012, 12]} />
                <meshStandardMaterial
                  color="#4c535f"
                  metalness={0.85}
                  roughness={0.28}
                />
              </mesh>
            </group>
          )),
        )}
      </group>
      <mesh position={[0, 0.32, -2.42]}>
        <boxGeometry args={[0.13, 0.13, 0.05]} />
        <meshBasicMaterial color="#ff140a" toneMapped={false} />
      </mesh>
      <pointLight
        position={[0, 0.3, -2.5]}
        color="#ff210c"
        intensity={4}
        distance={2.5}
      />
      <CarContactShadow/>
  </group>;
}
function CarContactShadow(){return <mesh position={[0,-.35,0]} rotation={[-Math.PI/2,0,0]}>
  <planeGeometry args={[3.1,6.3]}/><shaderMaterial transparent depthWrite={false}
    vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
    fragmentShader={`varying vec2 vUv;void main(){vec2 p=(vUv-.5)*2.;float a=exp(-dot(p,p)*3.5)*.3;gl_FragColor=vec4(0.,0.,0.,a);}`}/>
</mesh>;}
