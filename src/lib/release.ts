/**
 * Read the latest GitHub release into three installers.
 * Pure: takes the API JSON, returns links. The download page fetches and renders.
 * Asset names follow the desk's release build:
 *   Go7-Workhorse-<v>-mac-arm64.dmg · Go7-Workhorse-<v>-mac-x64.dmg · Go7-Workhorse-Setup-<v>.exe
 */

export const LATEST_RELEASE_API =
  "https://api.github.com/repos/go7studio/Go7-Workhorse/releases/latest";

export type ReleaseAsset = { name: string; browser_download_url: string; size: number };

export type ReleaseJson = {
  tag_name?: string;
  name?: string;
  html_url?: string;
  published_at?: string;
  assets?: ReleaseAsset[];
};

export type Installer = { label: string; href: string; size: string; file: string };

export type LatestRelease = {
  version: string;
  publishedAt: string;
  notesUrl: string;
  macArm?: Installer;
  macIntel?: Installer;
  windows?: Installer;
};

export function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
}

/** UTC on purpose: the build and the browser must print the same text or hydration breaks. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function pick(assets: ReleaseAsset[], test: (name: string) => boolean, label: string): Installer | undefined {
  const asset = assets.find((item) => test(item.name.toLowerCase()));
  if (!asset || !asset.browser_download_url) return undefined;
  return { label, href: asset.browser_download_url, size: formatSize(asset.size), file: asset.name };
}

/** Returns null when the payload has no version or no recognisable installer. */
export function parseLatestRelease(json: ReleaseJson | null | undefined): LatestRelease | null {
  if (!json || typeof json !== "object") return null;
  const tag = typeof json.tag_name === "string" ? json.tag_name : "";
  const version = tag.replace(/^v/i, "");
  if (!version) return null;
  const assets = Array.isArray(json.assets) ? json.assets : [];
  const macArm = pick(assets, (n) => n.endsWith(".dmg") && n.includes("arm64"), "Mac · Apple silicon");
  const macIntel = pick(assets, (n) => n.endsWith(".dmg") && (n.includes("x64") || n.includes("intel")), "Mac · Intel");
  const windows = pick(assets, (n) => n.endsWith(".exe"), "Windows");
  if (!macArm && !macIntel && !windows) return null;
  return {
    version,
    publishedAt: typeof json.published_at === "string" ? json.published_at : "",
    notesUrl: typeof json.html_url === "string" ? json.html_url : "",
    macArm,
    macIntel,
    windows,
  };
}
