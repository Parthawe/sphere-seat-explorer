import { Canvas, useThree, useFrame } from "@react-three/fiber";
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
import { bowlLevels, bowlPosition, type BowlSeat } from "./vegas";
function ContextWatch({ onLost }: { onLost: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (e: Event) => {
      e.preventDefault();
      onLost();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onLost]);
  useFrame(() => {
    gl.domElement.dataset.bowlReady = "true";
  });
  return null;
}
function Camera({ seat, eye }: { seat: BowlSeat; eye: boolean }) {
  const { camera, gl, invalidate, size } = useThree();
  const controls = useRef<OrbitControls | null>(null);
  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement);
    controls.current = c;
    c.enablePan = false;
    c.minDistance = 10;
    c.maxDistance = 300;
    c.maxPolarAngle = Math.PI * 0.49;
    c.addEventListener("change", () => invalidate());
    return () => {
      c.dispose();
      controls.current = null;
    };
  }, [camera, gl, invalidate]);
  useEffect(() => {
    const p = bowlPosition(seat),
      c = controls.current;
    camera.position.set(
      ...((eye ? [p[0], p[1] + 1.2, p[2]] : [90, 105, -145]) as [
        number,
        number,
        number,
      ]),
    );
    const target = new T.Vector3(
      ...((eye ? [0, 30, -65] : [0, 28, 15]) as [number, number, number]),
    );
    camera.lookAt(target);
    if (c) {
      c.enabled = !eye;
      c.target.copy(target);
    }
    (camera as T.PerspectiveCamera).fov = size.width < size.height ? 72 : 52;
    (camera as T.PerspectiveCamera).updateProjectionMatrix();
    invalidate();
  }, [seat, eye, camera, size.width, size.height, invalidate]);
  return null;
}
function Seats({
  selection,
  all,
  onSelect,
}: {
  selection: BowlSeat;
  all: boolean;
  onSelect: (seat: BowlSeat) => void;
}) {
  const ref = useRef<T.InstancedMesh>(null);
  const seats = useMemo(
    () =>
      bowlLevels
        .filter((l) => all || l.level === selection.level)
        .flatMap((l) =>
          Array.from({ length: l.sections }, (_, section) =>
            Array.from({ length: l.rows }, (_, row) =>
              Array.from({ length: l.seats }, (_, seat) => ({
                level: l.level,
                section: l.first + section,
                row: row + 1,
                seat: seat + 1,
              })),
            ),
          ).flat(2),
        ),
    [all, selection.level],
  );
  useEffect(() => {
    if (!ref.current) return;
    const o = new T.Object3D();
    seats.forEach((seat, i) => {
      const p = bowlPosition(seat);
      o.position.set(p[0], p[1] + 0.35, p[2]);
      o.rotation.set(0, Math.atan2(p[0], p[2] + 12), 0);
      o.updateMatrix();
      ref.current!.setMatrixAt(i, o.matrix);
      const picked = Object.keys(seat).every(
        (k) => seat[k as keyof BowlSeat] === selection[k as keyof BowlSeat],
      );
      ref.current!.setColorAt(
        i,
        new T.Color(
          picked
            ? "#ff2119"
            : seat.section === selection.section
              ? "#b6bfce"
              : "#465064",
        ),
      );
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [seats, selection]);
  return (
    <instancedMesh
      key={seats.length}
      ref={ref}
      args={[undefined, undefined, seats.length]}
      onClick={(e) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) onSelect(seats[e.instanceId]);
      }}
    >
      <boxGeometry args={[0.2, 0.7, 0.48]} />
      <meshStandardMaterial roughness={0.7} metalness={0.1} />
    </instancedMesh>
  );
}
function Tiers({ all, level }: { all: boolean; level: number }) {
  const structures = useMemo(
    () =>
      bowlLevels.map((l) => {
        const inner = l.radius - 0.3,
          outer = l.radius + (l.rows - 1) * 0.6 + 0.3;
        return new T.LatheGeometry(
          [
            new T.Vector2(inner, l.height + l.rise - 0.3),
            new T.Vector2(outer, l.height + l.rows * l.rise - 0.3),
            new T.Vector2(outer, l.height + l.rows * l.rise - 2),
            new T.Vector2(inner, l.height + l.rise - 2),
            new T.Vector2(inner, l.height + l.rise - 0.3),
          ],
          100,
          -1.13,
          2.26,
        );
      }),
    [],
  );
  useEffect(() => () => structures.forEach((g) => g.dispose()), [structures]);
  return (
    <>
      {bowlLevels
        .filter((l) => all || l.level === level)
        .map((l) => (
          <group key={"support-" + l.level} position={[0, 0, -12]}>
            <mesh geometry={structures[bowlLevels.indexOf(l)]}>
              <meshStandardMaterial
                color="#4b5364"
                roughness={0.75}
                side={T.DoubleSide}
              />
            </mesh>
            {[-1, -0.5, 0, 0.5, 1].map((a) => (
              <mesh
                key={a}
                position={[
                  Math.sin(a) * (l.radius + (l.rows - 1) * 0.6),
                  (l.height + l.rows * l.rise) / 2,
                  Math.cos(a) * (l.radius + (l.rows - 1) * 0.6),
                ]}
              >
                <cylinderGeometry
                  args={[0.5, 0.65, l.height + l.rows * l.rise, 6]}
                />
                <meshStandardMaterial color="#262d3a" />
              </mesh>
            ))}
          </group>
        ))}
      {bowlLevels
        .filter((l) => all || l.level === level)
        .flatMap((l) =>
          Array.from({ length: l.rows }, (_, row) => (
            <mesh
              key={`${l.level}-${row}`}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, l.height + (row + 1) * l.rise - 0.1, -12]}
            >
              <ringGeometry
                args={[
                  l.radius + row * 0.6 - 0.3,
                  l.radius + row * 0.6 + 0.3,
                  100,
                  1,
                  -Math.PI / 2 - 1.13,
                  2.26,
                ]}
              />
              <meshStandardMaterial
                color="#262b35"
                roughness={0.8}
                side={T.DoubleSide}
              />
            </mesh>
          )),
        )}
    </>
  );
}
class BowlBoundary extends Component<
  { children: ReactNode; onUnavailable: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() { this.props.onUnavailable(); }
  render() {
    return this.state.failed ? (
      <div className="bowl-fallback">
        The 3D interior could not load. Use the level controls and official
        venue maps below.
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function SphereBowl({
  selection,
  all,
  eye,
  onSelect,
}: {
  selection: BowlSeat;
  all: boolean;
  eye: boolean;
  onSelect: (seat: BowlSeat) => void;
}) {
  const screenMap = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 1024;
    const x = c.getContext("2d")!;
    x.fillStyle = "#111723";
    x.fillRect(0, 0, 2048, 1024);
    for (let i = 0; i < 9; i++) {
      x.strokeStyle = i % 3 === 0 ? "#e10600" : "#8994ad";
      x.lineWidth = i % 3 === 0 ? 14 : 2;
      x.beginPath();
      for (let u = 0; u <= 2048; u += 8)
        x.lineTo(u, 100 + i * 110 + Math.sin(u / 280 + i * 0.4) * 80);
      x.stroke();
    }
    for (let i = 0; i < 220; i++) {
      x.fillStyle = "#dce2ef";
      x.fillRect((i * 173) % 2048, (i * 97) % 1024, 2, 2);
    }
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => screenMap.dispose(), [screenMap]);
  const [lost, setLost] = useState(false);
  if (lost)
    return (
      <div className="bowl-fallback">
        <div>
          <p>
            The 3D view was interrupted. The model grid and official maps remain
            available below.
          </p>
          <button onClick={() => setLost(false)}>Retry 3D interior</button>
        </div>
      </div>
    );
  return (
    <BowlBoundary onUnavailable={() => setLost(true)}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [90, 105, -145], near: 0.1, far: 500 }}
        gl={{ antialias: true }}
        aria-label="Illustrative Sphere interior seating model"
      >
        <color attach="background" args={["#090b12"]} />
        <ambientLight intensity={1} />
        <hemisphereLight args={["#d2d9ee", "#17151b", 1]} />
        <directionalLight position={[10, 100, 20]} intensity={2} />
        <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[90, 100]} />
          <meshStandardMaterial color="#11141c" />
        </mesh>
        <mesh position={[0, 33, -12]}>
          <sphereGeometry
            args={[84, 100, 60, Math.PI, Math.PI, 0, Math.acos(-33 / 84)]}
          />
          <meshStandardMaterial
            map={screenMap}
            emissiveMap={screenMap}
            emissive="#ffffff"
            emissiveIntensity={0.65}
            roughness={0.8}
            side={T.BackSide}
          />
        </mesh>
        <mesh position={[0, 0.2, -27]}>
          <boxGeometry args={[36, 0.6, 15]} />
          <meshStandardMaterial color="#5c606c" />
        </mesh>
        <mesh position={[0, 1, -34]}>
          <boxGeometry args={[36, 0.1, 0.15]} />
          <meshBasicMaterial color="#e10600" />
        </mesh>
        <Tiers all={all} level={selection.level} />
        <Seats selection={selection} all={all} onSelect={onSelect} />
        <Camera seat={selection} eye={eye} />
        <ContextWatch onLost={() => setLost(true)} />
      </Canvas>
    </BowlBoundary>
  );
}
