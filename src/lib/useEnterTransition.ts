"use client";
import { useEffect, useState } from "react";

/**
 * Flips to true shortly after mount, via a double requestAnimationFrame with
 * a setTimeout fallback. Drives plain CSS transitions for above-the-fold
 * entrance reveals — more reliable than a Framer Motion / CSS-keyframe mount
 * animation, which can occasionally skip its first commit and leave the
 * content stuck hidden. requestAnimationFrame alone is not enough: it's
 * fully suspended in a backgrounded/prerendered tab (e.g. a link opened in a
 * new background tab), so a timer fallback ensures the reveal still happens.
 */
export function useEnterTransition() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const commit = () => { if (!done) { done = true; setReady(true); } };
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(commit);
    });
    const timer = setTimeout(commit, 120);
    return () => { done = true; cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); clearTimeout(timer); };
  }, []);
  return ready;
}

/**
 * Same reliability fix as {@link useEnterTransition}, but for content that
 * mounts AND unmounts (e.g. a menu overlay) instead of a permanent
 * once-on-load reveal. `active` toggles the CSS transition on and off;
 * `mounted` stays true for `exitDuration` ms after `active` goes false, so
 * the element remains in the DOM long enough for its own exit transition to
 * play before being removed. Replaces Framer Motion's AnimatePresence for
 * cases where its mount animation has proven unreliable.
 */
export function useMountTransition(active: boolean, exitDuration = 550) {
  const [mounted, setMounted] = useState(active);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (active) {
      setMounted(true);
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setShown(true));
      });
      const timer = setTimeout(() => setShown(true), 120);
      return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); clearTimeout(timer); };
    }
    setShown(false);
    const timer = setTimeout(() => setMounted(false), exitDuration);
    return () => clearTimeout(timer);
  }, [active, exitDuration]);

  return { mounted, shown };
}
