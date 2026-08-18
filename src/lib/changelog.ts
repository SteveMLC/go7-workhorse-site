/**
 * The changelog is GitHub Releases, read twice: once at build (so the page
 * carries real notes for crawlers) and again in the browser (so it is current
 * between deploys). Both paths run through the same parser. Release notes are
 * release-please markdown; a small reader turns them into the site's blocks.
 * No HTML is ever passed through.
 */
import type { Block } from "./content.ts";

export const RELEASES_API = "https://api.github.com/repos/go7studio/Go7-Workhorse/releases?per_page=12";

export type ReleaseJson = {
  tag_name?: string;
  name?: string;
  html_url?: string;
  published_at?: string;
  body?: string | null;
  draft?: boolean;
  prerelease?: boolean;
};

export type Release = {
  version: string;
  name: string;
  date: string;
  url: string;
  blocks: Block[];
};

/** Turn one release's markdown into blocks: sub-headings, bullets, paragraphs. */
export function notesToBlocks(markdown: string | null | undefined): Block[] {
  const blocks: Block[] = [];
  let items: string[] = [];
  const flush = () => {
    if (items.length) blocks.push({ kind: "ul", items });
    items = [];
  };
  const lines = String(markdown ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/<!--[\s\S]*?-->/g, "")
    .split("\n");
  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      continue;
    }
    // "## [0.6.2](compare-url) (2026-08-18)" — the page prints its own header.
    if (/^#{1,2}\s/.test(trimmed) && /^\#{1,2}\s+\[?v?\d+\.\d+/.test(trimmed)) continue;
    const heading = /^#{1,6}\s+(.*)$/.exec(trimmed);
    if (heading) {
      flush();
      blocks.push({ kind: "h", text: cleanInline(heading[1]) });
      continue;
    }
    const bullet = /^(?:[*\-+]|\d+\.)\s+(.*)$/.exec(trimmed);
    if (bullet) {
      items.push(cleanInline(bullet[1]));
      continue;
    }
    // A wrapped continuation of the previous bullet.
    if (items.length && /^\s{2,}/.test(line)) {
      items[items.length - 1] = `${items[items.length - 1]} ${cleanInline(trimmed)}`;
      continue;
    }
    flush();
    blocks.push({ kind: "p", text: cleanInline(trimmed) });
  }
  flush();
  return blocks;
}

/** Keep the three inline marks the site renders; drop anything that could read as HTML. */
export function cleanInline(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}

export function parseReleases(json: unknown): Release[] {
  if (!Array.isArray(json)) return [];
  const out: Release[] = [];
  for (const item of json as ReleaseJson[]) {
    if (!item || typeof item !== "object") continue;
    if (item.draft) continue;
    const tag = typeof item.tag_name === "string" ? item.tag_name : "";
    const version = tag.replace(/^v/i, "");
    if (!version) continue;
    out.push({
      version,
      name: typeof item.name === "string" && item.name.trim() ? item.name.trim() : `Go7 Workhorse ${version}`,
      date: typeof item.published_at === "string" ? item.published_at : "",
      url: typeof item.html_url === "string" ? item.html_url : "",
      blocks: notesToBlocks(item.body),
    });
  }
  return out;
}

/**
 * Build-time read. Never throws: a rate-limited or offline build renders the
 * page without notes and the browser fills them in.
 */
export async function fetchReleasesAtBuild(): Promise<Release[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await fetch(RELEASES_API, { headers, signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) return [];
    return parseReleases(await response.json());
  } catch {
    return [];
  }
}
