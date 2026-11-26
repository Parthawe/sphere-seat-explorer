import { useEffect } from "react";

/** Wait for the asynchronous page above an anchor before moving to it. */
export function useHashTarget(route: object) {
  useEffect(() => {
    if (!location.hash) return;
    let id: string;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    let frame = 0, active = true, done = false;
    const attempt = () => {
      if (!active || done || document.fonts.status !== "loaded") return;
      const target = document.getElementById(id);
      if (!target || document.querySelector('.hub-loading')) return;
      done = true;
      observer.disconnect();
      frame = requestAnimationFrame(() => {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: "start", behavior: "instant" });
      });
    };
    const observer = new MutationObserver(attempt);
    observer.observe(document.getElementById("root")!, { childList: true, subtree: true });
    void document.fonts.ready.then(attempt);
    attempt();
    const timeout = window.setTimeout(() => { active = false; observer.disconnect(); }, 10000);
    return () => { active = false; observer.disconnect(); cancelAnimationFrame(frame); clearTimeout(timeout); };
  }, [route]);
}
