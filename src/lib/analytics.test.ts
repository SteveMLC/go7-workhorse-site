import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  DOWNLOAD_CLICK_EVENT,
  downloadClickEventParams,
  trackDownloadClick,
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
});
