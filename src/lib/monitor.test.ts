import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DOWNLOAD_CLICK_EVENT, LLMS_TXT_CLICK_EVENT, REPO_CLICK_EVENT } from "./analytics.ts";
import {
  PRODUCT_NAME,
  RELEASES_URL,
  SITE_ORIGIN,
  softwareApplicationJsonLdScript,
} from "./site.ts";
import {
  GA_MEASUREMENT_ID,
  checkDownloadEvent,
  checkGa4,
  checkHttp,
  checkOutboundEvents,
  checkSoftwareApplication,
  evaluateSnapshot,
  extractJsonLd,
  formatReport,
  gaLoaderUrl,
  type SiteSnapshot,
} from "./monitor.ts";

// A document shaped like the deployed head: escaped JSON-LD block, the gtag
// loader, and the outbound event names that ship in the inline init script.
function liveLikeHtml(): string {
  return [
    "<!doctype html><html><head>",
    `<script type="application/ld+json">${softwareApplicationJsonLdScript()}</script>`,
    `<script async src="${gaLoaderUrl()}"></script>`,
    `<script>gtag('config','${GA_MEASUREMENT_ID}');` +
      `document.addEventListener('click',function(e){gtag('event','${REPO_CLICK_EVENT}',{});` +
      `gtag('event','${LLMS_TXT_CLICK_EVENT}',{});});</script>`,
    "</head><body>ok</body></html>",
  ].join("");
}

const DEPLOYED_SCRIPTS = `function h(a){window.gtag("event","${DOWNLOAD_CLICK_EVENT}",a)}`;

function goodSnapshot(): SiteSnapshot {
  return {
    url: SITE_ORIGIN,
    status: 200,
    html: liveLikeHtml(),
    scripts: DEPLOYED_SCRIPTS,
  };
}

describe("monitor — GA4 measurement id", () => {
  it("locks the production stream id", () => {
    assert.equal(GA_MEASUREMENT_ID, "G-VCG5F1M7MB");
  });

  it("passes when the gtag loader carries the id", () => {
    const result = checkGa4(liveLikeHtml());
    assert.equal(result.ok, true);
    assert.match(result.detail, /G-VCG5F1M7MB/);
  });

  it("fails when the loader is missing", () => {
    assert.equal(checkGa4("<html><head></head></html>").ok, false);
  });

  it("fails when a different measurement id is deployed", () => {
    const wrong = liveLikeHtml().replaceAll("G-VCG5F1M7MB", "G-0000000000");
    assert.equal(checkGa4(wrong).ok, false);
  });
});

describe("monitor — SoftwareApplication JSON-LD", () => {
  it("reads the escaped ld+json block back into an object", () => {
    const blocks = extractJsonLd(liveLikeHtml());
    assert.equal(blocks.length, 1);
    assert.equal(
      (blocks[0] as Record<string, unknown>)["@type"],
      "SoftwareApplication",
    );
  });

  it("passes on the shipped payload", () => {
    const result = checkSoftwareApplication(liveLikeHtml());
    assert.equal(result.ok, true);
    assert.match(result.detail, new RegExp(PRODUCT_NAME));
    assert.match(result.detail, new RegExp(RELEASES_URL.replace(/[/.]/g, "\\$&")));
  });

  it("fails when no SoftwareApplication block is present", () => {
    const html =
      '<script type="application/ld+json">{"@type":"WebSite"}</script>';
    assert.equal(checkSoftwareApplication(html).ok, false);
  });

  it("fails when the deployed name drifts from the source of truth", () => {
    const drifted = liveLikeHtml().replace(PRODUCT_NAME, "Someone Else");
    assert.equal(checkSoftwareApplication(drifted).ok, false);
  });
});

describe("monitor — download_click event", () => {
  it("passes when the event name is in the deployed JS", () => {
    assert.equal(checkDownloadEvent(DEPLOYED_SCRIPTS).ok, true);
  });

  it("fails when no script carries the event", () => {
    const result = checkDownloadEvent("console.log('nothing here')");
    assert.equal(result.ok, false);
    assert.match(result.detail, /not found/);
  });
});

describe("monitor — HTTP status", () => {
  it("treats 2xx as up", () => {
    assert.equal(checkHttp(200).ok, true);
  });

  it("treats 5xx and unresolved redirects as down", () => {
    assert.equal(checkHttp(503).ok, false);
    assert.equal(checkHttp(301).ok, false);
  });

  it("treats a status of 0 as no response", () => {
    const result = checkHttp(0);
    assert.equal(result.ok, false);
    assert.match(result.detail, /no response/);
  });
});

describe("monitor — full snapshot", () => {
  it("passes when every signal is live", () => {
    const report = evaluateSnapshot(goodSnapshot());
    assert.equal(report.ok, true);
    assert.equal(report.checks.length, 5);
    assert.deepEqual(
      report.checks.map((check) => check.id),
      ["http", "ga4", "json_ld", "download_event", "outbound_events"],
    );
  });

  it("fails the whole report when the download event goes missing", () => {
    const report = evaluateSnapshot({ ...goodSnapshot(), scripts: "" });
    assert.equal(report.ok, false);
    const failed = report.checks.find((check) => !check.ok);
    assert.equal(failed?.id, "download_event");
  });

  it("fails when the origin never answered", () => {
    const report = evaluateSnapshot({
      url: SITE_ORIGIN,
      status: 0,
      html: "",
      scripts: "",
    });
    assert.equal(report.ok, false);
  });

  it("renders a plain-text PASS/FAIL report", () => {
    const text = formatReport(evaluateSnapshot(goodSnapshot()));
    assert.match(text, /^Go7 Workhorse live monitor — https:\/\/go7workhorse\.com/);
    assert.match(text, /Result: PASS/);
    assert.match(text, /\[PASS\] GA4 measurement id/);
  });
});

describe("monitor — outbound click events", () => {
  it("passes when both event names appear in the HTML", () => {
    const result = checkOutboundEvents(liveLikeHtml());
    assert.equal(result.ok, true);
    assert.match(result.detail, /repo_click/);
    assert.match(result.detail, /llms_txt_click/);
  });

  it("fails when both event names are absent", () => {
    const result = checkOutboundEvents("<html><body>nothing</body></html>");
    assert.equal(result.ok, false);
    assert.match(result.detail, /missing/);
    assert.match(result.detail, /repo_click/);
    assert.match(result.detail, /llms_txt_click/);
  });

  it("fails when only one event name is missing", () => {
    const html = `<script>gtag('event','${REPO_CLICK_EVENT}',{})</script>`;
    const result = checkOutboundEvents(html);
    assert.equal(result.ok, false);
    assert.match(result.detail, /llms_txt_click/);
    assert.doesNotMatch(result.detail, /repo_click/);
  });

  it("accepts event names found in the scripts argument instead of html", () => {
    const scripts = `gtag('event','${REPO_CLICK_EVENT}');gtag('event','${LLMS_TXT_CLICK_EVENT}');`;
    const result = checkOutboundEvents("", scripts);
    assert.equal(result.ok, true);
  });

  it("fails the full snapshot when outbound events go missing", () => {
    const snapshot = { ...goodSnapshot(), html: goodSnapshot().html.replace(REPO_CLICK_EVENT, "").replace(LLMS_TXT_CLICK_EVENT, "") };
    const report = evaluateSnapshot(snapshot);
    assert.equal(report.ok, false);
    const failed = report.checks.find((c) => !c.ok);
    assert.equal(failed?.id, "outbound_events");
  });
});
