import { test } from "node:test";
import assert from "node:assert/strict";
import { calendars } from "./races";
import { circuitGuides, circuitGuideFor, circuitGuideSource, circuitTicketSource, matchesCircuitSearch, circuitPublishedLength } from "./circuitGuides";

test("every published race has exactly one guide bound to its season and venue", () => {
  for (const race of Object.values(calendars).flat()) {
    const matches = circuitGuides.filter(g => g.race === race.slug && g.seasons.includes(race.season));
    assert.equal(matches.length, 1, `${race.season} ${race.slug}`);
    const guide = matches[0];
    assert.ok(guide.venue && guide.location && guide.overview && guide.ticketCheck && guide.arrivalCheck);
    assert.ok(guide.viewing.length >= 2);
    assert.equal(typeof circuitPublishedLength(guide), "number");
    assert.equal(new URL(circuitGuideSource(guide)).hostname, "www.formula1.com");
    assert.ok(circuitGuideSource(guide).includes(`/${guide.referenceSeason}/`));
    if (race.season === 2026) assert.equal(circuitTicketSource(guide, race.season), undefined);
  }
  assert.equal(circuitGuides.length, 27);
  assert.equal(new Set(circuitGuides.map(g => g.id)).size, 27);
});

test("Sepang and Sakhir never inherit each other's travel, ticket source or circuit identity", () => {
  const sepang = circuitGuideFor(2026, "bahrain")!, sakhir = circuitGuideFor(2027, "bahrain")!;
  assert.equal(sepang.id, "sepang-2026");
  assert.match(sepang.location, /Malaysia/);
  assert.equal(circuitTicketSource(sepang, 2026), undefined);
  assert.equal(sakhir.id, "sakhir");
  assert.match(sakhir.location, /Sakhir/);
  assert.equal(circuitTicketSource(sakhir, 2027), "https://ticketing.formula1.com/bahrain/");
});

test("calendar boundaries and non-matching ticket slugs remain explicit", () => {
  assert.equal(circuitGuideFor(2027, "netherlands"), undefined);
  assert.equal(circuitGuideFor(2027, "barcelona-catalunya"), undefined);
  assert.equal(circuitGuideFor(2026, "portugal"), undefined);
  assert.equal(circuitGuideFor(2026, "turkey"), undefined);
  assert.equal(circuitGuideFor(2099, "qatar"), undefined);
  assert.equal(circuitTicketSource(circuitGuideFor(2027, "spain")!, 2027), "https://ticketing.formula1.com/madrid-spain/");
  assert.equal(circuitTicketSource(circuitGuideFor(2027, "turkey")!, 2027), "https://ticketing.formula1.com/turkiye/");
  assert.equal(circuitTicketSource(circuitGuideFor(2027, "united-states")!, 2027), "https://ticketing.formula1.com/austin/");
});

test("search finds circuit identities and cities without requiring accents", () => {
  for (const [query, slug] of [["COTA", "united-states"], ["Monza", "italy"], ["Silverstone", "great-britain"], ["Sao Paulo", "brazil"], ["Portimao", "portugal"]]) {
    assert.ok(calendars[2027].filter(race => matchesCircuitSearch(race, query)).some(race => race.slug === slug));
  }
  assert.equal(calendars[2027].filter(race => matchesCircuitSearch(race, "no-such-circuit")).length, 0);
});
