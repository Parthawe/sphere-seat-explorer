import { test } from "node:test";
import assert from "node:assert/strict";
import {
  abuAreas,
  locateAbuTicket,
  abuShareUrl,
  yasGeometry,
} from "./abuDhabi";
test("longer product names do not fall through to nearby grandstands", () => {
  assert.deepEqual(locateAbuTicket("North Straight Grandstand").ids, [
    "north-straight",
  ]);
  assert.deepEqual(locateAbuTicket("Grandstand West-Straight").ids, [
    "west-straight",
  ]);
  assert.deepEqual(locateAbuTicket("North Grandstand").ids, ["north"]);
  assert.deepEqual(locateAbuTicket("West Grandstand").ids, ["west"]);
});
test("venue name does not falsely imply Marina Grandstand", () => {
  assert.deepEqual(
    locateAbuTicket("Yas Marina Circuit 2026 Main Grandstand Row 12 Seat 18")
      .ids,
    ["main"],
  );
  assert.deepEqual(locateAbuTicket("Marina Grandstand").ids, ["marina"]);
});
test("keeps section and seat as text without deriving a chair coordinate", () => {
  assert.deepEqual(
    locateAbuTicket("North Straight Grandstand, Section A, Row 12, Seat 18"),
    {
      status: "matched",
      ids: ["north-straight"],
      section: "A",
      row: "12",
      seat: "18",
    },
  );
  assert.equal(locateAbuTicket("South Grandstand Seat 2027").status, "matched");
});
test("conflicting names, wrong event/year and unsupported variants stay explicit", () => {
  assert.equal(
    locateAbuTicket("West Straight Grandstand / West Grandstand").status,
    "ambiguous",
  );
  for (const raw of [
    "Qatar 2026 Main Grandstand",
    "2027 South Grandstand",
    "Lusail North",
  ])
    assert.equal(locateAbuTicket(raw).status, "wrong-event", raw);
  for (const raw of [
    "North Straight Grandstand Club",
    "West Grandstand Suite",
    "Main Grandstand hospitality",
    "Abu Dhabi Hill",
    "Row 12 Seat 18",
    "Section A",
    "Concert ticket",
  ])
    assert.equal(locateAbuTicket(raw).status, "unknown", raw);
});
test("share includes public race identity and removes unrelated private query/hash", () => {
  const url = new URL(
    abuShareUrl(
      "https://example.com/?ticket=PRIVATE&season=2027#PRIVATE",
      "south",
    ),
  );
  assert.equal(url.search, "?season=2026&race=united-arab-emirates&area=south");
  assert.equal(url.hash, "");
});
test("Yas track is closed and stands retain explicit evidence and 2026 product sources", () => {
  assert.deepEqual(yasGeometry.points[0], yasGeometry.points.at(-1));
  assert.equal(yasGeometry.stand_anchors.length, 4);
  assert.equal(abuAreas.length, 7);
  for (const a of abuAreas) {
    assert.match(
      a.source,
      /^https:\/\/www\.abudhabigp\.com\/en\/formula1\/tickets-2026\/[\w-]+-4day$/,
    );
    assert.equal(a.point.length, 2);
    assert.ok(a.point.every(Number.isFinite));
    assert.ok(
      a.confidence === "OSM stand anchor" ||
        a.confidence === "Estimated region",
    );
  }
});
