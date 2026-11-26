import { test } from "node:test";
import assert from "node:assert/strict";
import { bowlLevels } from "./vegas";
import { normalizeBowlSeat, readBowlView, bowlViewUrl } from "./sphereView";

test("Sphere links restore every seating level and both camera/display modes", () => {
  for (const level of bowlLevels) for (const eye of [false, true]) for (const all of [false, true]) {
    const seat = { level: level.level, section: level.first, row: level.rows, seat: level.seats };
    const url = new URL(bowlViewUrl("https://example.com/?ticket=secret#private", 2027, seat, eye, all));
    assert.deepEqual(readBowlView(url.search), { seat, eye, all });
    assert.equal(url.searchParams.get("ticket"), null);
    assert.equal(url.hash, "");
    assert.equal(url.searchParams.get("race"), "las-vegas");
  }
});
test("malformed Sphere coordinates stay within the selected model level", () => {
  assert.deepEqual(normalizeBowlSeat({level: 400, section: 999, row: -10, seat: Infinity}), {level: 400, section: 409, row: 1, seat: 10});
  assert.deepEqual(readBowlView("?sphereLevel=wrong&sphereRow=NaN"), readBowlView(""));
});
