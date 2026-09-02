import type { Metadata } from "next";
import { DESK_LINE, DISCORD_URL, PRODUCT_NAME, RELEASES_URL, REPO_URL, SITE_ORIGIN } from "./site.ts";
import { LLMS_TXT_CLICK_EVENT, REPO_CLICK_EVENT } from "./analytics.ts";

/** Every human page on the site. Add here, and the nav, footer, sitemap and llms.txt follow. */
export const PAGES = {
  home: { path: "/", label: "Home", title: PRODUCT_NAME, description: DESK_LINE },
  features: {
    path: "/features",
    label: "Features",
    title: "Everything the desk does",
    description:
      "Every ability Go7 Workhorse ships: agents, chats and projects, control, spend, work that outlives a turn, memory, extending it, settings, platforms.",
  },
  docs: {
    path: "/docs",
    label: "Docs",
    title: "Docs",
    description:
      "Install Go7 Workhorse, connect the vendors you already pay for, read leftover, and see what stays on your machine.",
  },
  download: {
    path: "/download",
    label: "Download",
    title: "Download",
    description:
      "Go7 Workhorse for macOS (Apple silicon and Intel) and Windows. Installers come from GitHub Releases.",
  },
  changelog: {
    path: "/changelog",
    label: "Changelog",
    title: "Changelog",
    description: "What changed in each Go7 Workhorse release, read from GitHub Releases.",
  },
} as const;

export type PageKey = keyof typeof PAGES;

export const GO7STUDIO_URL = "https://go7studio.com";
export const ISSUES_URL = `${REPO_URL}/issues`;
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;
export const README_URL = `${REPO_URL}/blob/main/README.md`;
export const FEATURES_MD_URL = `${REPO_URL}/blob/main/docs/FEATURES.md`;
export const CONTRIBUTING_URL = `${REPO_URL}/blob/main/CONTRIBUTING.md`;
export const RELEASES_INDEX_URL = `${REPO_URL}/releases`;
export const SECURITY_MD_URL = `${REPO_URL}/blob/main/SECURITY.md`;
export const SECURITY_ADVISORY_URL = `${REPO_URL}/security/advisories/new`;
export const MAC_INSTALL_SCRIPT =
  "curl -fsSL https://raw.githubusercontent.com/go7studio/Go7-Workhorse/main/scripts/install-mac.sh | bash";

export type SiteLink = {
  href: string;
  label: string;
  analyticsEvent?: string;
};

/** Text links in the top bar, in order. The Download pill is added by the nav itself. */
export const NAV_LINKS: readonly SiteLink[] = [
  { href: PAGES.features.path, label: PAGES.features.label },
  { href: PAGES.docs.path, label: PAGES.docs.label },
  { href: REPO_URL, label: "Public repo", analyticsEvent: REPO_CLICK_EVENT },
];

export const FOOTER_LINKS: readonly SiteLink[] = [
  { href: PAGES.features.path, label: PAGES.features.label },
  { href: PAGES.docs.path, label: PAGES.docs.label },
  { href: PAGES.download.path, label: PAGES.download.label },
  { href: PAGES.changelog.path, label: PAGES.changelog.label },
  { href: RELEASES_INDEX_URL, label: "Releases", analyticsEvent: REPO_CLICK_EVENT },
  { href: REPO_URL, label: "Public repo", analyticsEvent: REPO_CLICK_EVENT },
  { href: GO7STUDIO_URL, label: "go7studio.com" },
  { href: DISCORD_URL, label: "Discord" },
  { href: `${PAGES.docs.path}#contact`, label: "Contact" },
  { href: "/llms.txt", label: "llms.txt", analyticsEvent: LLMS_TXT_CLICK_EVENT },
];

export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_ORIGIN}${path}`;
}

/** Metadata for a subpage. Re-states the alternates so the llms.txt links survive the merge. */
export function pageMetadata(key: Exclude<PageKey, "home">): Metadata {
  const page = PAGES[key];
  return metadataFor({ path: page.path, title: page.title, description: page.description });
}

/** Metadata for any path on the site, docs pages included. */
export function metadataFor(page: { path: string; title: string; description: string }): Metadata {
  const title = `${page.title} — ${PRODUCT_NAME}`;
  return {
    title,
    description: page.description,
    alternates: {
      canonical: page.path,
      types: {
        "text/plain": [
          { url: "/llms.txt", title: "LLM source" },
          { url: "/llms-full.txt", title: "LLM full brief" },
        ],
      },
    },
    openGraph: {
      title,
      description: page.description,
      url: page.path,
      siteName: PRODUCT_NAME,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: PRODUCT_NAME }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.description,
      images: ["/og.png"],
    },
  };
}

export { RELEASES_URL };
