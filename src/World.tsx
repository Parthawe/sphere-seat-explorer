import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import * as T from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import {
  stands,
  getStand,
  partySeats,
  SPHERE,
  type Mode,
  type Selection,
} from "./model";
type V3 = [number, number, number];
type Piece = { p: V3; s: V3; r?: V3; color?: string };
const route: [number, number][] = [
  [130, 105],
  [130, -45],
  [119, -82],
  [92, -105],
  [45, -116],
  [27, -97],
  [7, -97],
  [-26, -115],
  [-58, -118],
  [-77, -103],
  [-78, 50],
  [-88, 118],
  [-125, 155],
  [-210, 202],
  [-245, 290],
  [0, 420],
  [270, 450],
  [675, 450],
  [700, 425],
  [725, 400],
  [725, 5],
  [695, -34],
  [570, -135],
  [548, -122],
  [560, -85],
  [590, -35],
  [575, 45],
  [530, 95],
];
const curve = new T.CatmullRomCurve3(
  route.map(([x, z]) => new T.Vector3(x, 0, z)),
  true,
  "centripetal",
);
const points = curve.getSpacedPoints(1100);
function stripe(offset: number, width: number, y: number) {
  const vertices: number[] = [],
    indices: number[] = [],
    uv: number[] = [];
  points.forEach((p, i) => {
    const d = points[Math.min(i + 1, points.length - 1)]
      .clone()
      .sub(points[Math.max(i - 1, 0)])
      .normalize();
    const n = new T.Vector3(-d.z, 0, d.x);
    for (const side of [-1, 1]) {
      const v = p.clone().addScaledVector(n, offset + (side * width) / 2);
      vertices.push(v.x, y, v.z);
      uv.push(side / 2 + 0.5, i * 1.6);
    }
    if (i < points.length - 1) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  });
  const geo = new T.BufferGeometry();
  geo.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
  geo.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}
