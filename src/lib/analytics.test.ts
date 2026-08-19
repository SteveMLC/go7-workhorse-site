import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  DOWNLOAD_CLICK_EVENT,
  downloadClickEventParams,
  trackDownloadClick,
  trackDownloadNavigation,
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
      }),
      {
        platform: "mac",
        destination_href:
          "https://github.com/go7studio/Go7-Workhorse/releases/latest",
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
        },
      ],
    ]);
  });

  it("waits for the GA callback before normal outbound navigation", () => {
    let prevented = false;
    let assigned = "";
    let callback: (() => void) | undefined;
    const calls: Array<[string, string, Record<string, unknown>]> = [];

    globalThis.window = {
      gtag: (
        command: string,
        eventName: string,
        params: Record<string, unknown>,
      ) => {
        calls.push([command, eventName, params]);
        callback = params.event_callback as () => void;
      },
      location: {
        assign: (href: string) => {
          assigned = href;
        },
      },
      setTimeout: () => 1,
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
    assert.equal(calls[0][2].event_timeout, 1000);

    callback?.();

    assert.equal(
      assigned,
      "https://github.com/go7studio/Go7-Workhorse/releases/latest",
    );
  });
});
