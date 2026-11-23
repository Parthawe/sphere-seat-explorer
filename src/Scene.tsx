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
import { World } from "./World";
import {
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
  playing?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
};
function Rig({ selection, mode, reset, preview, onReady }: Props) {
  const { camera, gl, invalidate } = useThree();
  const controls = useRef<OrbitControls | null>(null);
  const transition = useRef<{
    position: T.Vector3;
    target: T.Vector3;
    startPosition: T.Vector3;
    startTarget: T.Vector3;
    elapsed: number;
    duration: number;
  } | null>(null);
  const target = useRef(
    mode === "seat" ? new T.Vector3(...seatTarget(selection)) : new T.Vector3(),
  );
  const seatAngles = useRef({ yaw: 0, pitch: 0 });
  useEffect(() => {
    onReady?.();
  }, [gl]);
  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement);
    controls.current = c;
    c.enableDamping = false;
    c.maxPolarAngle = Math.PI * 0.48;
    c.minDistance = 30;
    c.maxDistance = 650;
    c.enablePan = false;
    c.addEventListener("change", () => invalidate());
    c.addEventListener("start", () => {
      transition.current = null;
      gl.domElement.dataset.cameraState = "ready";
    });
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
      const seat = seatPosition(selection),
        angle = stand.rotation;
      p = new T.Vector3(
        seat[0] + Math.cos(angle) * 7 - Math.sin(angle) * 8,
        seat[1] + 6,
        seat[2] - Math.cos(angle) * 8 - Math.sin(angle) * 7,
      );
      t = new T.Vector3(seat[0], seat[1] - 0.4, seat[2] + 2);
    } else {
      const narrow = (camera as T.PerspectiveCamera).aspect < 1;
      p = narrow
        ? new T.Vector3(230, 205, -335)
        : new T.Vector3(215, 165, -280);
      t = narrow ? new T.Vector3(0, 30, -30) : new T.Vector3(0, 18, -38);
    }
    gl.domElement.dataset.cameraState = "moving";
    const c = controls.current;
    if (c) {
      c.enabled = mode !== "seat" && !preview;
      c.minDistance = mode === "stand" ? 6 : 30;
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (
      preview ||
      reduced ||
      (camera.position.distanceTo(p) < 0.01 &&
        target.current.distanceTo(t) < 0.01)
    ) {
      camera.position.copy(p);
      camera.lookAt(t);
      target.current.copy(t);
      c?.target.copy(t);
      transition.current = null;
      gl.domElement.dataset.cameraState = "ready";
    } else
      transition.current = {
        position: p,
        target: t,
        startPosition: camera.position.clone(),
        startTarget: target.current.clone(),
        elapsed: 0,
        duration: camera.position.distanceTo(p) < 8 ? 0.38 : 1.15,
      };
    const aspect = (camera as T.PerspectiveCamera).aspect;
    (camera as T.PerspectiveCamera).fov =
      mode === "seat" || preview
        ? aspect < 1
          ? Math.min(
              100,
              (2 * Math.atan(Math.tan((72 * Math.PI) / 360) / aspect) * 180) /
                Math.PI,
            )
          : 72
        : 46;
    (camera as T.PerspectiveCamera).updateProjectionMatrix();
    seatAngles.current = {
      yaw: getStand(selection.stand).rotation,
      pitch: 0.088,
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
      gl.domElement.dataset.cameraState = "ready";
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
      c.fov = T.MathUtils.clamp(c.fov + e.deltaY * 0.035, 35, 110);
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
        c.fov = T.MathUtils.clamp(c.fov + direction * 6, 35, 110);
        c.updateProjectionMatrix();
      } else {
        const c = controls.current;
        if (c) {
          const offset = camera.position.clone().sub(c.target);
          offset.setLength(
            T.MathUtils.clamp(
              offset.length() * (direction > 0 ? 1.12 : 0.88),
              mode === "stand" ? 6 : 30,
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
    tr.elapsed += Math.min(delta, 0.05);
    const progress = Math.min(1, tr.elapsed / tr.duration),
      eased = 1 - Math.pow(1 - progress, 3);
    camera.position.lerpVectors(tr.startPosition, tr.position, eased);
    const distance = tr.startPosition.distanceTo(tr.position);
    if (distance > 20)
      camera.position.y +=
        Math.sin(Math.PI * progress) * Math.min(distance * 0.12, 28);
    target.current.lerpVectors(tr.startTarget, tr.target, eased);
    camera.lookAt(target.current);
    controls.current?.target.copy(target.current);
    if (progress === 1) {
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
        shadows="soft"
        dpr={[1, 1.6]}
        camera={{
          position:
            props.mode === "seat"
              ? seatPosition(props.selection)
              : [255, 205, -325],
          fov: 46,
          near: 0.25,
          far: 1800,
        }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setLost(true);
          });
        }}
        fallback={
          <div>
            3D view unavailable. Use the seat controls to explore positions.
          </div>
        }
      >
        <World {...props} />
        <Rig {...props} />
      </Canvas>
    </Boundary>
  );
}
