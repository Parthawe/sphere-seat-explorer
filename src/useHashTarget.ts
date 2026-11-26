import { useEffect } from "react";

/** Wait for the asynchronous page above an anchor before moving to it. */
export function useHashTarget(route: object) {
  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;
    let id: string;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    let frame = 0, active = true, done = false;
    const cancel = () => {
      active = false;
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    const attempt = () => {
      if (!active || done || document.fonts.status !== "loaded") return;
      const target = document.getElementById(id);
      if (!target || document.querySelector('.hub-loading')) return;
      done = true;
      observer.disconnect();
      frame = requestAnimationFrame(() => {
        if (!active || !target.isConnected || location.hash !== hash) return;
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: "start", behavior: "instant" });
        cancel();
      });
    };
    const observer = new MutationObserver(attempt);
    observer.observe(document.getElementById("root")!, { childList: true, subtree: true });
    // A late font or component load must not interrupt someone already using the page.
    const interactions = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    interactions.forEach(type => document.addEventListener(type, cancel, { capture: true, passive: true }));
    void document.fonts.ready.then(attempt);
    attempt();
    const timeout = window.setTimeout(cancel, 10000);
    return () => {
      cancel(); clearTimeout(timeout);
      interactions.forEach(type => document.removeEventListener(type, cancel, true));
    };
  }, [route]);
}
