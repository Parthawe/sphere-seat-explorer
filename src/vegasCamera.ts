import { Vector3 } from 'three';
import { points } from './racingLine';

/** Keep the entire authored racing line within the initial full-circuit frustum. */
export function vegasCircuitCamera(aspect: number) {
  const target = new Vector3(245, 15, 130);
  const radius = Math.max(...points.map(point => point.distanceTo(target)));
  const vertical = 46 * Math.PI / 360;
  const horizontal = Math.atan(Math.tan(vertical) * Math.max(.1, aspect));
  const distance = radius / Math.sin(Math.min(vertical, horizontal)) * 1.08;
  const direction = aspect < 1 ? new Vector3(755, 1235, -1580) : new Vector3(535, 635, -980);
  const eye = target.clone().addScaledVector(direction.normalize(), distance);
  return { eye, target, far: Math.max(1800, distance + 1200) };
}
