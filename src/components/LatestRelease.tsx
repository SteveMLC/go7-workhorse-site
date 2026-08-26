"use client";

import { useEffect, useState } from "react";
import {
  LATEST_RELEASE_API,
  formatDate,
  parseLatestRelease,
  type LatestRelease as Latest,
} from "@/lib/release";
import { RELEASES_INDEX_URL } from "@/lib/pages";
import { downloadAction, RELEASES_URL } from "@/lib/site";

type Card = { key: string; os: string; title: string; sub: string; href: string; mine: boolean; platform: "mac" | "windows" };

type Platform = "mac" | "windows" | "other";
type MacArch = "arm" | "x64";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const hint = `${navigator.platform || ""} ${navigator.userAgent || ""}`.toLowerCase();
  if (hint.includes("mac")) return "mac";
  if (hint.includes("win")) return "windows";
  return "other";
}

/** Which Mac is this? The GPU name tells: Apple silicon reports an Apple GPU
 *  in every browser; Intel Macs report Intel/AMD/NVIDIA. Unknown defaults to
 *  Apple silicon — what almost every Mac is by now. */
function detectMacArch(): MacArch {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl && "getExtension" in gl) {
      const info = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
      const renderer = info
        ? String((gl as WebGLRenderingContext).getParameter(info.UNMASKED_RENDERER_WEBGL))
        : "";
      if (/intel|amd|nvidia|radeon|iris/i.test(renderer)) return "x64";
    }
  } catch {
    /* default below */
  }
  return "arm";
}

/**
 * Installer cards. Server-rendered as the two GitHub Releases links, so the page
 * works with no JS. Once mounted it asks GitHub for the latest release and swaps
 * in the direct installer links with version and size. Any failure keeps the fallback.
 */
export function LatestRelease() {
  const [latest, setLatest] = useState<Latest | null>(null);
  const [platform, setPlatform] = useState<Platform>("other");
  const [macArch, setMacArch] = useState<MacArch>("arm");

  useEffect(() => {
    const detected = detectPlatform();
    setPlatform(detected);
    if (detected === "mac") setMacArch(detectMacArch());
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 6000);
    fetch(LATEST_RELEASE_API, {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        const parsed = parseLatestRelease(json);
        if (parsed) setLatest(parsed);
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timer));
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  const mac = downloadAction("mac");
  const win = downloadAction("windows");

  const cards: Card[] = latest
    ? [
        latest.macArm && {
          key: "mac-arm",
          os: "macOS",
          title: "Apple silicon",
          sub: [".dmg", latest.macArm.size].filter(Boolean).join(" · "),
          href: latest.macArm.href,
          mine: platform === "mac" && macArch === "arm",
          platform: "mac",
        },
        latest.macIntel && {
          key: "mac-intel",
          os: "macOS",
          title: "Intel",
          sub: [".dmg", latest.macIntel.size].filter(Boolean).join(" · "),
          href: latest.macIntel.href,
          mine: platform === "mac" && macArch === "x64",
          platform: "mac",
        },
        latest.windows && {
          key: "win",
          os: "Windows",
          title: "Setup",
          sub: [".exe", latest.windows.size].filter(Boolean).join(" · "),
          href: latest.windows.href,
          mine: platform === "windows",
          platform: "windows",
        },
      ].filter((card): card is Card => Boolean(card))
    : [
        { key: "mac", os: "macOS", title: mac.label, sub: "From GitHub Releases", href: mac.href, mine: platform === "mac", platform: "mac" },
        { key: "win", os: "Windows", title: win.label, sub: "From GitHub Releases", href: win.href, mine: platform === "windows", platform: "windows" },
      ];

  const stamp = latest
    ? [`Latest v${latest.version}`, formatDate(latest.publishedAt)].filter(Boolean).join(" · ")
    : "Latest release on GitHub";

  return (
    <div className="dl" data-state={latest ? "live" : "static"}>
      <p className="dl-meta">
        <span>{stamp}</span>
        <a href={latest?.notesUrl || RELEASES_URL} data-analytics-outbound="repo_click">
          Release notes<span aria-hidden="true">›</span>
        </a>
      </p>
      <div className={`dl-grid dl-${cards.length}`}>
        {cards.map((card) => (
          <a
            className={`dl-card${card.mine ? " mine" : ""}`}
            data-mine={card.platform === "mac" ? "For this Mac" : "For this PC"}
            data-analytics-download={card.platform}
            href={card.href}
            key={card.key}
          >
            <span className="dl-os">{card.os}</span>
            <strong className="dl-title">{card.title}</strong>
            <span className="dl-sub">{card.sub}</span>
            <span className="dl-go">
              Download<span aria-hidden="true">↓</span>
            </span>
          </a>
        ))}
      </div>
      <p className="dl-all">
        <a href={RELEASES_INDEX_URL} data-analytics-outbound="repo_click">
          All releases<span aria-hidden="true">›</span>
        </a>
      </p>
    </div>
  );
}
