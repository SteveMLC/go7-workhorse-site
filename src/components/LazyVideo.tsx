"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A poster-first video. The sources attach only when the video nears the
 * viewport, so a page with several clips does not download them all on load.
 * Under prefers-reduced-motion it does not autoplay: the poster stays and the
 * native controls appear instead. Without JS, the noscript copy plays as the
 * plain video always did.
 */
export function LazyVideo({
  src,
  poster,
  width,
  height,
  alt,
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (near && !still) ref.current?.play().catch(() => {});
  }, [near, still]);

  return (
    <>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        width={width}
        height={height}
        aria-label={alt}
        controls
        autoPlay={near && !still}
      >
        {near ? (
          <>
            <source src={`${src}.webm`} type="video/webm" />
            <source src={`${src}.mp4`} type="video/mp4" />
          </>
        ) : null}
      </video>
      <noscript>
        <video
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
          poster={poster}
          width={width}
          height={height}
          aria-label={alt}
        >
          <source src={`${src}.webm`} type="video/webm" />
          <source src={`${src}.mp4`} type="video/mp4" />
        </video>
      </noscript>
    </>
  );
}
