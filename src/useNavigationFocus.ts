import { useEffect, useRef } from 'react';

/** Announce a user-requested page change after its lazy-loaded heading exists. */
export function useNavigationFocus(route: object) {
  const requested = useRef(false);
  useEffect(() => {
    if (!requested.current) return;
    requested.current = false;
    // Hash navigation owns its own target and scroll position.
    if (location.hash) return;
    let active = true;
    const root = document.getElementById('root');
    if (!root) return;
    const cancel = () => { active = false; observer.disconnect(); };
    const focus = () => {
      if (!active) return;
      const heading = root.querySelector<HTMLElement>('h1');
      if (!heading) return;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      cancel();
    };
    const observer = new MutationObserver(focus);
    observer.observe(root, { childList: true, subtree: true });
    // Never move focus late if someone starts interacting while a page loads.
    document.addEventListener('pointerdown', cancel, true);
    document.addEventListener('keydown', cancel, true);
    const timer = window.setTimeout(cancel, 10000);
    focus();
    return () => {
      cancel(); clearTimeout(timer);
      document.removeEventListener('pointerdown', cancel, true);
      document.removeEventListener('keydown', cancel, true);
    };
  }, [route]);
  return () => { requested.current = true; };
}
