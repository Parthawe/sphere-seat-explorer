import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseSourceSnapshot } from "./sourceSnapshot";

const fixture = JSON.parse(readFileSync(new URL("../public/data/ticket-sources.json", import.meta.url), "utf8"));
test("the published source snapshot has readable dated records", () => {
  assert.equal(parseSourceSnapshot(fixture).sources.length, fixture.sources.length);
});
test("malformed snapshots, duplicate records, unsafe URLs and invalid prices cannot reach the ticket desk", () => {
  for (const value of [null, {}, { ...fixture, sources: {} }, { ...fixture, checkedAt: "bad-date" }])
    assert.throws(() => parseSourceSnapshot(value));
  for (const change of [{ url: "javascript:alert(1)" }, { price: -1 }, { price: "2000" }, { note: null }, { title: {} }])
    assert.throws(() => parseSourceSnapshot({ ...fixture, sources: [{ ...fixture.sources[0], ...change }] }));
  assert.throws(() => parseSourceSnapshot({ ...fixture, sources: [fixture.sources[0], fixture.sources[0]] }));
});
