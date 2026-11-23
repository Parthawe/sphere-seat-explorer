import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalize,
  readUrl,
  makeSearch,
  seatPosition,
  addSaved,
  DEFAULT,
  decode,
} from "./model";
test("bounds malformed and out-of-range selections", () => {
  assert.deepEqual(normalize({ stand: "missing", row: -5, seat: Infinity }), {
    stand: "C",
    row: 1,
    seat: 18,
  });
  assert.equal(decode("C:NaN:2"), null);
  assert.equal(decode("X:2:3"), null);
  assert.equal(normalize({ stand: "E", seat: 100, row: 100 }).seat, 30);
});
test("share links round trip seat, mode and comparison", () => {
  const input = { stand: "A", row: 4, seat: 31 };
  const result = readUrl(makeSearch(input, "seat", [DEFAULT, input]));
  assert.deepEqual(result.current, input);
  assert.equal(result.mode, "seat");
  assert.equal(result.saved.length, 2);
});
test("comparison is deduplicated and limited to three", () => {
  let saved = [DEFAULT];
  saved = addSaved(saved, DEFAULT);
  assert.equal(saved.length, 1);
  for (let i = 1; i < 7; i++)
    saved = addSaved(saved, { stand: "A", row: i, seat: 2 });
  assert.equal(saved.length, 3);
  assert.equal(
    readUrl("?compare=C:1:1,C:1:1,A:2:2,E:3:3,B:4:4").saved.length,
    3,
  );
});
test("row and lateral changes alter the real camera coordinates", () => {
  const low = seatPosition({ ...DEFAULT, row: 2 }),
    high = seatPosition({ ...DEFAULT, row: 18 }),
    left = seatPosition({ ...DEFAULT, seat: 1 }),
    right = seatPosition({ ...DEFAULT, seat: 36 });
  assert.ok(high[1] > low[1]);
  assert.notEqual(high[2], low[2]);
  assert.ok(Math.abs(right[0] - left[0]) > 30);
});
test("entry starts seated while explicit overview links keep their mode", () => {
  assert.equal(readUrl("").mode, "seat");
  assert.equal(readUrl("?view=overview").mode, "overview");
  assert.equal(readUrl("?view=stand").mode, "stand");
});
