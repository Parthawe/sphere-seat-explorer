import { test } from "node:test";
import assert from "node:assert/strict";
import {
  venueRegistry,
  findVenue,
  requireVenue,
  comparisonStorageKey,
  venueAreaUrl,
} from "./venueRegistry";
import { sanitizeComparison, toggleComparison } from "./comparisonState";
test("event/year lookup cannot borrow another season or circuit", () => {
  assert.equal(findVenue(2026, "qatar")?.id, "qatar");
  assert.equal(findVenue(2026, "united-arab-emirates")?.id, "abu-dhabi");
  assert.equal(findVenue(2027, "qatar"), undefined);
  assert.equal(findVenue(2027, "united-arab-emirates"), undefined);
  assert.equal(findVenue(2026, "singapore"), undefined);
  assert.throws(() => requireVenue("qatar", 2027));
});
test("registry preserves separate geometry, source provenance and coverage limits", () => {
  assert.notDeepEqual(
    venueRegistry[0].geography.points,
    venueRegistry[1].geography.points,
  );
  for (const v of venueRegistry) {
    assert.deepEqual(v.geography.points[0], v.geography.points.at(-1));
    assert.equal(v.geography.licence, "ODbL-1.0");
    assert.equal(v.coverage.exactSeats, false);
    assert.equal(v.coverage.seat3d, false);
    assert.equal(new Set(v.areas.map((a) => a.id)).size, v.areas.length);
    for (const a of v.areas) {
      assert.ok(a.point.every(Number.isFinite));
      assert.ok(a.confidence);
      assert.equal(new URL(a.source).protocol, "https:");
    }
  }
});
test("stored comparison sanitizes corrupt, duplicate, private and unsupported values", () => {
  const allowed = ["main", "north", "west", "marina"];
  assert.deepEqual(
    sanitizeComparison(
      [
        "main",
        "main",
        null,
        { seat: 12 },
        "PRIVATE",
        "north",
        "west",
        "marina",
      ],
      allowed,
    ),
    ["main", "north", "west"],
  );
  assert.deepEqual(sanitizeComparison({ ticket: "PRIVATE" }, allowed), []);
});
test("comparison removes at capacity and rejects a fourth or unsupported area", () => {
  const allowed = ["main", "north", "west", "marina"];
  assert.deepEqual(
    toggleComparison(["main", "north", "west"], "marina", allowed),
    { ids: ["main", "north", "west"], full: true },
  );
  assert.deepEqual(
    toggleComparison(["main", "north", "west"], "north", allowed),
    { ids: ["main", "west"], full: false },
  );
  assert.deepEqual(toggleComparison(["main"], "PRIVATE", allowed), {
    ids: ["main"],
    full: false,
  });
});
test("keys retain Qatar legacy storage while separating Abu Dhabi and future seasons", () => {
  assert.equal(
    comparisonStorageKey(requireVenue("qatar", 2026)),
    "apex-qatar-2026-areas",
  );
  assert.equal(
    comparisonStorageKey(requireVenue("abu-dhabi", 2026)),
    "apex-abu-dhabi-2026-areas",
  );
  assert.notEqual(
    comparisonStorageKey({ id: "qatar", season: 2026 }),
    comparisonStorageKey({ id: "qatar", season: 2027 }),
  );
});
test("both venue share URLs remove private query and fragment data", () => {
  for (const v of venueRegistry) {
    const url = new URL(
      venueAreaUrl("https://example.com/?ticket=PRIVATE#PRIVATE", v, "main"),
    );
    assert.equal(url.hash, "");
    assert.deepEqual([...url.searchParams.keys()], ["season", "race", "area"]);
    assert.equal(url.searchParams.get("race"), v.raceSlug);
    assert.throws(() => venueAreaUrl(url.href, v, "PRIVATE"));
  }
});
