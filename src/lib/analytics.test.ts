import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  DOWNLOAD_CLICK_EVENT,
  LLMS_TXT_CLICK_EVENT,
  REPO_CLICK_EVENT,
  downloadClickEventParams,
  trackDownloadClick,
  trackDownloadNavigation,
  trackOutboundClick,
} from "./analytics.ts";

const originalWindow = globalThis.window;

afterEach(() => {
  globalThis.window = originalWindow;
});

describe("download click analytics", () => {
  it("builds GA4-safe event params for the CTA target", () => {
    assert.deepEqual(
      downloadClickEventParams({
        platform: "mac",
        href: "https://github.com/go7studio/Go7-Workhorse/releases/latest",
      }, {
        page_location: "https://go7workhorse.com/",
        link_text: "Download for Mac",
      }),
      {
        platform: "mac",
        destination_href:
          "https://github.com/go7studio/Go7-Workhorse/releases/latest",
        page_location: "https://go7workhorse.com/",
        link_text: "Download for Mac",
      },
    );
  });

  it("does nothing when gtag is unavailable", () => {
    globalThis.window = {} as Window & typeof globalThis;
    assert.equal(
      trackDownloadClick({
        platform: "windows",
        href: "https://github.com/go7studio/Go7-Workhorse/releases/latest",
      }),
      false,
    );
  });

  it("fires the download event with platform and href when gtag exists", () => {
    const calls: Array<[string, string, Record<string, unknown>]> = [];
    globalThis.window = {
      location: {
        href: "https://go7workhorse.com/",
      },
      gtag: (
        command: string,
        eventName: string,
        params: Record<string, unknown>,
      ) => {
        calls.push([command, eventName, params]);
      },
    } as Window & typeof globalThis;

    assert.equal(
      trackDownloadClick({
        platform: "windows",
        href: "https://github.com/go7studio/Go7-Workhorse/releases/latest",
      }),
      true,
    );
    assert.deepEqual(calls, [
      [
        "event",
        DOWNLOAD_CLICK_EVENT,
        {
          platform: "windows",
          destination_href:
            "https://github.com/go7studio/Go7-Workhorse/releases/latest",
          page_location: "https://go7workhorse.com/",
        },
      ],
    ]);
  });

  it("briefly delays normal outbound navigation after sending the event", () => {
    let prevented = false;
    let assigned = "";
    let timeout: (() => void) | undefined;
    const calls: Array<[string, string, Record<string, unknown>]> = [];

    globalThis.window = {
      gtag: (
        command: string,
        eventName: string,
        params: Record<string, unknown>,
      ) => {
        calls.push([command, eventName, params]);
      },
      location: {
        assign: (href: string) => {
          assigned = href;
        },
        href: "https://go7workhorse.com/download",
      },
      setTimeout: (fn: () => void) => {
        timeout = fn;
        return 1;
      },
    } as unknown as Window & typeof globalThis;

    trackDownloadNavigation(
      {
        button: 0,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        preventDefault: () => {
          prevented = true;
        },
      },
      {
        platform: "mac",
        href: "https://github.com/go7studio/Go7-Workhorse/releases/latest",
      },
    );

    assert.equal(prevented, true);
    assert.equal(assigned, "");
    assert.equal(calls[0][0], "event");
    assert.equal(calls[0][1], DOWNLOAD_CLICK_EVENT);
    assert.equal(calls[0][2].transport_type, "beacon");
    assert.equal(calls[0][2].page_location, "https://go7workhorse.com/download");

    timeout?.();

    assert.equal(
      assigned,
      "https://github.com/go7studio/Go7-Workhorse/releases/latest",
    );
  });
});

describe("outbound click analytics", () => {
  it("names the events correctly", () => {
    assert.equal(REPO_CLICK_EVENT, "repo_click");
    assert.equal(LLMS_TXT_CLICK_EVENT, "llms_txt_click");
  });

  it("does nothing when gtag is unavailable", () => {
    globalThis.window = {} as Window & typeof globalThis;
    assert.equal(
      trackOutboundClick(REPO_CLICK_EVENT, "https://github.com/go7studio/Go7-Workhorse"),
      false,
    );
  });

  it("fires repo_click with destination_href when gtag exists", () => {
    const calls: Array<[string, string, Record<string, unknown>]> = [];
    globalThis.window = {
      location: {
        href: "https://go7workhorse.com/",
      },
      gtag: (command: string, eventName: string, params: Record<string, unknown>) => {
        calls.push([command, eventName, params]);
      },
    } as Window & typeof globalThis;

    const href = "https://github.com/go7studio/Go7-Workhorse";
    assert.equal(trackOutboundClick(REPO_CLICK_EVENT, href), true);
    assert.deepEqual(calls, [
      [
        "event",
        REPO_CLICK_EVENT,
        {
          destination_href: href,
          page_location: "https://go7workhorse.com/",
        },
      ],
    ]);
  });

  it("fires llms_txt_click for the llms.txt link", () => {
    const calls: Array<[string, string, Record<string, unknown>]> = [];
    globalThis.window = {
      gtag: (command: string, eventName: string, params: Record<string, unknown>) => {
        calls.push([command, eventName, params]);
      },
    } as Window & typeof globalThis;

    const href = "https://go7workhorse.com/llms.txt";
    assert.equal(
      trackOutboundClick(LLMS_TXT_CLICK_EVENT, href, {
        page_location: "https://go7workhorse.com/docs",
        link_text: "llms.txt",
      }),
      true,
    );
    assert.equal(calls[0][1], LLMS_TXT_CLICK_EVENT);
    assert.equal((calls[0][2] as Record<string, string>).destination_href, href);
    assert.equal(
      (calls[0][2] as Record<string, string>).page_location,
      "https://go7workhorse.com/docs",
    );
    assert.equal((calls[0][2] as Record<string, string>).link_text, "llms.txt");
  });
});
