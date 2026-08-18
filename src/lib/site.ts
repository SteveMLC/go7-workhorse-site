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
  name: string;
  description: string;
  applicationCategory: "BusinessApplication";
  operatingSystem: string[];
  url: string;
  downloadUrl: string;
  sameAs: string[];
  author: {
    "@type": "Organization";
    name: string;
    url: string;
  };
};

export function softwareApplicationJsonLd(): SoftwareApplicationJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: PRODUCT_NAME,
    description: `${DESK_LINE} ${NO_HOST_CLAIM} Native desktop for Windows and macOS.`,
    applicationCategory: "BusinessApplication",
    operatingSystem: ["Windows", "macOS"],
    url: SITE_ORIGIN,
    downloadUrl: RELEASES_URL,
    sameAs: [REPO_URL],
    author: {
      "@type": "Organization",
      name: STUDIO_NAME,
      url: STUDIO_URL,
    },
  };
}

export function softwareApplicationJsonLdScript(): string {
  return JSON.stringify(softwareApplicationJsonLd()).replace(/</g, "\\u003c");
}
