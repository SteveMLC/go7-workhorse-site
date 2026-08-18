"use client";

import { useEffect } from "react";

/**
 * Writes the pointer's position (-1..1 on each axis) to --mx / --my on <html>.
 * The hero light and the horse read them for a soft parallax. Renders nothing.
 */
export function Pointer() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;

    const root = document.documentElement;
    let frame = 0;
    let nx = 0;
    let ny = 0;

    const paint = () => {
      frame = 0;
      root.style.setProperty("--mx", nx.toFixed(3));
      root.style.setProperty("--my", ny.toFixed(3));
    };

    const onMove = (event: PointerEvent) => {
      nx = (event.clientX / window.innerWidth) * 2 - 1;
      ny = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onLeave = () => {
      nx = 0;
      ny = 0;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
