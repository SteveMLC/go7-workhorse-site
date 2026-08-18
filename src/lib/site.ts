export const PRODUCT_NAME = "Go7 Workhorse";
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
    fit: [
      "You hold two or more AI subscriptions or API keys.",
      "You want the routing choice to be yours.",
      "You want the work to run on your machine, under your own logins.",
    ],
    notFit: [
      "You use one vendor and are happy in its own app.",
      "You want a hosted service.",
      "You need Linux today. Installers ship for Windows and macOS.",
    ],
  };
}

export type HomeModel = ReturnType<typeof homeModel>;
