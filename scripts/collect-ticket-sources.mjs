/** Public metadata only. No sessions, private tickets, checkout automation or anti-bot bypass. */
import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
export const sources = [
  ["main", "https://www.lcsc.qa/ticket/main-grandstand-3-day"],
  ["north", "https://www.lcsc.qa/ticket/north-grandstand-3-day"],
  ["t2", "https://www.lcsc.qa/ticket/t2-grandstand-3-day"],
  ["t16", "https://www.lcsc.qa/ticket/t16-grandstand-3-day"],
  ["hill", "https://www.lcsc.qa/ticket/general-admission-lusail-hill-3-day"],
  ["f1", "https://tickets.formula1.com/en/f1-56257-qatar"],
  ["experiences", "https://f1experiences.com/2026-qatar-grand-prix"],
];
const agent =
  "ApexAtlas/1.0 (+https://github.com/Parthawe/sphere-seat-explorer)";
const clean = (s) =>
  s
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
export function parseProduct(html, url) {
  const text = clean(html),
    title = clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  // Scope price extraction to organizer product pages and their Ticket Info block.
  // Other stores contain cross-event recommendations, so never extract their generic prices.
  const organizer =
    new URL(url).hostname === "www.lcsc.qa" &&
    new URL(url).pathname.startsWith("/ticket/");
  const block = text.match(
    /Ticket Info\s+Price:\s*([\d,]+(?:\.\d+)?)\s*QAR\s+Date:\s*27 Nov 2026\s*-\s*29 Nov 2026/i,
  );
  const price =
    organizer && block ? Number(block[1].replaceAll(",", "")) : undefined;
  return {
    title,
    ...(price
      ? {
          price,
          currency: "QAR",
          duration: "3 days",
          note: "Published reference price; final total and availability must be checked with the seller.",
        }
      : {
          note: "Public page checked; live stock and prices are unavailable in this snapshot.",
        }),
  };
}
// robots.txt uses longest matching path; fail closed when robots cannot be checked.
export function robotsAllowed(body, path) {
  const groups = [];
  let group = null,
    hasRules = false;
  for (const line of body.split(/\r?\n/)) {
    const m = line
      .replace(/#.*/, "")
      .trim()
      .match(/^(user-agent|allow|disallow)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase(),
      value = m[2].trim();
    if (key === "user-agent") {
      if (!group || hasRules) {
        group = { agents: [], rules: [] };
        groups.push(group);
        hasRules = false;
      }
      group.agents.push(value.toLowerCase());
    } else if (group) {
      hasRules = true;
      if (value) group.rules.push({ allow: key === "allow", path: value });
    }
  }
  const specific = groups.filter((g) =>
    g.agents.some((a) => a !== "*" && "apexatlas".includes(a)),
  );
  const selected = specific.length
    ? specific
    : groups.filter((g) => g.agents.includes("*"));
  const rules = selected
    .flatMap((g) => g.rules)
    .filter((r) =>
      new RegExp(
        "^" +
          r.path
            .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
            .replaceAll("*", ".*")
            .replace(/\\\$$/, "$"),
      ).test(path),
    )
    .sort(
      (a, b) =>
        b.path.length - a.path.length || Number(b.allow) - Number(a.allow),
    );
  return rules[0]?.allow ?? true;
}
async function get(url) {
  return fetch(url, {
    headers: { "User-Agent": agent, Accept: "text/html,text/plain" },
    signal: AbortSignal.timeout(18000),
    redirect: "error",
  });
}
export async function collect() {
  const robots = new Map(),
    out = [];
  for (const [id, url] of sources) {
    const checkedAt = new Date().toISOString(),
      entry = { id, url, checkedAt };
    try {
      const u = new URL(url);
      if (!robots.has(u.origin)) {
        const r = await get(u.origin + "/robots.txt");
        robots.set(
          u.origin,
          r.status === 404 ? "" : r.ok ? await r.text() : null,
        );
      }
      const rules = robots.get(u.origin);
      if (rules === null || !robotsAllowed(rules, u.pathname + u.search)) {
        out.push({
          ...entry,
          status: "robots-restricted",
          note: "Collection skipped under the site’s robots policy or because it could not be checked.",
        });
        continue;
      }
      const r = await get(url);
      if (!r.ok) {
        out.push({
          ...entry,
          status: "unavailable",
          note: `Public request returned HTTP ${r.status}; no inventory inferred.`,
        });
        continue;
      }
      const html = await r.text();
      if (/captcha|cf-chl-|verify you are human/i.test(html)) {
        out.push({
          ...entry,
          status: "blocked",
          note: "Automated access was blocked. Visit the provider directly.",
        });
        continue;
      }
      const parsed = parseProduct(html, url);
      out.push({
        ...entry,
        status: parsed.price ? "reference-price" : "metadata-only",
        ...parsed,
      });
    } catch {
      out.push({
        ...entry,
        status: "unavailable",
        note: "Public source could not be read. Existing reference information is not live inventory.",
      });
    }
    await new Promise((r) => setTimeout(r, 900));
  }
  const snapshot = { checkedAt: new Date().toISOString(), sources: out };
  await writeFile(
    new URL("../public/data/ticket-sources.json", import.meta.url),
    JSON.stringify(snapshot, null, 2) + "\n",
  );
  console.log(
    JSON.stringify(out.map(({ id, status, price }) => ({ id, status, price }))),
  );
  return snapshot;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await collect();
