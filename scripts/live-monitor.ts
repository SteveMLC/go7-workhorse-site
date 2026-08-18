import { SITE_ORIGIN } from "../src/lib/site.ts";
import {
  evaluateSnapshot,
  formatReport,
  type SiteSnapshot,
} from "../src/lib/monitor.ts";

// Bounds: a monitor must never hang or hammer the origin.
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_SCRIPTS = 25;

// Default target is the shipped origin. MONITOR_URL lets an operator point the
// same check at a preview deploy without editing code.
const target = process.env.MONITOR_URL?.trim() || SITE_ORIGIN;

async function fetchText(
  url: string,
): Promise<{ status: number; body: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "go7-workhorse-live-monitor" },
    });
    return { status: response.status, body: await response.text() };
  } catch {
    // status 0 signals "no response"; checkHttp treats it as down.
    return { status: 0, body: "" };
  } finally {
    clearTimeout(timer);
  }
}

// Pull every first-party /_next/*.js reference the page makes, from either a
// <script src> or a <link href> preload. Capped so a runaway page can't fan out.
function firstPartyScriptUrls(html: string, origin: string): string[] {
  const urls = new Set<string>();
  const pattern = /["']([^"']*\/_next\/[^"']+\.js)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], origin).toString();
      if (resolved.startsWith(origin)) {
        urls.add(resolved);
      }
    } catch {
      // Skip anything that will not resolve to an absolute URL.
    }
  }
  return Array.from(urls).slice(0, MAX_SCRIPTS);
}

async function snapshot(url: string): Promise<SiteSnapshot> {
  const page = await fetchText(url);
  if (page.status === 0) {
    return { url, status: 0, html: "", scripts: "" };
  }
  const origin = new URL(url).origin;
  const scriptUrls = firstPartyScriptUrls(page.body, origin);
  const fetched = await Promise.all(scriptUrls.map((s) => fetchText(s)));
  const scripts = fetched.map((f) => f.body).join("\n");
  return { url, status: page.status, html: page.body, scripts };
}

async function main(): Promise<void> {
  const report = evaluateSnapshot(await snapshot(target));
  console.log(formatReport(report));
  process.exit(report.ok ? 0 : 1);
}

main().catch((error: unknown) => {
  console.log(
    `Go7 Workhorse live monitor — ${target}\nResult: FAIL\n\n[FAIL] runner — ${String(error)}`,
  );
  process.exit(1);
});
