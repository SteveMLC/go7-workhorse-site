"use client";

import { useEffect, useState } from "react";
import { RELEASES_API, parseReleases, type Release } from "@/lib/changelog";
import { formatDate } from "@/lib/release";
import { RELEASES_INDEX_URL } from "@/lib/pages";
import { Blocks } from "./Blocks";

/**
 * Renders the release list. Starts with what the build fetched (real notes for
 * crawlers and no-JS readers), then asks GitHub again in the browser so the page
 * is current between deploys. If the browser fetch fails, the build's list stays.
 */
export function ChangelogLive({ initial }: { initial: Release[] }) {
  const [releases, setReleases] = useState<Release[]>(initial);
  const [state, setState] = useState<"build" | "live" | "empty">(initial.length ? "build" : "empty");

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);
    fetch(RELEASES_API, { headers: { Accept: "application/vnd.github+json" }, signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        const parsed = parseReleases(json);
        if (parsed.length) {
          setReleases(parsed);
          setState("live");
        }
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timer));
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  if (!releases.length) {
    return (
      <div className="log" data-state={state}>
        <p className="log-empty">
          Release notes live on <a href={RELEASES_INDEX_URL}>GitHub Releases</a>. This page reads the same list; it could not reach GitHub just now.
        </p>
      </div>
    );
  }

  return (
    <div className="log" data-state={state}>
      {releases.map((release, index) => (
        <article className="release" key={release.version} id={`v${release.version}`}>
          <header className="release-head">
            <h2>
              <a href={`#v${release.version}`}>v{release.version}</a>
              {index === 0 ? <span className="release-latest">Latest</span> : null}
            </h2>
            <p className="release-meta">
              {release.date ? <time dateTime={release.date}>{formatDate(release.date)}</time> : null}
              {release.url ? (
                <a href={release.url}>
                  Installers and notes on GitHub<span aria-hidden="true">›</span>
                </a>
              ) : null}
            </p>
          </header>
          <div className="release-body">
            {release.blocks.length ? <Blocks blocks={release.blocks} /> : <p className="log-quiet">No notes for this release.</p>}
          </div>
        </article>
      ))}
      <p className="log-more">
        <a href={RELEASES_INDEX_URL}>
          Every release<span aria-hidden="true">›</span>
        </a>
      </p>
    </div>
  );
}
