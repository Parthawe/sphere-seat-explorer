import { test } from "node:test";
import assert from "node:assert/strict";
import { areas, locateTicket, providerUrl, providers } from "./ticketing";
// These exercise uncertainty boundaries, not just happy-path string matching.
test("recognizes assigned Main details without deriving a chair coordinate", () => {
  assert.deepEqual(
    locateTicket("Qatar 2026 Main Grandstand, Zone A/B, Row 12, Seat 18"),
    { status: "matched", ids: ["main"], zone: "A/B", row: "12", seat: "18" },
  );
});
test("matches official naming variations", () => {
  for (const [s, id] of [
    ["Grandstand Main", "main"],
    ["North Grandstand", "north"],
    ["Turn 02", "t2"],
    ["T 16", "t16"],
    ["General Admission Lusail Hill", "hill"],
  ])
    assert.deepEqual(locateTicket(s).ids, [id]);
});
test("conflicting named areas require a choice", () => {
  assert.equal(
    locateTicket("Main Grandstand or North Grandstand").status,
    "ambiguous",
  );
  assert.equal(locateTicket("T2 / T16").ids.length, 2);
});
test("row, seat, zone and unsupported hospitality cannot imply a stand", () => {
  for (const s of [
    "Row 12 Seat 18",
    "Zone A/B",
    "T3 grandstand",
    "Lusail Hill Lounge",
    "Champions Club",
    "",
  ])
    assert.equal(locateTicket(s).status, "unknown", s);
});
test("other race and season are not resolved against Qatar 2026", () => {
  for (const s of [
    "Main Grandstand Qatar 2027",
    "Las Vegas Main Grandstand 2026",
    "Abu Dhabi North Grandstand",
    "2025 T2",
  ])
    assert.equal(locateTicket(s).status, "wrong-event");
});
test("numeric seat is not mistaken for a season", () =>
  assert.equal(locateTicket("Main Grandstand Seat 2027").status, "matched"));
test("provider links are HTTPS and retain Qatar 2026 event identity", () => {
  for (const p of providers)
    for (const a of areas)
      assert.equal(new URL(providerUrl(p.id, a.id)).protocol, "https:");
  assert.match(
    providerUrl("f1", "main"),
    /f1-56257-qatar\/16887-main-grandstand$/,
  );
  assert.match(
    providerUrl("lusail", "t2"),
    /lcsc.qa\/ticket\/t2-grandstand-3-day$/,
  );
});
