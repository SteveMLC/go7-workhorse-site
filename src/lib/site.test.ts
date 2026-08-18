import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { FEATURE_LIST } from "./feature-list.ts";
import {
  DESK_LINE,
  NO_HOST_CLAIM,
  PRODUCT_NAME,
  RELEASES_URL,
  REPO_URL,
  SITE_ORIGIN,
  STUDIO_NAME,
  STUDIO_URL,
  SUBSCRIPTION_CLAIM,
  downloadAction,
  downloadHref,
  homeModel,
  softwareApplicationJsonLd,
  softwareApplicationJsonLdScript,
} from "./site.ts";

const RELEASE_HOST = "https://github.com/go7studio/Go7-Workhorse/releases";

describe("homeModel — shipped product door", () => {
  it("names the desk and keeps every subscription its own", () => {
    const model = homeModel();
    assert.equal(model.productName, PRODUCT_NAME);
    assert.equal(model.productName, "Go7 Workhorse");
    assert.equal(model.deskLine, DESK_LINE);
    assert.match(model.deskLine, /One desk/);
    assert.equal(model.subscriptionClaim, SUBSCRIPTION_CLAIM);
    assert.match(model.subscriptionClaim, /subscription stays its own/i);
  });

  it("states there is no account and no server of ours", () => {
    const model = homeModel();
    assert.equal(model.noHostClaim, NO_HOST_CLAIM);
    assert.match(model.noHostClaim, /no account/i);
    assert.match(model.noHostClaim, /no server of ours/i);
  });

  it("points Mac and Windows downloads at the public GitHub releases", () => {
    const model = homeModel();
    const mac = downloadAction("mac");
    const win = downloadAction("windows");
    assert.equal(mac.href, downloadHref("mac"));
    assert.equal(win.href, downloadHref("windows"));
    assert.equal(mac.href, RELEASES_URL);
    assert.equal(win.href, RELEASES_URL);
    assert.ok(mac.href.startsWith(RELEASE_HOST));
    assert.ok(win.href.startsWith(RELEASE_HOST));
    assert.equal(model.downloads[0].label, "Download for Mac");
    assert.equal(model.downloads[1].label, "Download for Windows");
    assert.equal(model.downloads[0].href, mac.href);
    assert.equal(model.downloads[1].href, win.href);
  });

  it("links the public go7studio/Go7-Workhorse repo", () => {
    const model = homeModel();
    assert.equal(model.repoUrl, REPO_URL);
    assert.equal(model.repoUrl, "https://github.com/go7studio/Go7-Workhorse");
  });
});

describe("page wires the shipped helpers", () => {
  it("renders from homeModel and does not embed a chat composer", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const page = readFileSync(join(here, "../app/page.tsx"), "utf8");
    assert.match(page, /homeModel/);
    assert.match(page, /from ["']@\/lib\/site["']/);
    assert.match(page, /from ["']@\/components\/DownloadLink["']/);
    assert.match(page, /<DownloadLink/);
    assert.doesNotMatch(page, /<textarea\b/i);
    assert.doesNotMatch(page, /\bcomposer\b/i);
    assert.doesNotMatch(page, /\bchat-input\b/i);
  });
});

describe("softwareApplicationJsonLd", () => {
  it("describes the shipped desktop app without inventing unsupported claims", () => {
    assert.deepEqual(softwareApplicationJsonLd(), {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${SITE_ORIGIN}/#software`,
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
        "@id": `${STUDIO_URL}/#organization`,
        name: STUDIO_NAME,
        url: STUDIO_URL,
      },
      publisher: { "@id": `${STUDIO_URL}/#organization` },
    });
    assert.ok(FEATURE_LIST.length >= 10);
    for (const line of FEATURE_LIST) assert.doesNotMatch(line, /good fit|SuperGrok Heavy/);
  });

  it("serializes a safe JSON-LD payload for the document head", () => {
    const json = softwareApplicationJsonLdScript();
    assert.deepEqual(JSON.parse(json), softwareApplicationJsonLd());
    assert.doesNotMatch(json, /</);
  });

  it("is wired into the Next layout head", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const layout = readFileSync(join(here, "../app/layout.tsx"), "utf8");
    assert.match(layout, /softwareApplicationJsonLdScript/);
    assert.match(layout, /type="application\/ld\+json"/);
  });
});
