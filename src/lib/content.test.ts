import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { DOC_SECTIONS, DOWNLOAD_STEPS, FAQ, FEATURE_SECTIONS, HOME_FACTS } from "./content.ts";
import { FOOTER_LINKS, NAV_LINKS, PAGES, pageMetadata } from "./pages.ts";
import { formatSize, parseLatestRelease } from "./release.ts";
import { FEATURE_LIST } from "./feature-list.ts";
import { breadcrumbLd, faqLd, organizationLd, techArticleLd, webSiteLd } from "./schema.ts";
import { PRODUCT_NAME, RELEASES_URL, REPO_URL, softwareApplicationJsonLd } from "./site.ts";

const here = dirname(fileURLToPath(import.meta.url));
const appDir = join(here, "../app");

/** Every string a human page prints, flattened. */
function humanCopy(): string {
  const parts: string[] = [];
  for (const fact of HOME_FACTS) parts.push(fact.title, fact.body);
  for (const section of [...FEATURE_SECTIONS, ...DOC_SECTIONS]) {
    parts.push(section.title);
    for (const block of section.blocks) {
      if (block.kind === "p" || block.kind === "code") parts.push(block.text);
      if (block.kind === "ul" || block.kind === "ol") parts.push(...block.items);
      if (block.kind === "table") parts.push(...block.head, ...block.rows.flat());
    }
  }
  for (const item of FAQ) parts.push(item.q, item.a);
  parts.push(...DOWNLOAD_STEPS.mac, ...DOWNLOAD_STEPS.windows, ...DOWNLOAD_STEPS.then);
  return parts.join("\n");
}

describe("human pages beyond the door", () => {
  it("keep the fit lists and the SuperGrok Heavy story in llms.txt, not on the pages", () => {
    const copy = humanCopy();
    assert.doesNotMatch(copy, /good fit/i);
    assert.doesNotMatch(copy, /not a fit/i);
    assert.doesNotMatch(copy, /SuperGrok Heavy/);
    assert.doesNotMatch(copy, /waitlist|pricing|sign up|signup/i);
  });

  it("always say Go7 Workhorse, never a renamed product", () => {
    const copy = humanCopy();
    assert.doesNotMatch(copy, /Go7 Desk/);
    assert.doesNotMatch(copy, /\bWorkhorse Desk\b/);
  });

  it("have six home facts, ten feature sections, and a FAQ", () => {
    assert.equal(HOME_FACTS.length, 6);
    assert.equal(FEATURE_SECTIONS.length, 10);
    assert.ok(DOC_SECTIONS.length >= 8);
    assert.ok(FAQ.length >= 8);
    for (const section of [...FEATURE_SECTIONS, ...DOC_SECTIONS]) {
      assert.match(section.id, /^[a-z][a-z0-9-]*$/);
      assert.ok(section.blocks.length > 0, `${section.id} has blocks`);
    }
    const ids = [...FEATURE_SECTIONS, ...DOC_SECTIONS].map((s) => s.id);
    assert.equal(new Set(FEATURE_SECTIONS.map((s) => s.id)).size, FEATURE_SECTIONS.length);
    assert.equal(new Set(DOC_SECTIONS.map((s) => s.id)).size, DOC_SECTIONS.length);
    assert.ok(ids.includes("privacy"));
  });

  it("only use the three inline marks, balanced", () => {
    for (const line of humanCopy().split("\n")) {
      const ticks = (line.match(/`/g) || []).length;
      assert.equal(ticks % 2, 0, `unbalanced code mark: ${line}`);
      const stars = (line.match(/\*\*/g) || []).length;
      assert.equal(stars % 2, 0, `unbalanced strong mark: ${line}`);
      const outsideCode = line.split("`").filter((_, i) => i % 2 === 0).join("");
      assert.doesNotMatch(outsideCode, /<[a-z]+>/i, `no html in copy: ${line}`);
    }
  });
});

describe("routes, nav and footer", () => {
  it("every internal link points at a page that exists", () => {
    const internal = [...NAV_LINKS, ...FOOTER_LINKS]
      .map((link) => link.href)
      .filter((href) => href.startsWith("/") && !href.startsWith("/llms"));
    for (const href of internal) {
      const dir = href === "/" ? appDir : join(appDir, href.slice(1));
      assert.ok(existsSync(join(dir, "page.tsx")), `page for ${href}`);
    }
    for (const page of Object.values(PAGES)) {
      const dir = page.path === "/" ? appDir : join(appDir, page.path.slice(1));
      assert.ok(existsSync(join(dir, "page.tsx")), `page for ${page.path}`);
    }
  });

  it("keeps llms.txt and the public repo one click from every page", () => {
    assert.ok(FOOTER_LINKS.some((link) => link.href === "/llms.txt"));
    assert.ok(FOOTER_LINKS.some((link) => link.href === REPO_URL));
    assert.ok(NAV_LINKS.some((link) => link.href === REPO_URL));
  });

  it("subpage metadata keeps the canonical and the llms alternates", () => {
    for (const key of ["features", "docs", "download"] as const) {
      const meta = pageMetadata(key);
      assert.match(String(meta.title), new RegExp(PRODUCT_NAME));
      assert.equal(meta.alternates?.canonical, PAGES[key].path);
      const types = meta.alternates?.types as Record<string, { url: string }[]>;
      assert.ok(types["text/plain"].some((entry) => entry.url === "/llms.txt"));
    }
  });

  it("sitemap and llms.txt name every page", () => {
    const sitemap = readFileSync(join(appDir, "sitemap.ts"), "utf8");
    const llms = readFileSync(join(here, "../../public/llms.txt"), "utf8");
    for (const key of ["features", "docs", "download"] as const) {
      assert.match(sitemap, new RegExp(`PAGES\\.${key}\\.path`));
      assert.ok(llms.includes(`https://go7workhorse.com${PAGES[key].path}`), `llms lists ${key}`);
    }
  });
});

describe("structured data", () => {
  it("describes one free, MIT desktop app for macOS and Windows", () => {
    const app = softwareApplicationJsonLd();
    assert.equal(app["@type"], "SoftwareApplication");
    assert.equal(app.name, PRODUCT_NAME);
    assert.deepEqual(app.operatingSystem, ["Windows", "macOS"]);
    assert.equal(app.offers.price, "0");
    assert.equal(app.downloadUrl, RELEASES_URL);
    assert.match(app.license, /LICENSE/);
    assert.ok(app.featureList.length >= 10);
    assert.deepEqual(app.featureList, FEATURE_LIST);
    assert.ok(app.sameAs.includes(REPO_URL));
    assert.equal(organizationLd().name, "Go7 Studio");
    assert.equal(webSiteLd().name, PRODUCT_NAME);
  });

  it("builds breadcrumbs, an FAQ and an article with absolute urls", () => {
    const crumbs = breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Docs", path: "/docs" },
    ]);
    assert.equal(crumbs.itemListElement[1].item, "https://go7workhorse.com/docs");
    assert.equal(crumbs.itemListElement[1].position, 2);
    const faq = faqLd(FAQ);
    assert.equal(faq["@type"], "FAQPage");
    assert.equal(faq.mainEntity.length, FAQ.length);
    assert.equal(faq.mainEntity[0].acceptedAnswer.text, FAQ[0].a);
    const article = techArticleLd({ path: "/docs", headline: "Docs", description: "d" });
    assert.equal(article.url, "https://go7workhorse.com/docs");
    assert.equal(article["@type"], "TechArticle");
  });

  it("serialises without a raw closing tag", () => {
    for (const obj of [softwareApplicationJsonLd(), faqLd(FAQ), organizationLd()]) {
      const json = JSON.stringify(obj);
      assert.doesNotMatch(json, /<\/script/i);
    }
  });
});

