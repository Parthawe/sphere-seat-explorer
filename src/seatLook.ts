/** A look direction on a sphere around the fixed seated eye position. */
export function seatedLookTarget(eye: { x: number; y: number; z: number }, yaw: number, pitch: number): [number, number, number] {
  const horizontal = Math.cos(pitch) * 90;
  return [eye.x + Math.sin(yaw) * horizontal, eye.y + Math.sin(pitch) * 90, eye.z + Math.cos(yaw) * horizontal];
}
