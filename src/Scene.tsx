import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as T from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FlatMap } from "./Map";
import {
  stands,
  getStand,
  seatPosition,
  seatTarget,
  type Selection,
  type Mode,
} from "./model";

type Props = {
  selection: Selection;
  mode: Mode;
  reset: number;
  onSelect?: (s: Selection) => void;
  onStand?: (id: string) => void;
  preview?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
};
const roadPoints: [number, number][] = [
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
  [130, 105],
];

function Box({
  position,
  size,
  color = "#2b302d",
  ...rest
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  [k: string]: any;
}) {
  return (
    <mesh position={position} {...rest}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.82} />
    </mesh>
  );
}
function ribbon(points: T.Vector3[], width: number, y: number) {
  const vertices: number[] = [];
  const uv: number[] = [];
  const indices: number[] = [];
  points.forEach((p, i) => {
    const d = points[Math.min(i + 1, points.length - 1)]
        .clone()
        .sub(points[Math.max(i - 1, 0)])
        .normalize(),
      n = new T.Vector3(-d.z, 0, d.x);
    for (const side of [-1, 1]) {
      vertices.push(
        p.x + n.x * width * 0.5 * side,
        y,
        p.z + n.z * width * 0.5 * side,
      );
      uv.push(side === -1 ? 0 : 1, i / (points.length - 1));
    }
    if (i < points.length - 1) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  });
  const geo = new T.BufferGeometry();
  geo.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
  geo.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}
