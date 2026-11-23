import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as T from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { stands, getStand, type Mode, type Selection } from "./model";
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
    <instancedMesh ref={ref} args={[undefined, undefined, pieces.length]}>
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
  const asphalt = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const x = c.getContext("2d")!;
    const image = x.createImageData(256, 256);
    for (let i = 0; i < image.data.length; i += 4) {
      const v = 62 + ((i * 134775813 + 17) % 23);
      image.data.set([v, v + 1, v + 4, 255], i);
    }
    x.putImageData(image, 0, 0);
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(5, 180);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }, []);
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
      <mesh geometry={road}>
        <meshStandardMaterial
          map={asphalt}
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
    x.fillStyle = "#a30912";
    x.fillRect(0, 0, 2048, 1024);
    for (let i = 0; i < 13; i++) {
      x.fillStyle =
        i % 3 === 0 ? "#f5f6ff" : i % 3 === 1 ? "#d01622" : "#4a020a";
      x.beginPath();
      for (let u = 0; u < 2100; u += 10) {
        const v = 180 + i * 65 + Math.sin(u / 320 + i * 0.1) * 55;
        x.lineTo(u, v);
      }
      for (let u = 2100; u >= 0; u -= 10) {
        const v = 220 + i * 65 + Math.sin(u / 320 + i * 0.1) * 55;
        x.lineTo(u, v);
      }
      x.closePath();
      x.fill();
    }
    for (let pos = 256; pos < 2048; pos += 1024) {
      x.fillStyle = "#11111b";
      x.fillRect(pos - 340, 352, 680, 236);
      x.fillStyle = "#ffffff";
      x.font = "italic 900 126px sans-serif";
      x.textAlign = "center";
      x.fillText("LAS VEGAS", pos, 495);
      x.font = "500 34px sans-serif";
      x.fillText("GRAND PRIX", pos, 551);
    }
    for (let y = 0; y < 1024; y += 4) {
      x.fillStyle = "rgba(0,0,0,.26)";
      x.fillRect(0, y, 2048, 1);
    }
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
  return (
    <group position={[0, 44, 0]}>
      <mesh rotation={[0, 0.35, 0]}>
        <sphereGeometry args={[48, 128, 80]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      <mesh position={[0, -42, 0]}>
        <cylinderGeometry args={[30, 35, 8, 64]} />
        <meshStandardMaterial color="#11121a" metalness={0.5} roughness={0.4} />
      </mesh>
      <pointLight
        position={[0, -6, -48]}
        intensity={950}
        distance={190}
        decay={2}
        color="#e10600"
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
const seatGeo = (() => {
  const pan = new T.BoxGeometry(0.76, 0.12, 0.68);
  const back = new T.BoxGeometry(0.76, 0.64, 0.11);
  back.rotateX(-0.11);
  back.translate(0, 0.35, -0.31);
  const leg1 = new T.BoxGeometry(0.06, 0.5, 0.48);
  leg1.translate(-0.28, -0.25, 0);
  const leg2 = leg1.clone();
  leg2.translate(0.56, 0, 0);
  return mergeGeometries([pan, back, leg1, leg2]);
})();
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
            active && r === selection.row && n === selection.seat
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
      <instancedMesh
        ref={ref}
        args={[seatGeo, undefined, s.rows * s.seats]}
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
      <Sign
        text={"POSITION " + id}
        position={[0, s.rows * 0.55 + 0.7, -s.rows * 1.05 - 0.3]}
        rotation={Math.PI}
        width={width * 0.85}
        height={1.3}
        red={active}
      />
      {mode !== "seat" && (
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
        const lit = (row * 19 + col * 13) % 11 < 6;
        x.fillStyle = lit
          ? (col + row) % 5
            ? "#a6a6b4"
            : "#c8b99d"
          : "#172032";
        x.fillRect(col * 16 + 3, row * 13 + 2, 6, 5);
      }
    const t = new T.CanvasTexture(c);
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[150, -0.15, 0]}>
        <planeGeometry args={[2200, 2200]} />
        <meshStandardMaterial map={ground} roughness={0.95} />
      </mesh>
      {Array.from({ length: 22 }, (_, i) => {
        const angle = i * 0.39,
          h = 25 + ((i * 37) % 90),
          x = 245 + (i % 7) * 48,
          z = 190 + Math.floor(i / 7) * 85;
        return (
          <group key={i}>
            <mesh position={[x, h / 2, z]}>
              <boxGeometry args={[20 + (i % 3) * 8, h, 23]} />
              <meshStandardMaterial
                color="#7c8297"
                map={facade}
                emissiveMap={facade}
                emissive="#ffffff"
                emissiveIntensity={1.1}
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
                emissiveIntensity={1.2}
              />
            </mesh>
            <mesh position={[x, 98 + i * 12, 0]}>
              <boxGeometry args={[31, 2, 29]} />
              <meshStandardMaterial color="#c6c2b7" />
            </mesh>
          </group>
        ))}
      </group>
      <Instances
        pieces={Array.from({ length: 14 }, (_, i) => ({
          p: [-49 + i * 7, 1, 73] as V3,
          s: [5, 2, 16] as V3,
          color: "#b7bac4",
        }))}
      />
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
function Finish({ playing, preview }: { playing: boolean; preview?: boolean }) {
  const { gl, scene, camera, size, invalidate } = useThree();
  const composer = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
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
  }, [gl, scene, camera]);
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
      <fog attach="fog" args={["#080911", 350, 1100]} />
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#b5c8ff", "#1b1522", 0.8]} />
      <directionalLight
        position={[50, 180, -90]}
        intensity={1.8}
        color="#c2d2ff"
      />
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
