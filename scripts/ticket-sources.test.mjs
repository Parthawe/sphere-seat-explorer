import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProduct, robotsAllowed } from "./collect-ticket-sources.mjs";
const page =
  "<title>Main Grandstand</title><h2>Ticket Info</h2><div>Price: 2000 QAR Date: 27 Nov 2026 - 29 Nov 2026</div><p>Another event 500 EUR</p>";
test("extracts an exact current organizer product block only", () => {
  assert.equal(
    parseProduct(page, "https://www.lcsc.qa/ticket/main-grandstand-3-day")
      .price,
    2000,
  );
  assert.equal(
    parseProduct(
      page.replaceAll("2026", "2027"),
      "https://www.lcsc.qa/ticket/main-grandstand-3-day",
    ).price,
    undefined,
  );
  assert.equal(
    parseProduct(page, "https://tickets.formula1.com/en/f1-56257-qatar").price,
    undefined,
  );
});
test("does not take recommended event prices or hidden error text as inventory", () => {
  assert.equal(
    parseProduct(
      "<title>Qatar</title>Price: 500 QAR Other event Date: 27 Nov 2026 - 29 Nov 2026",
      "https://www.lcsc.qa/ticket/main-grandstand-3-day",
    ).price,
    undefined,
  );
  assert.equal(
    parseProduct(
      page + " Sold out Error unavailable",
      "https://www.lcsc.qa/ticket/main-grandstand-3-day",
    ).availability,
    undefined,
  );
});
test("robots disallow, exceptions, agent specificity and wildcards", () => {
  assert.equal(
    robotsAllowed("User-agent: *\nDisallow: /", "/ticket/main"),
    false,
  );
  assert.equal(
    robotsAllowed(
      "User-agent: *\nDisallow: /ticket/\nAllow: /ticket/main",
      "/ticket/main",
    ),
    true,
  );
  assert.equal(
    robotsAllowed(
      "User-agent: BadBot\nDisallow: /\nUser-agent: *\nDisallow: /admin/",
      "/ticket/main",
    ),
    true,
  );
  assert.equal(
    robotsAllowed(
      "User-agent: *\nDisallow: /\nUser-agent: F1TicketsOnline\nAllow: /",
      "/ticket/main",
    ),
    true,
  );
  assert.equal(
    robotsAllowed("User-agent: *\nDisallow: /ticket/*", "/ticket/main"),
    false,
  );
});
