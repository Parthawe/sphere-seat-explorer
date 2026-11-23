import { test } from "node:test";
import assert from "node:assert/strict";
import { singaporeAreas, locateSingaporeTicket } from "./singapore";
import { findVenue, venueAreaUrl, comparisonStorageKey } from "./venueRegistry";
test("Singapore products bind to 2027 while 2026 remains unsupported", () => {
  const venue = findVenue(2027, "singapore")!;
  assert.equal(venue.circuitId, "marina-bay");
  assert.equal(venue.areas.length, 12);
  assert.equal(findVenue(2026, "singapore"), undefined);
  assert.equal(venue.map.roadStroke, 6);
  assert.deepEqual(venue.geography.points[0], venue.geography.points.at(-1));
  assert.equal(comparisonStorageKey(venue), "apex-singapore-2027-areas");
  assert.equal(
    new URL(
      venueAreaUrl("https://example.com/?private=1#private", venue, "padang"),
    ).search,
    "?season=2027&race=singapore&area=padang",
  );
});
test("twelve standard stand names resolve without claiming chair coordinates", () => {
  for (const area of singaporeAreas) {
    assert.deepEqual(locateSingaporeTicket(area.name).ids, [area.id]);
    assert.match(
      area.source,
      /^https:\/\/singaporegp\.sg\/en\/tickets\/general-tickets\/grandstands\/[a-z0-9-]+\/$/,
    );
    assert.ok(area.access);
  }
  assert.deepEqual(
    locateSingaporeTicket(
      "Singapore 2027 Padang Grandstand Section A Row 12 Seat 18",
    ),
    { status: "matched", ids: ["padang"], section: "A", row: "12", seat: "18" },
  );
});
test("variants do not fall through to standard Pit or Turn names", () => {
  for (const raw of [
    "Super Pit Grandstand",
    "SuperPit",
    "Super-Pit Grandstand",
    "Pit Exit Grandstand",
    "Pit-Exit Grandstand",
    "Chicane @ Turn 2",
    "Turn 1 Combination",
    "Turn 1 Combo",
    "Premier Walkabout",
    "Turn 1 wheelchair platform",
  ])
    assert.equal(locateSingaporeTicket(raw).status, "unknown", raw);
  assert.equal(locateSingaporeTicket("Turn 19").status, "unknown");
  assert.equal(
    locateSingaporeTicket("Zone 4 Row 12 Seat 18").status,
    "unknown",
  );
});
test("wrong event/year and multiple areas stay explicit", () => {
  for (const raw of [
    "2026 Pit Grandstand",
    "Qatar 2027 Turn 1",
    "Abu Dhabi 2027 Pit",
  ])
    assert.equal(locateSingaporeTicket(raw).status, "wrong-event", raw);
  assert.equal(
    locateSingaporeTicket("Padang or Connaught").status,
    "ambiguous",
  );
  assert.equal(locateSingaporeTicket("Turn 1 / Turn 2").status, "ambiguous");
  assert.equal(
    locateSingaporeTicket("Pit Grandstand Seat 2026").status,
    "matched",
  );
});


test("new standard products retain published access and separate identities", () => {
  const expected: Record<string,string> = {"marina-bay":"1, 2, 3, 4",bayfront:"1, 2, 3, 4",promenade:"1, 2, 3, 4",raffles:"1, 2, 3, 4",empress:"4",stamford:"4"};
  for (const [id,zones] of Object.entries(expected)) {
    const area = singaporeAreas.find(a=>a.id===id)!;
    assert.equal(area.zones,zones);
    assert.equal(locateSingaporeTicket(`Singapore 2027 ${area.name} Row 2026 Seat 17`).status,"matched");
    assert.equal(locateSingaporeTicket(`${area.name} combination`).status,"unknown");
  }
  assert.equal(locateSingaporeTicket("Marina Bay circuit Row 12 Seat 9").status,"unknown");
  assert.deepEqual(locateSingaporeTicket("Marina Bay 2027 Pit Grandstand").ids,["pit"]);
  assert.equal(locateSingaporeTicket("Bay Grandstand").status,"unknown");
  assert.equal(locateSingaporeTicket("Raffles / Republic").status,"ambiguous");
  assert.equal(locateSingaporeTicket("Promenade or Marina Bay Grandstand").status,"ambiguous");
});
