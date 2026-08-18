import { FEATURE_LIST } from "./feature-list.ts";

export const PRODUCT_NAME = "Go7 Workhorse";
export const STUDIO_NAME = "Go7 Studio";
export const STUDIO_URL = "https://go7studio.com";
export const DESK_LINE = "One desk. Every Subscription.";
export const SUBSCRIPTION_CLAIM = "Every subscription stays its own.";
export const NO_HOST_CLAIM =
  "There is no account with us and no server of ours.";
export const REPO_URL = "https://github.com/go7studio/Go7-Workhorse";
export const RELEASES_URL =
  "https://github.com/go7studio/Go7-Workhorse/releases/latest";
export const SITE_ORIGIN = "https://go7workhorse.com";

/** Stable @id values so every JSON-LD block on the site names the same three things. */
export const APP_ID = `${SITE_ORIGIN}/#software`;
export const ORG_ID = `${STUDIO_URL}/#organization`;
export const SITE_ID = `${SITE_ORIGIN}/#website`;

export type DownloadPlatform = "mac" | "windows";

export type DownloadAction = {
  platform: DownloadPlatform;
  label: string;
  href: string;
};

export function downloadHref(platform: DownloadPlatform): string {
  void platform;
  return RELEASES_URL;
}

export function downloadLabel(platform: DownloadPlatform): string {
  return platform === "mac" ? "Download for Mac" : "Download for Windows";
}

export function downloadAction(platform: DownloadPlatform): DownloadAction {
  return {
    platform,
    label: downloadLabel(platform),
    href: downloadHref(platform),
  };
}

export function homeModel() {
  return {
    productName: PRODUCT_NAME,
    deskLine: DESK_LINE,
    subscriptionClaim: SUBSCRIPTION_CLAIM,
    noHostClaim: NO_HOST_CLAIM,
    repoUrl: REPO_URL,
    repoLabel: "Public repo",
    downloads: [
      downloadAction("mac"),
      downloadAction("windows"),
    ] as const,
    lead: "Run Grok, Claude, Codex, Cursor, your own API keys and your local models in one window. Each keeps its own login.",
    agentSource: "/llms.txt",
  };
}

export type HomeModel = ReturnType<typeof homeModel>;

export type SoftwareApplicationJsonLd = {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  "@id": string;
  name: string;
  description: string;
  applicationCategory: "DeveloperApplication";
  operatingSystem: string[];
  url: string;
  downloadUrl: string;
  installUrl: string;
  softwareHelp: { "@type": "CreativeWork"; url: string };
  releaseNotes: string;
  license: string;
  isAccessibleForFree: true;
  offers: { "@type": "Offer"; price: "0"; priceCurrency: "USD" };
  featureList: string[];
  screenshot: string;
  image: string;
  sameAs: string[];
  author: {
    "@type": "Organization";
    "@id": string;
    name: string;
    url: string;
  };
  publisher: { "@id": string };
};

/**
 * The one SoftwareApplication entity. Printed from the layout head, so every
 * page carries it. Every field is a claim the public repo makes: MIT licence,
 * installers on GitHub Releases, docs on this site, features from FEATURES.md.
 */
export function softwareApplicationJsonLd(): SoftwareApplicationJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: PRODUCT_NAME,
    description: `${DESK_LINE} ${NO_HOST_CLAIM} Native desktop for Windows and macOS.`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: ["Windows", "macOS"],
    url: SITE_ORIGIN,
    downloadUrl: RELEASES_URL,
    installUrl: `${SITE_ORIGIN}/download`,
    softwareHelp: { "@type": "CreativeWork", url: `${SITE_ORIGIN}/docs` },
    releaseNotes: `${REPO_URL}/releases`,
    license: `${REPO_URL}/blob/main/LICENSE`,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: FEATURE_LIST,
    screenshot: `${SITE_ORIGIN}/og.png`,
    image: `${SITE_ORIGIN}/og.png`,
    sameAs: [REPO_URL, `${REPO_URL}/blob/main/docs/FEATURES.md`],
    author: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: STUDIO_NAME,
      url: STUDIO_URL,
    },
    publisher: { "@id": ORG_ID },
  };
}

export function softwareApplicationJsonLdScript(): string {
  return JSON.stringify(softwareApplicationJsonLd()).replace(/</g, "\\u003c");
}
