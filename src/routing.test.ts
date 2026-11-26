import { test } from "node:test";
import assert from "node:assert/strict";
import { readRoute } from "./routing";

test("a different race cannot inherit the Las Vegas scene from a malformed link", () => {
  for (const query of ["screen=seats", "screen=vegas", "seat=A:2:3", "view=seat"]) {
    const route = readRoute(`?season=2026&race=qatar&${query}`);
    assert.equal(route.race, "qatar");
    assert.equal(route.seats, false);
    assert.equal(route.atlas, false);
    assert.ok(route.issue);
  }
});

test("legacy Vegas links keep their venue while circuit links retain their own model", () => {
  assert.equal(readRoute("?seat=A:2:3").race, "las-vegas");
  assert.equal(readRoute("?seat=A:2:3").seats, true);
  const route = readRoute("?season=2027&race=bahrain&screen=circuit&view=seat");
  assert.equal(route.circuit, true);
  assert.equal(route.seats, false);
  assert.equal(route.season, 2027);
});

test("unknown race identity is retained for a clear not-found state", () => {
  assert.equal(readRoute("?race=unknown").race, "unknown");
  assert.ok(readRoute("?season=2099").issue);
  assert.equal(readRoute("?season=2099&screen=vegas").atlas, false);
  assert.ok(readRoute("?race=qatar&screen=unknown").issue);
});
