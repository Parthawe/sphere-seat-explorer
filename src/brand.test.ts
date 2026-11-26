import { test } from "node:test";
import assert from "node:assert/strict";
import { publicPageUrl } from "./brand";

test("public page metadata keeps model coordinates while excluding unrelated ticket and tracking fields", () => {
  const url = new URL(publicPageUrl("?season=2027&race=las-vegas&venue=sphere&sphereLevel=400&sphereRow=21&ticket=PRIVATE&utm_source=tracker"));
  assert.equal(url.origin, "https://f1tickets.online");
  assert.equal(url.searchParams.get("sphereRow"), "21");
  assert.equal(url.searchParams.get("ticket"), null);
  assert.equal(url.searchParams.get("utm_source"), null);
});