function Track() {
  const curve = useMemo(
    () =>
      new T.CatmullRomCurve3(
        roadPoints.map(([x, z]) => new T.Vector3(x, 0, z)),
        true,
        "centripetal",
        0.1,
      ),
    [],
  );
  const points = useMemo(() => curve.getPoints(650), [curve]);
  const road = useMemo(() => ribbon(points, 15, 0.35), [points]);
  const edge = useMemo(() => ribbon(points, 18, 0.12), [points]);
  const barrier = useMemo(() => {
    const items: { p: [number, number, number]; a: number }[] = [];
    for (let i = 0; i < points.length - 1; i += 3) {
      const p = points[i],
        d = points[i + 1].clone().sub(p).normalize();
      for (const side of [-1, 1])
        items.push({
          p: [p.x - d.z * 10 * side, 1, p.z + d.x * 10 * side],
          a: Math.atan2(d.x, d.z),
        });
    }
    return items;
  }, [points]);
  return (
    <>
      <mesh geometry={edge}>
        <meshStandardMaterial color="#a99c82" side={T.DoubleSide} />
      </mesh>
      <mesh geometry={road}>
        <meshStandardMaterial
          color="#3e4441"
          roughness={0.95}
          side={T.DoubleSide}
        />
      </mesh>
      {barrier.map((b, i) => (
        <Box
          key={i}
          position={b.p}
          size={[0.7, 1.4, 5.4]}
          rotation={[0, b.a, 0]}
          color={i % 11 < 3 ? "#c34c3b" : "#b7b8aa"}
        />
      ))}
      {points
        .filter((_, i) => i % 7 === 0)
        .map((p, i) => (
          <Box
            key={"line" + i}
            position={[p.x, 0.39, p.z]}
            size={[0.16, 0.03, 1.8]}
            color="#858c7d"
          />
        ))}
      <Fence start={[126, -43]} end={[126, 96]} />
      <Fence start={[-71, -85]} end={[-71, 105]} />
      <Fence start={[-60, -128]} end={[30, -128]} />
      <Fence start={[51, -127]} end={[109, -105]} />
    </>
  );
}
function Fence({
  start,
  end,
}: {
  start: [number, number];
  end: [number, number];
}) {
  const len = Math.hypot(end[0] - start[0], end[1] - start[1]);
  const a = Math.atan2(end[0] - start[0], end[1] - start[1]);
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const x = c.getContext("2d")!;
    x.strokeStyle = "rgba(140,154,148,.5)";
    x.lineWidth = 1;
    for (let i = -64; i < 128; i += 16) {
      x.beginPath();
      x.moveTo(i, 0);
      x.lineTo(i + 64, 64);
      x.stroke();
      x.beginPath();
      x.moveTo(i, 0);
      x.lineTo(i - 64, 64);
      x.stroke();
    }
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(len / 3, 2);
    return t;
  }, [len]);
  return (
    <group
      position={[(start[0] + end[0]) / 2, 0, (start[1] + end[1]) / 2]}
      rotation={[0, a + Math.PI / 2, 0]}
    >
      <mesh position={[0, 3.4, 0]}>
        <planeGeometry args={[len, 5.2]} />
        <meshStandardMaterial
          map={texture}
          transparent
          side={T.DoubleSide}
          depthWrite={false}
          roughness={0.6}
        />
      </mesh>
      {Array.from({ length: Math.ceil(len / 9) + 1 }, (_, i) => (
        <Box
          key={i}
          position={[-len / 2 + i * 9, 3, 0]}
          size={[0.16, 6, 0.16]}
          color="#6c7774"
        />
      ))}
      <Box position={[0, 5.9, 0]} size={[len, 0.12, 0.12]} color="#718078" />
    </group>
  );
}
function Sphere() {
  const map = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 1024;
    const x = c.getContext("2d")!;
    x.fillStyle = "#30271b";
    x.fillRect(0, 0, 2048, 1024);
    for (let y = 0; y < 1024; y += 9) {
      x.strokeStyle = y % 27 === 0 ? "#d9b879" : "#9e7c45";
      x.lineWidth = 3;
      x.beginPath();
      for (let u = 0; u <= 2048; u += 5) {
        const v = y + Math.sin(u / 220 + y / 230) * 28;
        x.lineTo(u, v);
      }
      x.stroke();
    }
    x.fillStyle = "#f8e5bb";
    x.font = "600 145px sans-serif";
    x.textAlign = "center";
    for (let u = 256; u < 2300; u += 1024) {
      x.fillText("LAS VEGAS", u, 535);
      x.font = "40px sans-serif";
      x.fillText("THE NIGHT IS YOURS", u, 605);
      x.font = "600 145px sans-serif";
    }
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }, []);
  return (
    <group position={[0, 44, 0]}>
      <mesh rotation={[0, 0.35, 0]}>
        <sphereGeometry args={[48, 96, 64]} />
        <meshStandardMaterial
          map={map}
          emissiveMap={map}
          emissive="#e5b86a"
          emissiveIntensity={0.65}
          roughness={0.7}
        />
      </mesh>
      <mesh position={[0, -42, 0]}>
        <cylinderGeometry args={[30, 35, 8, 64]} />
        <meshStandardMaterial color="#262e29" />
      </mesh>
    </group>
  );
}
function Label({
  text,
  position,
  selected,
}: {
  text: string;
  position: [number, number, number];
  selected: boolean;
}) {
  const map = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const x = c.getContext("2d")!;
    x.fillStyle = selected ? "#e45d49" : "#e8e6dd";
    x.beginPath();
    x.arc(64, 64, 45, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = selected ? "#fff" : "#1b211e";
    x.font = "500 54px sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, 64, 67);
    return new T.CanvasTexture(c);
  }, [text, selected]);
  return (
    <sprite position={position} scale={[14, 14, 1]}>
      <spriteMaterial map={map} transparent depthTest={false} />
    </sprite>
  );
}
function Grandstand({
  id,
  selection,
  mode,
  onSelect,
  onStand,
}: {
  id: string;
  selection: Selection;
  mode: Mode;
  onSelect?: Props["onSelect"];
  onStand?: Props["onStand"];
}) {
  const stand = getStand(id),
    ref = useRef<T.InstancedMesh>(null);
  const selected = id === selection.stand;
  useEffect(() => {
    const inst = ref.current;
    if (!inst) return;
    const obj = new T.Object3D();
    for (let r = 1; r <= stand.rows; r++)
      for (let s = 1; s <= stand.seats; s++) {
        const index = (r - 1) * stand.seats + s - 1;
        obj.position.set(
          (s - (stand.seats + 1) / 2) * 1.1 +
            (s > stand.seats / 2 ? 1.1 : -1.1),
          0.6 + r * 0.55,
          -r * 1.05,
        );
        obj.updateMatrix();
        inst.setMatrixAt(index, obj.matrix);
        inst.setColorAt(index, new T.Color(selected ? "#718982" : "#465951"));
      }
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  }, [stand, selected]);
  const width = stand.seats * 1.1;
  return (
    <group position={stand.center} rotation={[0, stand.rotation, 0]}>
      {Array.from({ length: stand.rows }, (_, i) => (
        <Box
          key={i}
          position={[0, (i + 1) * 0.275, -(i + 1) * 1.05]}
          size={[width + 4, (i + 1) * 0.55, 1.04]}
          color={selected ? "#46534a" : "#353e37"}
        />
      ))}
      {[-width / 2 - 2, 0, width / 2 + 2].flatMap((x) =>
        Array.from({ length: stand.rows }, (_, i) => (
          <Box
            key={x + ":" + i}
            position={[x, (i + 1) * 0.55 + 0.035, -(i + 1) * 1.05]}
            size={[1.1, 0.05, 1]}
            color="#8e9385"
          />
        )),
      )}
      <instancedMesh
        ref={ref}
        args={[undefined, undefined, stand.rows * stand.seats]}
        onClick={(e) => {
          e.stopPropagation();
          if (!selected || mode === "overview") {
            onStand?.(id);
            return;
          }
          const n = e.instanceId || 0;
          onSelect?.({
            stand: id,
            row: Math.floor(n / stand.seats) + 1,
            seat: (n % stand.seats) + 1,
          });
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[0.75, 0.6, 0.68]} />
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
      {selected && (
        <mesh
          position={[
            (selection.seat - (stand.seats + 1) / 2) * 1.1 +
              (selection.seat > stand.seats / 2 ? 1.1 : -1.1),
            selection.row * 0.55 + 1,
            -selection.row * 1.05,
          ]}
        >
          <sphereGeometry args={[0.85, 12, 8]} />
          <meshBasicMaterial color="#fa7055" />
        </mesh>
      )}
      {mode !== "seat" && (
        <Label
          text={id}
          position={[0, stand.rows * 0.55 + 10, -stand.rows * 0.5]}
          selected={selected}
        />
      )}
      <Box
        position={[0, stand.rows * 0.55 + 1, -stand.rows * 1.05 - 1]}
        size={[width + 4, 0.12, 0.15]}
        color="#9a9c8e"
      />
    </group>
  );
}
function City() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 256;
    const x = c.getContext("2d")!;
    x.fillStyle = "#273037";
    x.fillRect(0, 0, 128, 256);
    for (let i = 0; i < 8; i++)
      for (let j = 0; j < 24; j++) {
        x.fillStyle = (i * 17 + j * 13) % 9 < 4 ? "#9b8c66" : "#273239";
        x.fillRect(i * 16 + 4, j * 11 + 3, 6, 4);
      }
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }, []);
  return (
    <>
      {Array.from({ length: 40 }, (_, i) => {
        const x = 210 + (i % 10) * 50,
          z = -235 + Math.floor(i / 10) * 95,
          h = 16 + ((i * 17) % 71);
        return (
          <mesh key={i} position={[x, h / 2, z]}>
            <boxGeometry args={[24 + (i % 4) * 4, h, 28]} />
            <meshStandardMaterial
              map={texture}
              emissiveMap={texture}
              emissive="#bcae84"
              emissiveIntensity={0.25}
            />
          </mesh>
        );
      })}
      {Array.from({ length: 14 }, (_, i) => (
        <Box
          key={"west" + i}
          position={[
            -170 - (i % 3) * 38,
            10 + (i % 3) * 7,
            -50 + Math.floor(i / 3) * 55,
          ]}
          size={[26, 20 + (i % 3) * 14, 30]}
          color="#293238"
        />
      ))}
      <Box position={[30, 8, 90]} size={[105, 16, 37]} color="#41433b" />
      <Box position={[30, 17, 90]} size={[110, 2, 42]} color="#858573" />
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i * Math.PI * 2) / 20;
        return (
          <group
            key={"tree" + i}
            position={[Math.cos(a) * 64, 0, Math.sin(a) * 65]}
          >
            <Box position={[0, 3.5, 0]} size={[0.6, 7, 0.6]} color="#555146" />
            <mesh position={[0, 8, 0]}>
              <sphereGeometry args={[3.1, 7, 5]} />
              <meshStandardMaterial color="#344635" />
            </mesh>
          </group>
        );
      })}
      {[-105, -40, 40, 105].map((x, i) => (
        <group key={"lamp" + i} position={[x, 0, -93]}>
          <Box position={[0, 10, 0]} size={[0.3, 20, 0.3]} color="#60685e" />
          <Box position={[0, 20, 0]} size={[6, 0.4, 1]} color="#e3e4cb" />
          <mesh position={[0, 19.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[6, 1]} />
            <meshBasicMaterial color="#fff7d4" side={T.DoubleSide} />
          </mesh>
        </group>
      ))}
    </>
  );
}
function Rig({ selection, mode, reset, preview }: Props) {
  const { camera, gl, invalidate } = useThree();
  const controls = useRef<OrbitControls | null>(null);
  const transition = useRef<{ position: T.Vector3; target: T.Vector3 } | null>(
    null,
  );
  const target = useRef(new T.Vector3());
  const seatAngles = useRef({ yaw: 0, pitch: 0 });
  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement);
    controls.current = c;
    c.enableDamping = false;
    c.maxPolarAngle = Math.PI * 0.48;
    c.minDistance = 30;
    c.maxDistance = 650;
    c.enablePan = false;
    c.addEventListener("change", () => invalidate());
    return () => {
      c.dispose();
      controls.current = null;
    };
  }, [camera, gl, invalidate]);
  useEffect(() => {
    const stand = getStand(selection.stand);
    let p: T.Vector3, t: T.Vector3;
    if (mode === "seat" || preview) {
      p = new T.Vector3(...seatPosition(selection));
      t = new T.Vector3(...seatTarget(selection));
    } else if (mode === "stand") {
      p = new T.Vector3(
        stand.center[0] + Math.sin(stand.rotation) * -85,
        85,
        stand.center[2] + Math.cos(stand.rotation) * -100,
      );
      t = new T.Vector3(stand.center[0], 0, stand.center[2] + 25);
    } else {
      const narrow = (camera as T.PerspectiveCamera).aspect < 1;
      p = narrow
        ? new T.Vector3(270, 235, -390)
        : new T.Vector3(255, 205, -325);
      t = narrow ? new T.Vector3(0, 45, -32) : new T.Vector3(20, 5, -32);
    }
    gl.domElement.dataset.cameraState = "moving";
    const c = controls.current;
    if (c) c.enabled = mode !== "seat" && !preview;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (preview || reduced) {
      camera.position.copy(p);
      camera.lookAt(t);
      target.current.copy(t);
      c?.target.copy(t);
      transition.current = null;
      gl.domElement.dataset.cameraState = "ready";
    } else transition.current = { position: p, target: t };
    (camera as T.PerspectiveCamera).fov = mode === "seat" || preview ? 65 : 46;
    (camera as T.PerspectiveCamera).updateProjectionMatrix();
    seatAngles.current = {
      yaw: getStand(selection.stand).rotation,
      pitch: -0.018,
    };
    invalidate();
  }, [
    selection.stand,
    selection.row,
    selection.seat,
    mode,
    reset,
    preview,
    camera,
    invalidate,
  ]);
  useEffect(() => {
    if (mode !== "seat" || preview) return;
    const el = gl.domElement;
    let down = false,
      lastX = 0,
      lastY = 0;
    const start = (e: PointerEvent) => {
      down = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      transition.current = null;
    };
    const move = (e: PointerEvent) => {
      if (!down) return;
      seatAngles.current.yaw -= (e.clientX - lastX) * 0.003;
      seatAngles.current.pitch = Math.max(
        -0.8,
        Math.min(0.9, seatAngles.current.pitch + (e.clientY - lastY) * 0.003),
      );
      lastX = e.clientX;
      lastY = e.clientY;
      const { yaw, pitch } = seatAngles.current;
      target.current.set(
        camera.position.x + Math.sin(yaw) * 90,
        camera.position.y + Math.sin(pitch) * 90,
        camera.position.z + Math.cos(yaw) * 90,
      );
      camera.lookAt(target.current);
      invalidate();
    };
    const end = () => (down = false);
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const c = camera as T.PerspectiveCamera;
      c.fov = T.MathUtils.clamp(c.fov + e.deltaY * 0.035, 35, 85);
      c.updateProjectionMatrix();
      invalidate();
    };
    el.addEventListener("pointerdown", start);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", start);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      el.removeEventListener("wheel", wheel);
    };
  }, [mode, preview, gl, camera, invalidate]);
  useEffect(() => {
    const el = gl.domElement;
    const zoom = (event: Event) => {
      const direction = (event as CustomEvent<number>).detail;
      if (mode === "seat" || preview) {
        const c = camera as T.PerspectiveCamera;
        c.fov = T.MathUtils.clamp(c.fov + direction * 6, 35, 85);
        c.updateProjectionMatrix();
      } else {
        const c = controls.current;
        if (c) {
          const offset = camera.position.clone().sub(c.target);
          offset.setLength(
            T.MathUtils.clamp(
              offset.length() * (direction > 0 ? 1.12 : 0.88),
              30,
              650,
            ),
          );
          camera.position.copy(c.target).add(offset);
          c.update();
        }
      }
      invalidate();
    };
    el.addEventListener("viewpointzoom", zoom);
    return () => el.removeEventListener("viewpointzoom", zoom);
  }, [camera, gl, invalidate, mode, preview]);
  useFrame((_, delta) => {
    const tr = transition.current;
    if (!tr) return;
    const alpha = 1 - Math.exp(-delta * 5);
    camera.position.lerp(tr.position, alpha);
    target.current.lerp(tr.target, alpha);
    camera.lookAt(target.current);
    controls.current?.target.copy(target.current);
    if (
      camera.position.distanceTo(tr.position) < 0.03 &&
      target.current.distanceTo(tr.target) < 0.03
    ) {
      camera.position.copy(tr.position);
      target.current.copy(tr.target);
      camera.lookAt(target.current);
      transition.current = null;
      gl.domElement.dataset.cameraState = "ready";
    }
    invalidate();
  });
  return null;
}
class Boundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Unavailable({
  children,
  onUnavailable,
}: {
  children: ReactNode;
  onUnavailable?: () => void;
}) {
  useEffect(() => {
    onUnavailable?.();
  }, [onUnavailable]);
  return <>{children}</>;
}
export default function Scene(props: Props) {
  const [lost, setLost] = useState(false);
  const fallback = (
    <Unavailable onUnavailable={props.onUnavailable}>
      <div className="scene-fallback">
        <FlatMap onStand={props.onStand} selected={props.selection.stand} />
        <p>
          3D view unavailable. You can still select positions and compare seat
          details.
        </p>
        <button onClick={() => window.location.reload()}>Retry 3D view</button>
      </div>
    </Unavailable>
  );
  if (lost) return fallback;
  return (
    <Boundary fallback={fallback}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.6]}
        camera={{ position: [255, 205, -325], fov: 46, near: 0.5, far: 1800 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setLost(true);
          });
          props.onReady?.();
        }}
        fallback={
          <div>
            3D view unavailable. Use the seat controls to explore positions.
          </div>
        }
      >
        <color attach="background" args={["#101719"]} />
        <fog attach="fog" args={["#101719", 450, 1150]} />
        <ambientLight intensity={0.9} />
        <hemisphereLight args={["#cad6dc", "#403c32", 1.45]} />
        <directionalLight
          position={[50, 150, -80]}
          intensity={1.7}
          color="#f9e8c0"
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[200, -0.05, 80]}>
          <planeGeometry args={[2000, 1800]} />
          <meshStandardMaterial color="#192123" roughness={1} />
        </mesh>
        <Box
          position={[0, 0.02, -25]}
          size={[192, 0.06, 245]}
          color="#293033"
        />
        <Track />
        <City />
        <Sphere />
        {stands.map((s) => (
          <Grandstand key={s.id} id={s.id} {...props} />
        ))}
        <Rig {...props} />
      </Canvas>
    </Boundary>
  );
}
