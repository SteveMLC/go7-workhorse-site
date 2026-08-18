import { DOWNLOAD_CLICK_EVENT } from "./analytics";
import { softwareApplicationJsonLd } from "./site";

// The production GA4 measurement id. Locked here so the monitor fails loudly if
// the deployed site ever stops loading this exact stream.
export const GA_MEASUREMENT_ID = "G-VCG5F1M7MB";

export type CheckId = "http" | "ga4" | "json_ld" | "download_event";

export type CheckResult = {
  id: CheckId;
  label: string;
  ok: boolean;
  detail: string;
};

// A fetched view of the live site: the home document and its first-party JS.
// `status` is 0 when the origin never answered. The runner fills this in; the
// checks below stay pure so the tests never touch the network.
export type SiteSnapshot = {
  url: string;
  status: number;
  html: string;
  scripts: string;
};

export type MonitorReport = {
  url: string;
  ok: boolean;
  checks: CheckResult[];
};

export function gaLoaderUrl(id: string = GA_MEASUREMENT_ID): string {
  return `https://www.googletagmanager.com/gtag/js?id=${id}`;
}

export function checkHttp(status: number): CheckResult {
  const ok = status >= 200 && status < 300;
  return {
    id: "http",
    label: "Live site HTTP",
    ok,
    detail: status === 0 ? "no response from origin" : `HTTP ${status}`,
  };
}

export function checkGa4(html: string, id: string = GA_MEASUREMENT_ID): CheckResult {
  const loader = gaLoaderUrl(id).replace(/^https?:\/\//, "");
  const hasLoader = html.includes(loader);
  return {
    id: "ga4",
    label: "GA4 measurement id",
    ok: hasLoader,
    detail: hasLoader
      ? `${id} loaded via ${loader}`
      : `gtag loader for ${id} not found in page`,
  };
}

const JSON_LD_RE =
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

// Pull every application/ld+json block out of the document. JSON.parse copes
// with the < escaping the layout applies, so escaped and plain blocks both come
// back as objects. A block we cannot parse is skipped, not thrown.
export function extractJsonLd(html: string): unknown[] {
  const blocks: unknown[] = [];
  for (const match of html.matchAll(JSON_LD_RE)) {
    const raw = match[1].trim();
    if (!raw) continue;
    try {
      blocks.push(JSON.parse(raw));
    } catch {
      // A later block may still be the one we want.
    }
  }
  return blocks;
}

export function checkSoftwareApplication(html: string): CheckResult {
  const expected = softwareApplicationJsonLd();
  const app = extractJsonLd(html).find(
    (block): block is Record<string, unknown> =>
      typeof block === "object" &&
      block !== null &&
      (block as Record<string, unknown>)["@type"] === "SoftwareApplication",
  );

  if (!app) {
    return {
      id: "json_ld",
      label: "SoftwareApplication JSON-LD",
      ok: false,
      detail: "no application/ld+json block with @type SoftwareApplication",
    };
  }

  const mismatches: string[] = [];
  if (app.name !== expected.name) mismatches.push(`name=${JSON.stringify(app.name)}`);
  if (app.url !== expected.url) mismatches.push(`url=${JSON.stringify(app.url)}`);
  if (app.downloadUrl !== expected.downloadUrl) {
    mismatches.push(`downloadUrl=${JSON.stringify(app.downloadUrl)}`);
  }

  if (mismatches.length > 0) {
    return {
      id: "json_ld",
      label: "SoftwareApplication JSON-LD",
      ok: false,
      detail: `SoftwareApplication present but ${mismatches.join(", ")}`,
    };
  }

  return {
    id: "json_ld",
    label: "SoftwareApplication JSON-LD",
    ok: true,
    detail: `name=${expected.name}, downloadUrl=${expected.downloadUrl}`,
  };
}

// The download_click event ships inside the client JS, so the runner hands us
// the concatenated script text. Fall back to the HTML in case a future build
// inlines it.
export function checkDownloadEvent(scripts: string, html: string = ""): CheckResult {
  const ok =
    scripts.includes(DOWNLOAD_CLICK_EVENT) || html.includes(DOWNLOAD_CLICK_EVENT);
  return {
    id: "download_event",
    label: "download_click event",
    ok,
    detail: ok
      ? `"${DOWNLOAD_CLICK_EVENT}" present in deployed JS`
      : `"${DOWNLOAD_CLICK_EVENT}" not found in deployed JS`,
  };
}

export function evaluateSnapshot(snapshot: SiteSnapshot): MonitorReport {
  const checks = [
    checkHttp(snapshot.status),
    checkGa4(snapshot.html),
    checkSoftwareApplication(snapshot.html),
    checkDownloadEvent(snapshot.scripts, snapshot.html),
  ];
  return {
    url: snapshot.url,
    ok: checks.every((check) => check.ok),
    checks,
  };
}

export function formatReport(report: MonitorReport): string {
  const lines = [
    `Go7 Workhorse live monitor — ${report.url}`,
    `Result: ${report.ok ? "PASS" : "FAIL"}`,
    "",
  ];
  for (const check of report.checks) {
    lines.push(`[${check.ok ? "PASS" : "FAIL"}] ${check.label} — ${check.detail}`);
  }
  return lines.join("\n");
}
