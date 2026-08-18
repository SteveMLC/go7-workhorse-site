"use client";

import { useEffect, useRef, type ReactNode } from "react";

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/**
 * Wraps the product shot. Three jobs, all motion only:
 * 1. Adds `in` when the shot scrolls into view so its animations start then.
 * 2. Counts the ring percentages up from 0, like the desk's own FuelRing tween.
 * 3. Tilts the glass a few degrees toward a fine pointer, with a moving sheen.
 * Nothing here takes input or changes copy.
 */
export function Stage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frames: number[] = [];

    const countUp = () => {
      const labels = node.querySelectorAll<HTMLElement>("[data-v]");
      labels.forEach((label, index) => {
        const target = Number(label.dataset.v ?? "0");
        if (still) {
          label.textContent = `${target}%`;
          return;
        }
        const wait = 560 + index * 110;
        const duration = 1100;
        const start = performance.now() + wait;
        label.textContent = "0%";
        const tick = (now: number) => {
          const t = Math.min(1, Math.max(0, (now - start) / duration));
          label.textContent = `${Math.round(target * easeOutCubic(t))}%`;
          if (t < 1) frames.push(window.requestAnimationFrame(tick));
        };
        frames.push(window.requestAnimationFrame(tick));
      });
    };

    const reveal = () => {
      if (node.classList.contains("in")) return;
      node.classList.add("in");
      countUp();
    };

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            reveal();
            observer?.disconnect();
          }
        },
        { rootMargin: "0px 0px -18% 0px", threshold: 0.12 },
      );
      observer.observe(node);
    } else {
      reveal();
    }

    const fine = window.matchMedia("(pointer: fine)").matches;
    const glass = node.querySelector<HTMLElement>(".tilt");
    let onMove: ((event: PointerEvent) => void) | null = null;
    let onLeave: (() => void) | null = null;
    if (glass && fine && !still) {
      let frame = 0;
      let rx = 0;
      let ry = 0;
      let sx = 50;
      let sy = 0;
      const paint = () => {
        frame = 0;
        glass.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        glass.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
        glass.style.setProperty("--sx", `${sx.toFixed(1)}%`);
        glass.style.setProperty("--sy", `${sy.toFixed(1)}%`);
      };
      onMove = (event: PointerEvent) => {
        const box = glass.getBoundingClientRect();
        const px = (event.clientX - box.left) / box.width;
        const py = (event.clientY - box.top) / box.height;
        rx = (0.5 - py) * 5;
        ry = (px - 0.5) * 7;
        sx = px * 100;
        sy = py * 100;
        if (!frame) frame = window.requestAnimationFrame(paint);
      };
      onLeave = () => {
        rx = 0;
        ry = 0;
        sx = 50;
        sy = 0;
        if (!frame) frame = window.requestAnimationFrame(paint);
      };
      glass.addEventListener("pointermove", onMove, { passive: true });
      glass.addEventListener("pointerleave", onLeave);
    }

    return () => {
      observer?.disconnect();
      frames.forEach((frame) => window.cancelAnimationFrame(frame));
      frames = [];
      if (glass && onMove) glass.removeEventListener("pointermove", onMove);
      if (glass && onLeave) glass.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="stage" ref={ref}>
      {children}
    </div>
  );
}
