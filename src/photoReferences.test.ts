import { test } from "node:test";
import assert from "node:assert/strict";
import { referencesFor, spectatorReferences } from "./photoReferences";
test("photo references keep source year separate from the current planning season", () => {
  assert.equal(
    referencesFor("qatar", "north", "area", "all", "2026").length,
    0,
  );
  assert.equal(
    referencesFor("bahrain", "main", "area", "all", "2026").length,
    0,
  );
  const older = referencesFor("qatar", "t2", "area", "photos", "2024");
  assert.equal(older.length, 1);
  assert.match(older[0].yearEvidence, /inferred/);
  assert.ok(
    referencesFor("qatar", "north", "area", "photos", "2025").every(
      (r) => r.year === 2025,
    ),
  );
});
test("different grandstands and venue-wide reports never become selected-area matches", () => {
  assert.equal(referencesFor("qatar", "t16", "area").length, 0);
  assert.equal(referencesFor("bahrain", "beyon", "area").length, 0);
  assert.ok(referencesFor("bahrain", "beyon", "venue").length > 0);
  assert.ok(
    referencesFor("bahrain", "university", "area").every(
      (r) => !r.location.includes("certified"),
    ),
  );
  assert.deepEqual(referencesFor("las-vegas", "main", "area"), []);
  assert.equal(referencesFor("las-vegas", "sphere", "area").length, 1);
});
test("curated references retain provenance, safe source links and bounded supported embeds", () => {
  const ids = new Set<string>();
  const hosts = new Set([
    "www.reddit.com",
    "www.team-bhp.com",
    "gpdestinations.com",
    "youtu.be",
  ]);
  for (const r of spectatorReferences) {
    assert.ok(!ids.has(r.id));
    ids.add(r.id);
    const u = new URL(r.url);
    assert.equal(u.protocol, "https:");
    assert.ok(hosts.has(u.hostname));
    assert.equal(u.search, "");
    assert.ok(
      r.author && r.publisher && r.yearEvidence && r.location && r.expectation,
    );
    assert.match(r.checked, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(
      ["section-reported", "grandstand-reported", "venue-only"].includes(
        r.match,
      ),
    );
    if (r.embed?.type === "reddit") {
      assert.equal(u.hostname, "www.reddit.com");
      assert.ok(u.pathname.includes("/comments/" + r.embed.postId + "/"));
      assert.match(r.embed.postId, /^[a-z0-9]+$/);
      assert.match(r.embed.community, /^[A-Za-z0-9_]+$/);
      assert.ok(r.embed.author);
    }
    if (r.embed?.type === "youtube")
      assert.match(r.embed.videoId, /^[A-Za-z0-9_-]{11}$/);
  }
  const main = referencesFor("bahrain", "main", "area", "photos")[0];
  assert.equal(main.author, "Omkar");
  assert.match(main.location, /E1/);
  assert.match(main.expectation, /do not correspond/);
});


test('new Yas scene has an honest empty reference collection without venue fallback',()=>{
 assert.deepEqual(referencesFor('united-arab-emirates','main','area'),[]);
 assert.deepEqual(referencesFor('united-arab-emirates','main','venue'),[]);
});

test('Silverstone source references never imply exact or future seat calibration',()=>{
 const video=referencesFor('great-britain','copse-c','area','photos','2025');assert.equal(video.length,1);assert.equal(video[0].author,'Race Experience');assert.match(video[0].publisher,/travel publisher/);assert.equal(video[0].embed?.type,'youtube');
 assert.equal(referencesFor('great-britain','copse-a','area','photos').length,0);assert.equal(referencesFor('great-britain','becketts','area','review').length,1);assert.equal(referencesFor('great-britain','vale','area','review').length,1);assert.equal(referencesFor('great-britain','vale','area','all','2026').length,0);
});


test('Monza has no borrowed attendee references from another circuit',()=>{
 assert.deepEqual(referencesFor('italy','1','area'),[]);assert.equal(referencesFor('italy','1','venue').length,2);assert.deepEqual(referencesFor('italy','13','area'),[]);
 const photo=referencesFor('italy','12','area','photos','2025');assert.equal(photo.length,1);assert.equal(photo[0].published,'2026-04-19');assert.equal(photo[0].embed?.type,'youtube');assert.match(photo[0].yearEvidence,/not the upload year/);assert.match(photo[0].expectation,/no model row/);assert.equal(referencesFor('italy','12','area','review','2025').length,1);assert.deepEqual(referencesFor('italy','12','area','all','2026'),[]);
});
