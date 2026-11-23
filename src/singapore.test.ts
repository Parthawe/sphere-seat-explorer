import { test } from "node:test";
import assert from "node:assert/strict";
import { singaporeAreas, locateSingaporeTicket } from "./singapore";
import { findVenue, venueAreaUrl, comparisonStorageKey } from "./venueRegistry";
test("Singapore products bind to 2027 while 2026 remains unsupported", () => {
  const venue = findVenue(2027, "singapore")!;
  assert.equal(venue.circuitId, "marina-bay");
  assert.equal(venue.areas.length, 15);
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
test("all fifteen grandstand product names resolve without claiming chair coordinates", () => {
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
test("unsupported multi-area and access products remain unknown", () => {
  for (const raw of [
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


test("supported variants resolve separately and preserve ambiguous combinations",()=>{
 for(const raw of ["SuperPit", "Super Pit Grandstand", "Super-Pit Grandstand"])assert.deepEqual(locateSingaporeTicket(raw).ids,["super-pit"]);
 for(const raw of ["Pit Exit Grandstand", "Pit-Exit"])assert.deepEqual(locateSingaporeTicket(raw).ids,["pit-exit"]);
 for(const raw of ["Chicane @ Turn 2", "Chicane at Turn 2 Grandstand", "Chicane T2"])assert.deepEqual(locateSingaporeTicket(raw).ids,["chicane"]);
 for(const raw of ["Chicane", "Chicane at Turn 1"])assert.equal(locateSingaporeTicket(raw).status,"unknown");
 for(const raw of ["Super Pit or Pit Grandstand", "Pit Exit / Pit Grandstand", "Chicane @ Turn 2 or Turn 2 Grandstand"])assert.equal(locateSingaporeTicket(raw).status,"ambiguous");
 assert.equal(locateSingaporeTicket("Chicane @ Turn 2 Combination").status,"unknown");
 for(const id of ["super-pit","pit-exit","chicane"]){const a=singaporeAreas.find(a=>a.id===id)!;assert.equal(a.zones,"1, 2, 3, 4");assert.equal(locateSingaporeTicket("2026 "+a.name).status,"wrong-event");}
 assert.equal(singaporeAreas.find(a=>a.id==='chicane')!.source,"https://singaporegp.sg/en/tickets/general-tickets/grandstands/chicane-grandstand-turn-2/");
 assert.deepEqual(singaporeAreas.find(a=>a.id==='super-pit')!.point,singaporeAreas.find(a=>a.id==='pit')!.point);
});
