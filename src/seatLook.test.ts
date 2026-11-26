import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { seatedLookTarget } from './seatLook';

test('seated look resumes an existing camera direction without changing its pitch or eye position', () => {
  const eye = new Vector3(234, 18, -72), original = eye.clone();
  for (const vector of [[-6,-9,3], [9,6,-3], [0,-1,0], [1,0,0], [-1,.001,-1]]) {
    const direction = new Vector3(...vector as [number,number,number]).normalize();
    const yaw = Math.atan2(direction.x,direction.z), pitch = Math.asin(direction.y);
    const target = new Vector3(...seatedLookTarget(eye,yaw,pitch));
    const resumed = target.sub(eye);
    assert.ok(Math.abs(resumed.length()-90)<1e-10, 'look radius stays constant at steep angles');
    assert.ok(resumed.normalize().distanceTo(direction)<1e-12, 'zero movement preserves the original direction');
    assert.deepEqual(eye,original, 'the eye remains at the selected seat');
  }
});