function Instances({
  pieces,
  metal = 0.2,
  roughness = 0.7,
}: {
  pieces: Piece[];
  metal?: number;
  roughness?: number;
}) {
  const ref = useRef<T.InstancedMesh>(null);
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const obj = new T.Object3D();
    pieces.forEach((p, i) => {
      obj.position.set(...p.p);
      obj.scale.set(...p.s);
      obj.rotation.set(...(p.r || [0, 0, 0]));
      obj.updateMatrix();
      mesh.setMatrixAt(i, obj.matrix);
      mesh.setColorAt(i, new T.Color(p.color || "#8a8d96"));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [pieces]);
  return (
    <instancedMesh
      castShadow
      receiveShadow
      ref={ref}
      args={[undefined, undefined, pieces.length]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial metalness={metal} roughness={roughness} />
    </instancedMesh>
  );
}
function Beam({
  a,
  b,
  r = 0.08,
  color = "#89909d",
}: {
  a: V3;
  b: V3;
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
function billboardTexture(
  text: string,
  bg = "#12131b",
  fg = "#ffffff",
  w = 1024,
  h = 128,
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const c = canvas.getContext("2d")!;
  c.fillStyle = bg;
  c.fillRect(0, 0, w, h);
  c.fillStyle = fg;
  c.font = "italic 700 " + Math.floor(h * 0.65) + "px sans-serif";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(text, w / 2, h * 0.54, w * 0.91);
  const t = new T.CanvasTexture(canvas);
  t.colorSpace = T.SRGBColorSpace;
  return t;
}
function Sign({
  text,
  position,
  rotation = 0,
  width = 30,
  height = 4,
  red = false,
}: {
  text: string;
  position: V3;
  rotation?: number;
  width?: number;
  height?: number;
  red?: boolean;
}) {
  const map = useMemo(
    () => billboardTexture(text, red ? "#e10600" : "#171721"),
    [text, red],
  );
  return (
    <mesh position={position} rotation={[0, rotation, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={map} side={T.DoubleSide} />
    </mesh>
  );
}
function Track() {
  const sourceMaps = useLoader(T.TextureLoader, [
    "/materials/asphalt-color.jpg",
    "/materials/asphalt-normal.jpg",
    "/materials/asphalt-roughness.jpg",
  ]);
  const maps = useMemo(
    () =>
      sourceMaps.map((source, i) => {
        const t = source.clone();
        t.wrapS = t.wrapT = T.RepeatWrapping;
        t.repeat.set(7, 1);
        t.anisotropy = 8;
        if (i === 0) t.colorSpace = T.SRGBColorSpace;
        t.needsUpdate = true;
        return t;
      }),
    [sourceMaps],
  );
  const road = useMemo(() => stripe(0, 16, 0.18), []),
    edge = useMemo(() => stripe(0, 19, 0.12), []),
    lineA = useMemo(() => stripe(7.35, 0.12, 0.22), []),
    lineB = useMemo(() => stripe(-7.35, 0.12, 0.22), []);
  const barriers = useMemo(() => {
    const all: Piece[] = [];
    for (let i = 0; i < points.length - 1; i += 2) {
      const p = points[i],
        next = points[Math.min(i + 2, points.length - 1)],
        d = next.clone().sub(p),
        n = new T.Vector3(-d.z, 0, d.x).normalize();
      const length = d.length();
      for (const side of [-1, 1]) {
        const mid = p
          .clone()
          .add(next)
          .multiplyScalar(0.5)
          .addScaledVector(n, side * 10);
        all.push({
          p: [mid.x, 0.9, mid.z],
          s: [0.65, 1.65, length + 0.04],
          r: [0, Math.atan2(d.x, d.z), 0],
          color: i % 18 < 6 ? "#e10600" : i % 18 < 12 ? "#e9e9ed" : "#34343f",
        });
      }
    }
    return all;
  }, []);
  const curb = useMemo(() => {
    const all: Piece[] = [];
    for (let i = 0; i < 180; i++) {
      const index = i * 2;
      const p = points[index],
        d = points[index + 1].clone().sub(p).normalize();
      for (const side of [-1, 1]) {
        all.push({
          p: [p.x - d.z * 8.6 * side, 0.28, p.z + d.x * 8.6 * side],
          s: [1.05, 0.18, 2.2],
          r: [0, Math.atan2(d.x, d.z), 0],
          color: i % 2 ? "#f4f4f6" : "#d51d21",
        });
      }
    }
    return all;
  }, []);
  return (
    <>
      <mesh geometry={edge}>
        <meshStandardMaterial color="#b8b9c0" side={T.DoubleSide} />
      </mesh>
      <mesh geometry={road} receiveShadow>
        <meshStandardMaterial
          map={maps[0]}
          normalMap={maps[1]}
          normalScale={new T.Vector2(0.55, 0.55)}
          roughnessMap={maps[2]}
          roughness={0.87}
          side={T.DoubleSide}
        />
      </mesh>
      {[lineA, lineB].map((g, i) => (
        <mesh geometry={g} key={i}>
          <meshBasicMaterial color="#e4e4e9" side={T.DoubleSide} />
        </mesh>
      ))}
      <Instances pieces={barriers} />
      <Instances pieces={curb} roughness={0.9} />
      <TrackFence />
      <Sign
        text="LAS VEGAS GRAND PRIX"
        position={[8, 1.75, -126]}
        rotation={Math.PI}
        width={47}
        height={1.4}
      />
      <Sign
        text="SPHERE ZONE"
        position={[115, 1.6, -64]}
        rotation={Math.PI / 2}
        width={24}
        height={1.35}
        red
      />
    </>
  );
}
function TrackFence() {
  const geometry = useMemo(() => {
    const vertices: number[] = [],
      uv: number[] = [],
      indices: number[] = [];
    let counter = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const p = points[i],
        next = points[i + 1];
      if (p.x > 170 || p.x < -140 || p.z > 160 || p.z < -155) continue;
      const d = next.clone().sub(p).normalize(),
        n = new T.Vector3(-d.z, 0, d.x);
      for (const side of [-1, 1]) {
        const a = p.clone().addScaledVector(n, 12 * side),
          b = next.clone().addScaledVector(n, 12 * side);
        vertices.push(
          a.x,
          1.2,
          a.z,
          a.x,
          5.9,
          a.z,
          b.x,
          1.2,
          b.z,
          b.x,
          5.9,
          b.z,
        );
        uv.push(0, i * 2.1, 1, i * 2.1, 0, (i + 1) * 2.1, 1, (i + 1) * 2.1);
        indices.push(
          counter,
          counter + 1,
          counter + 2,
          counter + 1,
          counter + 3,
          counter + 2,
        );
        counter += 4;
      }
    }
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
    g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, []);
  const meshMap = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const x = c.getContext("2d")!;
    x.strokeStyle = "rgba(190,201,219,.36)";
    x.lineWidth = 1;
    for (let i = -128; i < 256; i += 32) {
      x.beginPath();
      x.moveTo(i, 0);
      x.lineTo(i + 128, 128);
      x.stroke();
      x.beginPath();
      x.moveTo(i, 0);
      x.lineTo(i - 128, 128);
      x.stroke();
    }
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(3, 1);
    return t;
  }, []);
  const posts = useMemo(() => {
    const all: Piece[] = [];
    for (let i = 0; i < points.length - 2; i += 5) {
      const p = points[i];
      if (p.x > 170 || p.x < -140 || p.z > 160 || p.z < -155) continue;
      const d = points[i + 1].clone().sub(p).normalize();
      for (const side of [-1, 1]) {
        const x = p.x - d.z * 12 * side,
          z = p.z + d.x * 12 * side;
        all.push({ p: [x, 3.6, z], s: [0.13, 5.4, 0.13], color: "#adb5c4" });
        all.push({
          p: [x, 5.9, z],
          s: [0.13, 0.13, 1.2],
          r: [0, Math.atan2(d.x, d.z), 0.25],
          color: "#adb5c4",
        });
      }
    }
    return all;
  }, []);
  return (
    <>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={meshMap}
          transparent
          side={T.DoubleSide}
          depthWrite={false}
          roughness={0.45}
          metalness={0.5}
        />
      </mesh>
      <Instances pieces={posts} metal={0.65} roughness={0.35} />
    </>
  );
}
function Sphere() {
  const map = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 1024;
    const x = c.getContext("2d")!;
    // Original amber Exosphere artwork. No text band: the curved LED shell leads.
    const pixels = x.createImageData(c.width, c.height);
    for (let v = 0; v < c.height; v++)
      for (let u = 0; u < c.width; u++) {
        const p = (v * c.width + u) * 4;
        const cloud =
          Math.sin(u / 73 + Math.sin(v / 61) * 2) *
            Math.sin(v / 41 + u / 183) *
            0.04 +
          Math.sin(u / 19 + v / 23) * 0.013;
        const latitude = v / c.height;
        const intensity = 0.7 + 0.22 * Math.sin(latitude * Math.PI) + cloud;
        pixels.data[p] = Math.min(255, 255 * intensity);
        pixels.data[p + 1] = Math.max(
          0,
          Math.min(255, (168 - 105 * latitude) * intensity),
        );
        pixels.data[p + 2] = Math.max(0, (48 - 38 * latitude) * intensity);
        pixels.data[p + 3] = 255;
      }
    x.putImageData(pixels, 0, 0);
    // A simple, original amber face makes the LED canvas recognizable at a distance.
    for (const middle of [512, 1536]) {
      x.fillStyle = "#271709";
      for (const eye of [-95, 95]) {
        x.beginPath();
        x.ellipse(middle + eye, 650, 27, 65, 0, 0, Math.PI * 2);
        x.fill();
      }
      x.strokeStyle = "#271709";
      x.lineWidth = 19;
      x.lineCap = "round";
      x.beginPath();
      x.moveTo(middle - 120, 820);
      x.bezierCurveTo(middle - 65, 902, middle + 65, 902, middle + 120, 820);
      x.stroke();
    }
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
  useEffect(() => () => map.dispose(), [map]);
  // Published envelope: 516 ft wide, 366 ft tall. A spherical cap cut at grade.
  const { radius, centerY: center, thetaLength: theta } = SPHERE;
  return (
    <group>
      <mesh position={[0, center, 0]} castShadow>
        <sphereGeometry args={[radius, 160, 100, 0, Math.PI * 2, 0, theta]} />
        <meshBasicMaterial
          map={map}
          toneMapped={false}
          onBeforeCompile={(shader) => {
            shader.vertexShader =
              "varying vec3 ledWorldNormal; varying vec3 ledWorldPosition; varying vec2 ledUV;\n" +
              shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
              "#include <begin_vertex>",
              "#include <begin_vertex>\nledWorldNormal=normalize(mat3(modelMatrix)*normal);ledWorldPosition=(modelMatrix*vec4(position,1.0)).xyz;ledUV=uv;",
            );
            shader.fragmentShader =
              "varying vec3 ledWorldNormal; varying vec3 ledWorldPosition; varying vec2 ledUV;\n" +
              shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace(
              "#include <tonemapping_fragment>",
              `
          float facing=max(0.0,dot(normalize(ledWorldNormal),normalize(cameraPosition-ledWorldPosition)));
          float shell=mix(0.30,1.0,pow(facing,0.40));
          float puck=0.94+0.06*sin(ledUV.x*4200.0)*sin(ledUV.y*2100.0);
          gl_FragColor.rgb*=shell*puck;
          #include <tonemapping_fragment>
        `,
            );
          }}
        />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[70.9, 71.4, 2, 128]} />
        <meshStandardMaterial
          color="#24242b"
          roughness={0.65}
          metalness={0.3}
        />
      </mesh>
      <pointLight
        position={[0, 20, -76]}
        intensity={1300}
        distance={190}
        decay={2}
        color="#ff912c"
      />
    </group>
  );
}
function Label({
  id,
  position,
  selected,
  onClick,
}: {
  id: string;
  position: V3;
  selected: boolean;
  onClick: () => void;
}) {
  const map = useMemo(
    () =>
      billboardTexture(
        id,
        selected ? "#e10600" : "#171720",
        "#ffffff",
        128,
        128,
      ),
    [id, selected],
  );
  return (
    <sprite
      position={position}
      scale={[10, 10, 1]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <spriteMaterial map={map} transparent depthTest={false} />
    </sprite>
  );
}
function moldedPanel(w: number, h: number, r: number, depth: number) {
  const shape = new T.Shape();
  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  shape.lineTo(w / 2, h / 2 - r);
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  shape.lineTo(-w / 2 + r, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  shape.lineTo(-w / 2, -h / 2 + r);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return new T.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.018,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 4,
  });
}
const seatGeo = (() => {
  const pan = moldedPanel(0.72, 0.62, 0.09, 0.075);
  pan.rotateX(-Math.PI / 2);
  pan.translate(0, -0.015, 0.02);
  const back = moldedPanel(0.72, 0.62, 0.085, 0.07);
  back.rotateX(-0.11);
  back.translate(0, 0.36, -0.33);
  const leg1 = new T.BoxGeometry(0.055, 0.48, 0.44);
  leg1.translate(-0.27, -0.26, 0);
  const leg2 = leg1.clone();
  leg2.translate(0.54, 0, 0);
  const arms = [-0.41, 0.41].map((x) => {
    const g = new T.BoxGeometry(0.07, 0.065, 0.49);
    g.translate(x, 0.25, -0.015);
    return g;
  });
  const uprights = [-0.4, 0.4].map((x) => {
    const g = new T.BoxGeometry(0.045, 0.25, 0.05);
    g.translate(x, 0.13, -0.12);
    return g;
  });
  return mergeGeometries(
    [pan, back, leg1, leg2, ...arms, ...uprights].map((g) =>
      g.index ? g.toNonIndexed() : g,
    ),
  );
})();
const distantSeatGeo = (() => {
  const pan = new T.BoxGeometry(0.72, 0.12, 0.62),
    back = new T.BoxGeometry(0.72, 0.62, 0.08);
  back.translate(0, 0.35, -0.3);
  return mergeGeometries([pan, back]);
})();
function SeatNumbers({ standId }: { standId: string }) {
  const s = getStand(standId),
    ref = useRef<T.InstancedMesh>(null);
  const map = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 768;
    const x = c.getContext("2d")!;
    for (let n = 1; n <= 48; n++) {
      const col = (n - 1) % 8,
        row = Math.floor((n - 1) / 8);
      x.fillStyle = "#d9dce5";
      x.fillRect(col * 128 + 8, row * 128 + 26, 112, 76);
      x.fillStyle = "#161b26";
      x.font = "600 55px sans-serif";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText(String(n), col * 128 + 64, row * 128 + 65);
    }
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, []);
  const geometry = useMemo(() => {
    const g = new T.PlaneGeometry(0.25, 0.19);
    const offsets = new Float32Array(s.rows * s.seats * 2);
    for (let r = 1; r <= s.rows; r++)
      for (let n = 1; n <= s.seats; n++) {
        const i = ((r - 1) * s.seats + n - 1) * 2;
        offsets[i] = (n - 1) % 8;
        offsets[i + 1] = 5 - Math.floor((n - 1) / 8);
      }
    g.setAttribute("instanceUv", new T.InstancedBufferAttribute(offsets, 2));
    return g;
  }, [s]);
  const material = useMemo(() => {
    const m = new T.MeshBasicMaterial({
      map,
      transparent: true,
      alphaTest: 0.1,
      side: T.FrontSide,
    });
    m.onBeforeCompile = (shader) => {
      shader.vertexShader =
        "attribute vec2 instanceUv;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <uv_vertex>",
        "#include <uv_vertex>\n#ifdef USE_MAP\nvMapUv=(vMapUv+instanceUv)/vec2(8.0,6.0);\n#endif",
      );
    };
    m.customProgramCacheKey = () => "number-atlas-v1";
    return m;
  }, [map]);
  useEffect(() => {
    if (!ref.current) return;
    const o = new T.Object3D();
    for (let r = 1; r <= s.rows; r++)
      for (let n = 1; n <= s.seats; n++) {
        o.position.set(
          (n - (s.seats + 1) / 2) * 1.1 + (n > s.seats / 2 ? 1.1 : -1.1),
          r * 0.55 + 1.04,
          -r * 1.05 - 0.375,
        );
        o.rotation.set(-0.11, Math.PI, 0);
        o.updateMatrix();
        ref.current.setMatrixAt((r - 1) * s.seats + n - 1, o.matrix);
      }
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [s]);
  return (
    <instancedMesh ref={ref} args={[geometry, material, s.rows * s.seats]} />
  );
}
function GrandstandDetails({ standId }: { standId: string }) {
  const s = getStand(standId),
    width = s.seats * 1.1 + 2.2;
  const pieces = useMemo(() => {
    const list: Piece[] = [];
    for (let r = 1; r <= s.rows; r++) {
      for (const x of [-width / 2 - 1.5, 0, width / 2 + 1.5]) {
        list.push({
          p: [x, (r - 0.5) * 0.55, -(r - 0.5) * 1.05],
          s: [1, 0.09, 0.51],
          color: "#b6bdcd",
        });
        for (const side of [-1, 1])
          list.push({
            p: [x + side * 0.44, r * 0.55 + 0.105, -r * 1.05 + 0.08],
            s: [0.04, 0.025, 0.8],
            color: "#292f3b",
          });
      }
      for (let n = 1; n <= s.seats; n += 3) {
        const x =
          (n - (s.seats + 1) / 2) * 1.1 + (n > s.seats / 2 ? 1.1 : -1.1);
        for (const side of [-1, 1])
          list.push({
            p: [x + side * 0.27, r * 0.55 + 0.08, -r * 1.05],
            s: [0.12, 0.045, 0.18],
            color: "#b3b7c3",
          });
      }
    }
    for (const x of [-width / 2 - 2.3, width / 2 + 2.3]) {
      list.push({
        p: [x, s.rows * 0.55 + 0.65, -s.rows * 1.05],
        s: [0.12, 1.3, 0.12],
        color: "#aeb7ca",
      });
      list.push({
        p: [x, s.rows * 0.55 + 0.9, -s.rows * 1.05],
        s: [0.13, 0.13, 1.2],
        color: "#bdc4d2",
      });
    }
    return list;
  }, [s, width]);
  return (
    <>
      <Instances pieces={pieces} metal={0.8} roughness={0.37} />
      {[-width / 2 - 1.5, 0, width / 2 + 1.5].map((x, i) => (
        <group key={i}>
          {[3, 6, 9, 12, 15, 18].map((r) => (
            <mesh key={r} position={[x, r * 0.55 + 0.12, -r * 1.05 + 0.43]}>
              <boxGeometry args={[0.62, 0.04, 0.06]} />
              <meshStandardMaterial
                color="#b7caee"
                emissive="#9ebcf5"
                emissiveIntensity={1.3}
              />
            </mesh>
          ))}
        </group>
      ))}
      <SeatNumbers standId={standId} />
    </>
  );
}
function Grandstand({
  id,
  selection,
  mode,
  onStand,
  onSelect,
}: {
  id: string;
  selection: Selection;
  mode: Mode;
  onStand?: (id: string) => void;
  onSelect?: (s: Selection) => void;
}) {
  const s = getStand(id),
    active = s.id === selection.stand,
    ref = useRef<T.InstancedMesh>(null);
  const width = s.seats * 1.1 + 2.2;
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const obj = new T.Object3D();
    const plannedSeats = partySeats(selection);
    for (let r = 1; r <= s.rows; r++)
      for (let n = 1; n <= s.seats; n++) {
        const index = (r - 1) * s.seats + n - 1;
        obj.position.set(
          (n - (s.seats + 1) / 2) * 1.1 + (n > s.seats / 2 ? 1.1 : -1.1),
          r * 0.55 + 0.55,
          -r * 1.05,
        );
        obj.updateMatrix();
        mesh.setMatrixAt(index, obj.matrix);
        mesh.setColorAt(
          index,
          new T.Color(
            active && r === selection.row && plannedSeats.includes(n)
              ? "#ff1a12"
              : active && r === selection.row
                ? "#aab1c3"
                : "#4d566a",
          ),
        );
      }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [selection, s, active]);
  const tiers = useMemo(() => {
    const list: Piece[] = [];
    for (let r = 1; r <= s.rows; r++) {
      list.push({
        p: [0, r * 0.55, -r * 1.05],
        s: [width + 5, 0.13, 1.05],
        color: "#737b8d",
      });
      list.push({
        p: [0, r * 0.55 - 0.25, -r * 1.05 + 0.5],
        s: [width + 5, 0.5, 0.035],
        color: "#3e4656",
      });
      for (const x of [-width / 2 - 1.5, 0, width / 2 + 1.5])
        list.push({
          p: [x, r * 0.55 + 0.09, -r * 1.05 + 0.4],
          s: [1.05, 0.05, 0.12],
          color: "#e2e3ed",
        });
    }
    for (let x = -width / 2; x <= width / 2; x += 6) {
      for (const r of [4, 9, 14, 18]) {
        list.push({
          p: [x, r * 0.275, -r * 1.05],
          s: [0.15, r * 0.55, 0.15],
          color: "#737c91",
        });
      }
    }
    return list;
  }, [s, width]);
  return (
    <group position={s.center} rotation={[0, s.rotation, 0]}>
      <Instances pieces={tiers} metal={0.65} roughness={0.48} />
      <GrandstandDetails standId={id} />
      <instancedMesh
        ref={ref}
        castShadow
        receiveShadow
        args={[
          active && mode !== "overview" ? seatGeo : distantSeatGeo,
          undefined,
          s.rows * s.seats,
        ]}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 4 || mode === "seat") return;
          if (!active || mode === "overview") {
            onStand?.(id);
            return;
          }
          const index = e.instanceId || 0;
          onSelect?.({
            stand: id,
            row: Math.floor(index / s.seats) + 1,
            seat: (index % s.seats) + 1,
          });
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <meshStandardMaterial metalness={0.24} roughness={0.5} />
      </instancedMesh>
      {[-width / 2 - 1.5, 0, width / 2 + 1.5].map((x, i) => (
        <group key={i}>
          {[0, 1].map((n) => (
            <Beam
              key={n}
              a={[x, n === 0 ? 1.4 : 2, -1]}
              b={[x, s.rows * 0.55 + (n === 0 ? 1.4 : 2), -s.rows * 1.05]}
              r={0.045}
            />
          ))}
          {[2, 6, 10, 14, 18].map((r) => (
            <Beam
              key={r}
              a={[x, r * 0.55, -r * 1.05]}
              b={[x, r * 0.55 + 1.4, -r * 1.05]}
              r={0.04}
            />
          ))}
        </group>
      ))}
      {Array.from({ length: Math.ceil(width / 7) }, (_, i) => {
        const x = -width / 2 + i * 7;
        return (
          <group key={i}>
            <Beam a={[x, 0, -18]} b={[x + 7, 9.9, -18]} r={0.055} />
            <Beam a={[x, 9.9, -18]} b={[x + 7, 0, -18]} r={0.055} />
          </group>
        );
      })}
      {mode === "overview" && (
        <Sign
          text={"POSITION " + id}
          position={[0, s.rows * 0.55 + 0.7, -s.rows * 1.05 - 0.3]}
          rotation={Math.PI}
          width={width * 0.85}
          height={1.3}
          red={active}
        />
      )}
      {mode === "overview" && (
        <Label
          id={id}
          position={[0, s.rows * 0.55 + 8, -s.rows * 0.55]}
          selected={active}
          onClick={() => onStand?.(id)}
        />
      )}
    </group>
  );
}
function Environment() {
  const facade = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 512;
    const x = c.getContext("2d")!;
    x.fillStyle = "#0d101b";
    x.fillRect(0, 0, 256, 512);
    for (let row = 0; row < 40; row++)
      for (let col = 0; col < 16; col++) {
        const lit = (row * 19 + col * 13) % 17 < 4;
        x.fillStyle = lit
          ? (col + row) % 5
            ? "#827b75"
            : "#c0a879"
          : "#172032";
        x.fillRect(col * 16 + 2, row * 13 + 3, 11, 4);
      }
    for (let y = 0; y < 512; y += 52) {
      x.fillStyle = "#4d4b48";
      x.fillRect(0, y, 256, 3);
    }
    const t = new T.CanvasTexture(c);
    t.anisotropy = 8;
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }, []);
  const ground = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const x = c.getContext("2d")!;
    x.fillStyle = "#161820";
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 13000; i++) {
      const v = 22 + ((i * 17) % 10);
      x.fillStyle = "rgb(" + v + "," + (v + 1) + "," + (v + 7) + ")";
      x.fillRect((i * 73) % 256, (i * 139) % 256, 1, 1);
    }
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(80, 80);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }, []);
  return (
    <>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[150, -0.15, 0]}
      >
        <planeGeometry args={[2200, 2200]} />
        <meshStandardMaterial map={ground} roughness={0.95} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const angle = i * 0.39,
          h = 22 + ((i * 37) % 65),
          x = 255 + (i % 5) * 65,
          z = 230 + Math.floor(i / 5) * 110;
        return (
          <group key={i}>
            <mesh position={[x, h / 2, z]}>
              <boxGeometry args={[20 + (i % 3) * 8, h, 23]} />
              <meshStandardMaterial
                color="#7c8297"
                map={facade}
                emissiveMap={facade}
                emissive="#ffffff"
                emissiveIntensity={0.65}
                roughness={0.5}
                metalness={0.35}
              />
            </mesh>
            <mesh position={[x, h + 0.3, z]}>
              <boxGeometry args={[20 + (i % 3) * 8, 0.4, 23]} />
              <meshBasicMaterial
                color={i % 4 === 0 ? "#e10600" : "#8090b6"}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}
      <group position={[-158, 0, 70]}>
        {[-30, 0, 30].map((x, i) => (
          <group key={i}>
            <mesh position={[x, 48 + i * 6, 0]}>
              <boxGeometry args={[27, 96 + i * 12, 25]} />
              <meshStandardMaterial
                color="#878e9d"
                map={facade}
                emissiveMap={facade}
                emissive="#f1e2c7"
                emissiveIntensity={0.7}
              />
            </mesh>
            <mesh position={[x, 98 + i * 12, 0]}>
              <boxGeometry args={[31, 2, 29]} />
              <meshStandardMaterial color="#c6c2b7" />
            </mesh>
          </group>
        ))}
      </group>
      <Sign text="LAS VEGAS" position={[-158, 110, 56]} width={62} height={6} />
      <Gantry />
      <Floodlights />
    </>
  );
}
function Gantry() {
  return (
    <group position={[110, 0, -82]} rotation={[0, 0.3, 0]}>
      {[-19, 19].map((x) => (
        <group key={x}>
          <Beam a={[x, 0, 0]} b={[x, 12, 0]} r={0.18} />
          <Beam a={[x - 1, 0, 1]} b={[x - 1, 12, 1]} r={0.14} />
        </group>
      ))}
      <Beam a={[-20, 12, 0]} b={[20, 12, 0]} r={0.13} />
      <Beam a={[-20, 13.5, 0]} b={[20, 13.5, 0]} r={0.13} />
      {Array.from({ length: 14 }, (_, i) => (
        <Beam
          key={i}
          a={[-20 + i * 3, 12, 0]}
          b={[-17 + i * 3, 13.5, 0]}
          r={0.06}
        />
      ))}
      <Sign
        text="LAS VEGAS GRAND PRIX"
        position={[0, 12.8, -0.15]}
        rotation={Math.PI}
        width={35}
        height={1.2}
        red
      />
    </group>
  );
}
function Floodlights() {
  const positions: V3[] = [
    [-94, 0, -112],
    [-46, 0, -82],
    [37, 0, -78],
    [115, 0, -55],
    [111, 0, 65],
    [-85, 0, 60],
  ];
  return (
    <>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          <Beam a={[0, 0, 0]} b={[0, 22, 0]} r={0.18} color="#a5aab8" />
          <mesh position={[0, 22, 0]} rotation={[-0.28, 0, 0]}>
            <boxGeometry args={[5.5, 0.7, 0.5]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#e5efff"
              emissiveIntensity={4}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            position={[0, 19, 0]}
            intensity={2100}
            distance={75}
            decay={2}
            color="#e5eaff"
          />
        </group>
      ))}
    </>
  );
}
function Car({
  color,
  offset,
  playing,
}: {
  color: string;
  offset: number;
  playing: boolean;
}) {
  const ref = useRef<T.Group>(null);
  const clock = useRef(0);
  useFrame((_, delta) => {
    if (!playing || !ref.current) return;
    clock.current += Math.min(delta, 0.05);
    const t = (clock.current * 0.019 + offset) % 1,
      p = curve.getPointAt(t),
      d = curve.getTangentAt(t);
    ref.current.position.set(p.x, 0.7, p.z);
    ref.current.rotation.y = Math.atan2(d.x, d.z);
  });
  return (
    <group ref={ref} visible={playing}>
      <mesh>
        <boxGeometry args={[1.1, 0.45, 3.7]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, -0.1]}>
        <sphereGeometry args={[0.5, 12, 8]} />
        <meshStandardMaterial color="#11121b" />
      </mesh>
      <mesh position={[0, 0.2, 2.1]}>
        <boxGeometry args={[2.1, 0.12, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.5, -1.8]}>
        <boxGeometry args={[1.9, 0.18, 0.45]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[-1, 1].flatMap((x) =>
        [-1.25, 1.3].map((z) => (
          <mesh
            key={x + ":" + z}
            position={[x, 0.05, z]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.43, 0.43, 0.4, 12]} />
            <meshStandardMaterial color="#0a0b0f" roughness={0.8} />
          </mesh>
        )),
      )}
    </group>
  );
}
function VenueDetails() {
  const pieces = useMemo(() => {
    const list: Piece[] = [];
    // Lighting cabinets, mounting bases, cable conduits and modular service cabins.
    for (const [x, z] of [
      [-94, -112],
      [-46, -82],
      [37, -78],
      [115, -55],
      [111, 65],
      [-85, 60],
    ]) {
      list.push({ p: [x, 0.24, z], s: [1.5, 0.48, 1.5], color: "#686d79" });
      list.push({
        p: [x + 0.85, 0.9, z + 0.6],
        s: [0.6, 1.55, 0.5],
        color: "#3b4251",
      });
      list.push({
        p: [x + 0.21, 10, z + 0.13],
        s: [0.05, 19, 0.05],
        color: "#282e39",
      });
      list.push({ p: [x, 21.9, z + 0.3], s: [6.2, 1, 0.35], color: "#4b5364" });
      for (let n = -2; n <= 2; n++)
        list.push({
          p: [x + n * 1.06, 22, z - 0.05],
          s: [0.06, 0.75, 0.5],
          color: "#252b39",
        });
    }
    for (let i = 0; i < 6; i++) {
      const x = -48 + i * 16;
      list.push({
        p: [x, 1.7, 77],
        s: [12, 3.4, 8],
        color: i % 2 ? "#e2e3e8" : "#aeb4c0",
      });
      list.push({ p: [x, 1.5, 72.95], s: [9, 1.6, 0.08], color: "#222836" });
      list.push({ p: [x, 1.65, 72.8], s: [10, 0.12, 0.4], color: "#b7bfce" });
      for (const d of [-1, 1])
        list.push({
          p: [x + d * 5.7, 2.2, 72.9],
          s: [0.12, 4.4, 0.12],
          color: "#8e99ad",
        });
    }
    // Directional pedestrian barriers and a maintenance walkway outside the track.
    for (let i = 0; i < 18; i++) {
      const x = -57 + i * 6;
      list.push({ p: [x, 0.04, -68], s: [3.5, 0.06, 0.2], color: "#858b9b" });
      list.push({ p: [x, 1, -72], s: [5.3, 0.08, 0.08], color: "#7c8495" });
      for (const d of [-2.5, 2.5])
        list.push({
          p: [x + d, 0.55, -72],
          s: [0.08, 1.1, 0.08],
          color: "#7c8495",
        });
    }
    return list;
  }, []);
  const tires = useRef<T.InstancedMesh>(null);
  useEffect(() => {
    if (!tires.current) return;
    const obj = new T.Object3D();
    for (let i = 0; i < 24; i++) {
      obj.position.set(
        146,
        0.38 + Math.floor(i / 8) * 0.38,
        -70 + (i % 8) * 1.13,
      );
      obj.rotation.set(Math.PI / 2, 0, 0);
      obj.updateMatrix();
      tires.current.setMatrixAt(i, obj.matrix);
    }
    tires.current.instanceMatrix.needsUpdate = true;
    tires.current.computeBoundingSphere();
  }, []);
  return (
    <>
      <Instances pieces={pieces} metal={0.4} roughness={0.6} />
      <instancedMesh ref={tires} args={[undefined, undefined, 24]}>
        <torusGeometry args={[0.44, 0.16, 6, 16]} />
        <meshStandardMaterial color="#13161d" roughness={0.92} />
      </instancedMesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={i}
          position={[-48 + i * 16, 4.5, 77]}
          rotation={[0, Math.PI / 4, 0]}
        >
          <coneGeometry args={[9, 2.7, 4]} />
          <meshStandardMaterial color="#d9dce4" roughness={0.8} />
        </mesh>
      ))}
      <Sign
        text="SPHERE ZONE"
        position={[0, 2.9, 72.6]}
        rotation={Math.PI}
        width={26}
        height={1.3}
        red
      />
      <VenueScreen />
      {[
        { text: "TURN 5", p: [145, 4, -45] as V3, a: Math.PI / 2 },
        { text: "TURN 7", p: [43, 3.1, -128] as V3, a: Math.PI },
        { text: "TURN 9", p: [-74, 3.1, -129] as V3, a: Math.PI },
      ].map((sign) => (
        <group key={sign.text}>
          <Sign
            text={sign.text}
            position={sign.p}
            rotation={sign.a}
            width={4}
            height={1.5}
          />
          <Beam
            a={[sign.p[0], 0, sign.p[2]]}
            b={[sign.p[0], sign.p[1] - 0.8, sign.p[2]]}
            r={0.07}
          />
        </group>
      ))}
    </>
  );
}
function VenueScreen() {
  const map = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 576;
    const x = c.getContext("2d")!;
    x.fillStyle = "#15151e";
    x.fillRect(0, 0, 1024, 576);
    x.fillStyle = "#e10600";
    x.fillRect(0, 0, 1024, 14);
    x.font = "italic 700 110px sans-serif";
    x.fillStyle = "#fff";
    x.fillText("LAS VEGAS", 70, 176);
    x.font = "italic 700 68px sans-serif";
    x.fillText("GRAND PRIX", 72, 260);
    x.strokeStyle = "#f0342c";
    x.lineWidth = 6;
    x.beginPath();
    x.moveTo(85, 370);
    x.lineTo(385, 370);
    x.quadraticCurveTo(410, 370, 410, 345);
    x.lineTo(410, 320);
    x.lineTo(470, 340);
    x.quadraticCurveTo(530, 275, 585, 350);
    x.lineTo(585, 370);
    x.lineTo(915, 370);
    x.stroke();
    x.font = "26px sans-serif";
    x.fillStyle = "#b5bbcd";
    x.fillText("ILLUSTRATIVE VENUE SCREEN", 72, 510);
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }, []);
  return (
    <group position={[77, 0, 30]} rotation={[0, -0.4, 0]}>
      {[-6, 6].map((x) => (
        <Beam key={x} a={[x, 0, 0]} b={[x, 15, 0]} r={0.22} />
      ))}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[17, 10, 0.55]} />
        <meshStandardMaterial color="#282e3b" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 10, -0.31]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[16, 9]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      <Beam a={[-7.5, 15, 0]} b={[7.5, 15, 0]} r={0.13} />
      <Beam a={[-7.5, 5, 0]} b={[7.5, 5, 0]} r={0.13} />
    </group>
  );
}