describe("latest release parser", () => {
  const fixture = {
    tag_name: "v0.6.2",
    html_url: "https://github.com/go7studio/Go7-Workhorse/releases/tag/v0.6.2",
    published_at: "2026-08-18T22:32:20Z",
    assets: [
      { name: "Go7-Workhorse-0.6.2-mac-arm64.dmg", browser_download_url: "https://x/arm.dmg", size: 310432490 },
      { name: "Go7-Workhorse-0.6.2-mac-x64.dmg", browser_download_url: "https://x/x64.dmg", size: 315463183 },
      { name: "Go7-Workhorse-Setup-0.6.2.exe", browser_download_url: "https://x/setup.exe", size: 250658237 },
    ],
  };

  it("finds the three installers and strips the v", () => {
    const latest = parseLatestRelease(fixture);
    assert.ok(latest);
    assert.equal(latest.version, "0.6.2");
    assert.equal(latest.macArm?.href, "https://x/arm.dmg");
    assert.equal(latest.macIntel?.href, "https://x/x64.dmg");
    assert.equal(latest.windows?.href, "https://x/setup.exe");
    assert.equal(latest.macArm?.size, "296 MB");
    assert.equal(latest.notesUrl, fixture.html_url);
  });

  it("returns null for junk, an empty release, or a missing tag", () => {
    assert.equal(parseLatestRelease(null), null);
    assert.equal(parseLatestRelease({}), null);
    assert.equal(parseLatestRelease({ tag_name: "v1.0.0", assets: [] }), null);
    assert.equal(parseLatestRelease({ assets: fixture.assets }), null);
  });

  it("formats sizes in MB and GB", () => {
    assert.equal(formatSize(0), "");
    assert.equal(formatSize(1024 * 1024 * 250), "250 MB");
    assert.equal(formatSize(1024 * 1024 * 1024 * 1.5), "1.5 GB");
  });
});
