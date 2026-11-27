import {flightDuration,flightProgress,sampleFlight} from './cameraFlight';
import {ShaderGuard} from './SceneMaterials';
import { vegasCircuitCamera } from "./vegasCamera";
import { seatedLookTarget } from "./seatLook";
import { points } from "./racingLine";
import { nearestTrackFraction } from "./rendering";
import type { ReplayFrame } from "./replayMath";
import type { SphereDisplay } from "./rendering";
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
  type CameraLook,
} from "./model";

type Props = {
  selection: Selection;
  mode: Mode;
  reset: number;
  onSelect?: (s: Selection) => void;
  onStand?: (id: string) => void;
  preview?: boolean;
  playing?: boolean;
  replay?: ReplayFrame | null;
  atmosphere?: boolean;
  sphereDisplay?: SphereDisplay;
  ambientMotion?: boolean;
  previewLook?: CameraLook;
  onReady?: () => void;
  onUnavailable?: () => void;
};
function Rig({ selection, mode, reset, preview, onReady, previewLook, replay }: Props) {
  const { camera, gl, invalidate, size } = useThree();
  const controls = useRef<OrbitControls | null>(null);
  const transition = useRef<{
    position: T.Vector3;
    target: T.Vector3;
    startPosition: T.Vector3;
    startTarget: T.Vector3;
    started: number;
    duration: number;
    fromFov:number;
    toFov:number;
  } | null>(null);
  const target = useRef(
    mode === "seat" ? new T.Vector3(...seatTarget(selection)) : new T.Vector3(),
  );
  const lookGoal=useRef<T.Vector3|null>(null);
  const seatAngles = useRef({ yaw: 0, pitch: 0 });
  useEffect(() => {
    onReady?.();
  }, [gl]);
  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement);
    controls.current = c;
    c.enableDamping = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    c.dampingFactor = .09;
    c.maxPolarAngle = Math.PI * 0.48;
    c.minDistance = 30;
    c.maxDistance = 2000;
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
    lookGoal.current=null;
    const fromFov=(camera as T.PerspectiveCamera).fov;
    const stand = getStand(selection.stand);
    let p: T.Vector3, t: T.Vector3, far = 1800;
    if (mode === "seat" || preview) {
      p = new T.Vector3(...seatPosition(selection));
      t = new T.Vector3(...seatTarget(selection));
      if (replay && !preview) {
        const index = Math.round(nearestTrackFraction(points, stand.center) * (points.length - 1));
        t = points[index].clone();
        t.y = 0.9;
      }
    } else if (mode === "stand") {
      const seat = seatPosition(selection),
        angle = stand.rotation;
      p = new T.Vector3(
        seat[0] + Math.cos(angle) * 7 - Math.sin(angle) * 8,
        seat[1] + 6,
        seat[2] - Math.cos(angle) * 8 - Math.sin(angle) * 7,
      );
      t = new T.Vector3(seat[0], seat[1] - 0.4, seat[2] + 2);
    } else if (mode === "circuit") {
      const pose = vegasCircuitCamera((camera as T.PerspectiveCamera).aspect);
      p = pose.eye;
      t = pose.target;
      far = pose.far;
    } else {
      const narrow = (camera as T.PerspectiveCamera).aspect < 1;
      p = narrow
        ? new T.Vector3(260, 300, -460)
        : new T.Vector3(210, 260, -365);
      t = narrow ? new T.Vector3(25, 30, -40) : new T.Vector3(25, 30, -40);
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
        started: performance.now(),
        duration: flightDuration(camera.position.distanceTo(p)),
        fromFov,
        toFov:fromFov,
      };
    const aspect = (camera as T.PerspectiveCamera).aspect;
    (camera as T.PerspectiveCamera).far = far;
    gl.domElement.dataset.cameraFar = String((camera as T.PerspectiveCamera).far);
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
    if(transition.current){transition.current.toFov=(camera as T.PerspectiveCamera).fov;(camera as T.PerspectiveCamera).fov=fromFov;(camera as T.PerspectiveCamera).updateProjectionMatrix();}
    seatAngles.current = {
      yaw: Math.atan2(t.x - p.x, t.z - p.z),
      pitch: Math.atan2(t.y - p.y, Math.hypot(t.x - p.x, t.z - p.z)),
    };
    invalidate();
  }, [
    selection.stand,
    selection.row,
    selection.seat,
    mode,
    reset,
    preview,
    !!replay,
    size.width,
    size.height,
    camera,
    invalidate,
  ]);
  useEffect(() => {
    if (!preview || !previewLook) return;
    const p = seatPosition(selection),
      yaw =
        getStand(selection.stand).rotation + (previewLook.yaw * Math.PI) / 180,
      pitch =
        Math.atan((getStand(selection.stand).zone ? -2 : 22) / 90) +
        (previewLook.pitch * Math.PI) / 180;
    camera.position.set(...p);
    target.current.set(
      p[0] + Math.sin(yaw) * Math.cos(pitch) * 90,
      p[1] + Math.sin(pitch) * 90,
      p[2] + Math.cos(yaw) * Math.cos(pitch) * 90,
    );
    camera.lookAt(target.current);
    invalidate();
  }, [
    preview,
    previewLook?.yaw,
    previewLook?.pitch,
    selection.stand,
    selection.row,
    selection.seat,
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
      const direction = camera.getWorldDirection(new T.Vector3());
      seatAngles.current = { yaw: Math.atan2(direction.x, direction.z), pitch: Math.asin(T.MathUtils.clamp(direction.y, -1, 1)) };
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
      const desired=new T.Vector3(...seatedLookTarget(camera.position,yaw,pitch));
      if(matchMedia('(prefers-reduced-motion: reduce)').matches){target.current.copy(desired);camera.lookAt(target.current);}else lookGoal.current=desired;
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
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduce = () => {
      const tr = transition.current;
      if(controls.current)controls.current.enableDamping=!preference.matches;
      if(preference.matches&&lookGoal.current){target.current.copy(lookGoal.current);camera.lookAt(target.current);lookGoal.current=null;invalidate();}
      if (!preference.matches || !tr) return;
      (camera as T.PerspectiveCamera).fov=tr.toFov;(camera as T.PerspectiveCamera).updateProjectionMatrix();
      camera.position.copy(tr.position);
      target.current.copy(tr.target);
      camera.lookAt(target.current);
      controls.current?.target.copy(target.current);
      transition.current = null;
      gl.domElement.dataset.cameraState = 'ready';
      invalidate();
    };
    preference.addEventListener('change', reduce);
    return () => preference.removeEventListener('change', reduce);
  }, [camera, gl, invalidate]);
  useFrame((_, delta) => {
    const tr = transition.current;
    if(!tr){
      if(mode!=="seat"&&!preview)controls.current?.update();
      if(lookGoal.current){target.current.lerp(lookGoal.current,1-Math.exp(-Math.min(delta,.05)*18));if(target.current.distanceTo(lookGoal.current)<.01){target.current.copy(lookGoal.current);lookGoal.current=null;}camera.lookAt(target.current);invalidate();}
      return;
    }
    const progress=flightProgress(tr.started,performance.now(),tr.duration),eased=sampleFlight(tr.startPosition,tr.position,tr.startTarget,tr.target,progress,camera.position,target.current);
    const lens=camera as T.PerspectiveCamera;lens.fov=T.MathUtils.lerp(tr.fromFov,tr.toFov,eased);lens.updateProjectionMatrix();
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
        <ShaderGuard onUnavailable={() => props.onUnavailable?.()}/><World {...props} />
        <Rig {...props} />
      </Canvas>
    </Boundary>
  );
}
