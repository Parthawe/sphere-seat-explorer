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
  partySeats,
  stands,
  key,
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

test("groups remain contiguous within one modeled seating bank", () => {
  for (const stand of stands)
    for (let seat = 1; seat <= stand.seats; seat++)
      for (let party = 1; party <= 4; party++) {
        const group = partySeats({ stand: stand.id, row: 12, seat, party });
        assert.equal(group.length, party);
        assert.ok(group.includes(seat));
        assert.ok(
          group.every(
            (n, i) =>
              n >= 1 && n <= stand.seats && (!i || n === group[i - 1] + 1),
          ),
        );
        assert.equal(
          group[0] <= stand.seats / 2,
          group.at(-1)! <= stand.seats / 2,
        );
      }
  assert.deepEqual(partySeats({ ...DEFAULT, party: 2 }), [17, 18]);
  assert.deepEqual(partySeats({ ...DEFAULT, seat: 19, party: 2 }), [19, 20]);
});
test("group plans round trip without breaking legacy seat links", () => {
  const group = { ...DEFAULT, party: 4 };
  assert.deepEqual(decode(key(DEFAULT)), DEFAULT);
  assert.deepEqual(
    readUrl(makeSearch(group, "stand", [DEFAULT, group])).saved,
    [DEFAULT, group],
  );
  assert.deepEqual(readUrl(makeSearch(group, "seat", [])).current, group);
  assert.equal(addSaved([DEFAULT], group).length, 2);
  for (const invalid of [
    "C:12:18:0",
    "C:12:18:5",
    "C:12:18:2:3",
    "C:12:18:NaN",
  ])
    assert.equal(decode(invalid), null);
});

test("published seasons have complete, ordered and unique race weekends", async () => {
  const { calendars } = await import("./races");
  for (const year of [2026, 2027] as const) {
    const races = calendars[year];
    assert.equal(races.length, year === 2026 ? 23 : 24);
    assert.equal(new Set(races.map((r) => r.slug)).size, races.length);
    races.forEach((r, i) => {
      assert.equal(r.round, i + 1);
      assert.equal(r.season, year);
      assert.ok(r.start <= r.end);
      assert.equal(new Date(r.end).getFullYear(), year);
      if (i) assert.ok(r.start > races[i - 1].end);
    });
  }
});
test("race status respects the whole local weekend and cross-month dates", async () => {
  const { calendars, raceStatus, dateLabel } = await import("./races");
  const mexico = calendars[2026].find((r) => r.slug === "mexico")!;
  assert.equal(raceStatus(mexico, "2026-10-29"), "Upcoming");
  assert.equal(raceStatus(mexico, "2026-10-30"), "Race weekend");
  assert.equal(raceStatus(mexico, "2026-11-01"), "Race weekend");
  assert.equal(raceStatus(mexico, "2026-11-02"), "Past");
  assert.equal(dateLabel(mexico), "30 Oct – 1 Nov");
});
test("Sphere cap is grounded and matches the published exterior envelope", async () => {
  const { SPHERE } = await import("./model");
  const { SphereGeometry } = await import("three");
  const geometry = new SphereGeometry(
    SPHERE.radius,
    160,
    100,
    0,
    Math.PI * 2,
    0,
    SPHERE.thetaLength,
  );
  geometry.translate(0, SPHERE.centerY, 0);
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  assert.ok(Math.abs(box.min.y) < 0.001);
  assert.ok(Math.abs(box.max.y - 111.5568) < 0.001);
  assert.ok(Math.abs(box.max.x - box.min.x - 157.2768) < 0.03);
  geometry.dispose();
});
