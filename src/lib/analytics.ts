import type { DownloadAction } from "./site";

export const DOWNLOAD_CLICK_EVENT = "download_click";

export type DownloadClickEventParams = {
  platform: DownloadAction["platform"];
  destination_href: DownloadAction["href"];
};

type Gtag = (
  command: "event",
  eventName: string,
  params: DownloadClickEventParams,
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function downloadClickEventParams(
  download: Pick<DownloadAction, "platform" | "href">,
): DownloadClickEventParams {
  return {
    platform: download.platform,
    destination_href: download.href,
  };
}

export function trackDownloadClick(
  download: Pick<DownloadAction, "platform" | "href">,
): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return false;
  }

  window.gtag(
    "event",
    DOWNLOAD_CLICK_EVENT,
    downloadClickEventParams(download),
  );
  return true;
}