function FanZone() {
  const ref = useRef<T.InstancedMesh>(null);
  const geometry = useMemo(() => {
    const coat = new T.CapsuleGeometry(0.19, 0.47, 2, 5);
    coat.translate(0, 1.08, 0);
    const head = new T.SphereGeometry(0.13, 7, 5);
    head.translate(0, 1.61, 0);
    const legs = [-0.105, 0.105].map((x) => {
      const g = new T.CylinderGeometry(0.065, 0.055, 0.75, 5);
      g.translate(x, 0.42, 0);
      return g;
    });
    const arms = [-0.26, 0.26].map((x, i) => {
      const g = new T.CylinderGeometry(0.055, 0.06, 0.61, 5);
      g.rotateZ(i === 0 ? -0.12 : 0.12);
      g.translate(x, 1.05, 0);
      return g;
    });
    return mergeGeometries(
      [coat, head, ...legs, ...arms].map((g) =>
        g.index ? g.toNonIndexed() : g,
      ),
    );
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    const obj = new T.Object3D();
    for (let i = 0; i < 138; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = side * (35 + ((i * 17) % 36)),
        z = -42 - ((i * 13) % 28);
      obj.position.set(x, 0, z);
      obj.rotation.y = (i * 0.73) % 6.28;
      const scale = 0.9 + (i % 7) * 0.026;
      obj.scale.setScalar(scale);
      obj.updateMatrix();
      ref.current.setMatrixAt(i, obj.matrix);
      ref.current.setColorAt(
        i,
        new T.Color(
          ["#29313f", "#54505a", "#27282f", "#682e35", "#9b9793"][i % 5],
        ),
      );
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, []);
  return (
    <>
      <instancedMesh
        castShadow
        receiveShadow
        ref={ref}
        args={[geometry, undefined, 138]}
      >
        <meshStandardMaterial roughness={0.95} />
      </instancedMesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 67, 0, -48]}>
          <mesh position={[0, 2.5, 0]}>
            <boxGeometry args={[11, 5, 8]} />
            <meshStandardMaterial color="#282d37" roughness={0.7} />
          </mesh>
          <mesh position={[0, 5.6, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[9, 2.3, 4]} />
            <meshStandardMaterial color="#bfc4d1" roughness={0.8} />
          </mesh>
          <Sign
            text="SPHERE ZONE"
            position={[0, 4, -4.1]}
            rotation={Math.PI}
            width={9}
            height={1.3}
            red
          />
          <pointLight
            position={[0, 4, -5]}
            intensity={140}
            distance={20}
            color="#f1dfc2"
          />
        </group>
      ))}
    </>
  );
}
function MetalReflections() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    const pmrem = new T.PMREMGenerator(gl);
    const target = pmrem.fromScene(room, 0.06);
    const previous = scene.environment,
      previousIntensity = scene.environmentIntensity;
    scene.environment = target.texture;
    scene.environmentIntensity = 0.22;
    room.dispose();
    pmrem.dispose();
    invalidate();
    return () => {
      scene.environment = previous;
      scene.environmentIntensity = previousIntensity;
      target.dispose();
    };
  }, [gl, scene, invalidate]);
  return null;
}
function Finish({ playing, preview }: { playing: boolean; preview?: boolean }) {
  const { gl, scene, camera, size, invalidate } = useThree();
  const composer = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    if (size.width >= 760 && !preview) {
      const ao = new GTAOPass(
        scene,
        camera,
        Math.round(size.width * 0.65),
        Math.round(size.height * 0.65),
      );
      ao.updateGtaoMaterial({
        radius: 1.2,
        thickness: 0.8,
        samples: 8,
        distanceFallOff: 1.5,
      });
      ao.blendIntensity = 0.65;
      c.addPass(ao);
    }
    c.addPass(
      new UnrealBloomPass(
        new T.Vector2(size.width, size.height),
        0.22,
        0.5,
        1.2,
      ),
    );
    c.addPass(new OutputPass());
    return c;
  }, [gl, scene, camera, preview]);
  useEffect(() => {
    composer.setSize(size.width, size.height);
    invalidate();
  }, [composer, size, invalidate]);
  useEffect(() => () => composer.dispose(), [composer]);
  useFrame((_, delta) => {
    composer.render(delta);
    if (playing && !preview) invalidate();
  }, 1);
  return null;
}
export function World({
  selection,
  mode,
  onSelect,
  onStand,
  playing = false,
  preview = false,
}: {
  selection: Selection;
  mode: Mode;
  onSelect?: (s: Selection) => void;
  onStand?: (id: string) => void;
  playing?: boolean;
  preview?: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#080911"]} />
      <fogExp2 attach="fog" args={["#111421", 0.0018]} />
      <ambientLight intensity={0.16} />
      <hemisphereLight args={["#bac8e7", "#17131b", 0.4]} />
      <directionalLight
        position={[-60, 160, -120]}
        intensity={2.8}
        color="#e1e7f6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-230}
        shadow-camera-right={230}
        shadow-camera-top={230}
        shadow-camera-bottom={-230}
        shadow-camera-near={0.5}
        shadow-camera-far={650}
        shadow-normalBias={0.035}
        shadow-bias={-0.00008}
      />
      <MetalReflections />
      <VenueDetails />
      <FanZone />
      <Environment />
      <Track />
      <Sphere />
      {stands.map((s) => (
        <Grandstand
          key={s.id}
          id={s.id}
          selection={selection}
          mode={mode}
          onSelect={onSelect}
          onStand={onStand}
        />
      ))}
      {!preview && (
        <>
          <Car color="#e10600" offset={0.04} playing={playing} />
          <Car color="#e8eaf2" offset={0.065} playing={playing} />
          <Car color="#f28c22" offset={0.085} playing={playing} />
        </>
      )}
      <Finish playing={playing} preview={preview} />
    </>
  );
}
