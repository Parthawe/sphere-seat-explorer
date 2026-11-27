export const SITE_NAME = "F1 Tickets Online";
export const SITE_ORIGIN = "https://f1tickets.online";

export function publicPageUrl(search: string) {
  const url = new URL(SITE_ORIGIN + "/");
  const params = new URLSearchParams(search);
  for (const key of ["season", "race", "screen", "area", "venue", "bank", "section", "modelRow", "position", "seat", "view", "camera", "compare",
    "sample", "height", "side", "sphereLevel", "sphereSection", "sphereRow", "sphereSeat", "sphereView", "sphereLevels"]) {
    const value = params.get(key);
    if (value) url.searchParams.set(key, value);
  }
  return url.href;
}

export function syncPublicUrlMetadata() {
  const url = publicPageUrl(location.search);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
}
