import test from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera } from 'three';
import { points } from './racingLine';
import { vegasCircuitCamera } from './vegasCamera';

test('Vegas full-circuit view contains the whole racing line on portrait and landscape screens', () => {
  for (const aspect of [320/760, 390/680, 768/820, 1024/820, 1440/820, 2.5]) {
    const pose = vegasCircuitCamera(aspect);
    const camera = new PerspectiveCamera(46, aspect, .25, pose.far);
    camera.position.copy(pose.eye); camera.lookAt(pose.target); camera.updateMatrixWorld();
    for (const point of points) {
      const projected = point.clone().project(camera);
      assert.ok(Math.abs(projected.x) < .95 && Math.abs(projected.y) < .95, `track point outside view at aspect ${aspect}`);
      assert.ok(projected.z > -1 && projected.z < 1, `track point clipped by near/far plane at aspect ${aspect}`);
    }
  }
});
