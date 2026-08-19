import type { DownloadAction } from "./site";

export const DOWNLOAD_CLICK_EVENT = "download_click";
export const REPO_CLICK_EVENT = "repo_click";
export const LLMS_TXT_CLICK_EVENT = "llms_txt_click";

export type DownloadClickEventParams = {
  platform: DownloadAction["platform"];
  destination_href: DownloadAction["href"];
  transport_type?: "beacon";
};

export type OutboundClickEventParams = {
  destination_href: string;
};

type Gtag = (
  command: "event",
  eventName: string,
  params: DownloadClickEventParams | OutboundClickEventParams,
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function downloadClickEventParams(
  download: Pick<DownloadAction, "platform" | "href">,
  options: Pick<
    DownloadClickEventParams,
    "transport_type"
  > = {},
): DownloadClickEventParams {
  return {
    platform: download.platform,
    destination_href: download.href,
    ...options,
  };
}

export function trackDownloadClick(
  download: Pick<DownloadAction, "platform" | "href">,
  options: Pick<
    DownloadClickEventParams,
    "transport_type"
  > = {},
): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return false;
  }

  window.gtag(
    "event",
    DOWNLOAD_CLICK_EVENT,
    downloadClickEventParams(download, options),
  );
  return true;
}

type DownloadClickEvent = {
  button: number;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  preventDefault: () => void;
};

export function trackDownloadNavigation(
  event: DownloadClickEvent,
  download: Pick<DownloadAction, "platform" | "href">,
): void {
  const plainPrimaryClick =
    event.button === 0 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey;

  if (!plainPrimaryClick) {
    trackDownloadClick(download);
    return;
  }

  const navigate = () => {
    window.location.assign(download.href);
  };

  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  event.preventDefault();

  trackDownloadClick(download, {
    transport_type: "beacon",
  });
  window.setTimeout(navigate, 700);
}

export function trackOutboundClick(
  eventName: typeof REPO_CLICK_EVENT | typeof LLMS_TXT_CLICK_EVENT,
  href: string,
): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return false;
  }
  window.gtag("event", eventName, { destination_href: href });
  return true;
}
