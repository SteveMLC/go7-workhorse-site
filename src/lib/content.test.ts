import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { dedupeItems, notesToBlocks, parseReleases } from "./changelog.ts";
import type { Block } from "./content.ts";
import { DOWNLOAD_STEPS, FAQ, FEATURE_SECTIONS, HOME_FACTS } from "./content.ts";
import { DESK_COMMANDS } from "./desk-commands.ts";
import { DOCS, DOC_SLUGS, docBySlug, docNeighbours } from "./docs.ts";
import { blocksToText, plainText } from "./llms.ts";
import { FOOTER_LINKS, NAV_LINKS, PAGES, metadataFor, pageMetadata } from "./pages.ts";
import { formatDate, formatSize, parseLatestRelease } from "./release.ts";
import { FEATURE_LIST } from "./feature-list.ts";
import { breadcrumbLd, docsIndexLd, faqLd, organizationLd, techArticleLd, webSiteLd } from "./schema.ts";
import { DISCORD_URL, PRODUCT_NAME, RELEASES_URL, REPO_URL, softwareApplicationJsonLd } from "./site.ts";

const here = dirname(fileURLToPath(import.meta.url));
const appDir = join(here, "../app");

function blockStrings(blocks: Block[]): string[] {
  const parts: string[] = [];
  for (const block of blocks) {
    if (block.kind === "p" || block.kind === "code" || block.kind === "h") parts.push(block.text);
    if (block.kind === "ul" || block.kind === "ol") parts.push(...block.items);
    if (block.kind === "table") parts.push(...block.head, ...block.rows.flat());
    if (block.kind === "video" || block.kind === "image") parts.push(block.alt, block.caption ?? "");
  }
  return parts;
}

const ALL_SECTIONS = [...FEATURE_SECTIONS, ...DOCS.flatMap((doc) => doc.sections)];

/** Every string a human page prints, flattened. */
function humanCopy(): string {
  const parts: string[] = [];
  for (const fact of HOME_FACTS) parts.push(fact.title, fact.body);
  for (const doc of DOCS) parts.push(doc.title, doc.lead);
  for (const section of ALL_SECTIONS) {
    parts.push(section.title, ...blockStrings(section.blocks));
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
    assert.ok(FAQ.length >= 8);
    for (const section of ALL_SECTIONS) {
      assert.match(section.id, /^[a-z][a-z0-9-]*$/);
      assert.ok(section.blocks.length > 0, `${section.id} has blocks`);
    }
    assert.equal(new Set(FEATURE_SECTIONS.map((s) => s.id)).size, FEATURE_SECTIONS.length);
  });

  it("carry real footage of the desk, with every file present", () => {
    const media = ALL_SECTIONS.flatMap((s) => s.blocks).filter((b) => b.kind === "video" || b.kind === "image");
    assert.ok(media.length >= 6, "footage on the features page and in the guides");
    const seen = new Set<string>();
    for (const block of media) {
      assert.ok(block.alt.length > 40, `alt text names what is on screen: ${block.src}`);
      const files = block.kind === "video" ? [`${block.src}.mp4`, `${block.src}.webm`, block.poster] : [block.src];
      for (const file of files) assert.ok(existsSync(join(here, "../../public", file)), `media file ${file}`);
      assert.equal(seen.has(block.src), false, `${block.src} is used once`);
      seen.add(block.src);
    }
  });

  it("ship no media file the pages stopped using", () => {
    const used = new Set(
      ALL_SECTIONS.flatMap((s) => s.blocks).flatMap((b) =>
        b.kind === "video" ? [`${b.src}.mp4`, `${b.src}.webm`, b.poster] : b.kind === "image" ? [b.src] : [],
      ),
    );
    const dir = join(here, "../../public/media");
    for (const name of readdirSync(dir)) {
      assert.ok(used.has(`/media/${name}`), `/media/${name} is referenced by a page`);
    }
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

describe("docs", () => {
  it("are fourteen guides with unique kebab slugs, in a fixed reading order", () => {
    assert.equal(DOCS.length, 14);
    assert.equal(new Set(DOC_SLUGS).size, DOCS.length);
    for (const doc of DOCS) {
      assert.match(doc.slug, /^[a-z][a-z0-9-]*$/);
      assert.ok(doc.title.length > 2 && doc.lead.length > 10, doc.slug);
      assert.ok(doc.sections.length > 0 || doc.faq, `${doc.slug} has content`);
      assert.equal(new Set(doc.sections.map((s) => s.id)).size, doc.sections.length, `${doc.slug} section ids unique`);
    }
    for (const slug of ["getting-started", "vendors", "commands", "privacy", "troubleshooting", "faq"]) {
      assert.ok(docBySlug(slug), `doc ${slug}`);
    }
    assert.equal(DOC_SLUGS[0], "getting-started");
    assert.equal(docNeighbours("getting-started").prev, undefined);
    assert.equal(docNeighbours("getting-started").next?.slug, "vendors");
    assert.equal(docNeighbours("faq").next, undefined);
  });

  it("list every desk palette command in the reference", () => {
    const commands = docBySlug("commands");
    assert.ok(commands);
    const table = commands.sections[0].blocks.find((b) => b.kind === "table");
    assert.ok(table && table.kind === "table");
    assert.equal(table.rows.length, DESK_COMMANDS.length);
    for (const command of DESK_COMMANDS) {
      assert.ok(table.rows.some((row) => row[0].includes(`\`${command.name}\``)), `row for ${command.name}`);
    }
    assert.ok(DESK_COMMANDS.some((c) => c.name === "/settings" && c.aliases?.includes("/config")));
  });

  it("only link to pages and anchors that exist", () => {
    const text = humanCopy();
    const internal = [...text.matchAll(/\]\((\/[^)#\s]*)(#[^)\s]*)?\)/g)];
    assert.ok(internal.length > 0);
    for (const [, path, hash] of internal) {
      const clean = path.replace(/\/$/, "");
      if (clean === "" || clean === "/") continue;
      if (clean.startsWith("/docs/")) {
        const doc = docBySlug(clean.slice("/docs/".length));
        assert.ok(doc, `docs link ${clean}`);
        if (hash) assert.ok(doc.sections.some((s) => `#${s.id}` === hash), `anchor ${clean}${hash}`);
        continue;
      }
      const dir = join(appDir, clean.slice(1));
      assert.ok(existsSync(join(dir, "page.tsx")), `page for ${clean}`);
    }
  });

  it("build metadata and schema per guide", () => {
    for (const doc of DOCS) {
      const meta = metadataFor({ path: `/docs/${doc.slug}`, title: doc.title, description: doc.lead });
      assert.equal(meta.alternates?.canonical, `/docs/${doc.slug}`);
      assert.match(String(meta.title), /Go7 Workhorse/);
    }
    const list = docsIndexLd();
    assert.equal(list.itemListElement.length, DOCS.length);
    assert.equal(list.itemListElement[0].url, "https://go7workhorse.com/docs/getting-started");
  });
});

describe("changelog reader", () => {
  const body = `## [0.6.2](https://github.com/go7studio/Go7-Workhorse/compare/v0.6.1...v0.6.2) (2026-08-18)\n\n\n### Features\n\n* **desk:** keep leftover ring per bot ([1a2b3c4](https://github.com/go7studio/Go7-Workhorse/commit/1a2b3c4))\n* wrap a long line\n  that continues here\n\n### Bug Fixes\n\n* **watch:** hold on <b>send</b> ([9f8e7d6](https://github.com/x/y))\n\nPlain closing line.`;

  it("turns release-please markdown into headings, bullets and paragraphs, and drops the version line", () => {
    const blocks = notesToBlocks(body);
    assert.deepEqual(blocks.map((b) => b.kind), ["h", "ul", "h", "ul", "p"]);
    const first = blocks[1];
    assert.ok(first.kind === "ul");
    assert.equal(first.items.length, 2);
    assert.match(first.items[0], /^\*\*desk:\*\* keep leftover ring/);
    assert.equal(first.items[1], "wrap a long line that continues here");
    const fixes = blocks[3];
    assert.ok(fixes.kind === "ul");
    assert.doesNotMatch(fixes.items[0], /<b>/);
    assert.equal(blocks[0].kind === "h" && blocks[0].text, "Features");
  });

  it("drops bullets that repeat an earlier one under a different commit hash", () => {
    const twice = [
      "one call shows the whole worker board ([97d0b6d](https://x/97d0b6d))",
      "one call shows the whole worker board ([7fb49f6](https://x/7fb49f6))",
      "a different change entirely ([1234abc](https://x/1234abc))",
    ];
    assert.deepEqual(dedupeItems(twice), [twice[0], twice[2]]);
    const blocks = notesToBlocks("### Features\n\n* " + twice.join("\n* "));
    const list = blocks.find((b) => b.kind === "ul");
    assert.ok(list && list.kind === "ul");
    assert.equal(list.items.length, 2);
  });

  it("parses the releases list, skips drafts, and strips the v", () => {
    const releases = parseReleases([
      { tag_name: "v0.6.2", name: "Go7 Workhorse 0.6.2", html_url: "https://x/v0.6.2", published_at: "2026-08-18T22:32:20Z", body },
      { tag_name: "v0.6.1", draft: true, body: "* nope" },
      { tag_name: "v0.6.0", name: "", body: null },
      { nonsense: true },
    ]);
    assert.equal(releases.length, 2);
    assert.equal(releases[0].version, "0.6.2");
    assert.equal(releases[0].blocks.length, 5);
    assert.equal(releases[1].name, "Go7 Workhorse 0.6.0");
    assert.equal(releases[1].blocks.length, 0);
    assert.deepEqual(parseReleases(null), []);
    assert.deepEqual(parseReleases({}), []);
  });
});

describe("llms digest", () => {
  it("strips the inline marks and flattens blocks to text", () => {
    assert.equal(plainText("Use **Settings → LLMs**, then `/watch` and [docs](/docs)."), "Use Settings → LLMs, then /watch and docs (/docs).");
    const text = blocksToText([
      { kind: "h", text: "Head" },
      { kind: "ul", items: ["**a**", "`b`"] },
      { kind: "table", head: ["X", "Y"], rows: [["1", "`2`"]] },
    ]);
    assert.equal(text, "Head\n- a\n- b\nX | Y\n1 | 2");
    const full = readFileSync(join(here, "../../public/llms-full.txt"), "utf8");
    assert.match(full, /## Docs digest/);
    assert.match(full, /## Features digest/);
    for (const doc of DOCS) assert.ok(full.includes(`https://go7workhorse.com/docs/${doc.slug}`), `digest lists ${doc.slug}`);
    assert.doesNotMatch(full, /\*\*/);
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

  it("puts Discord in the footer, not the top bar", () => {
    assert.ok(FOOTER_LINKS.some((link) => link.label === "Discord" && link.href === DISCORD_URL));
    assert.equal(DISCORD_URL, "https://discord.gg/QwVJJmFBMQ");
    assert.equal(NAV_LINKS.some((link) => /discord/i.test(link.label) || /discord/i.test(link.href)), false);
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
    for (const key of ["features", "docs", "download", "changelog"] as const) {
      assert.match(sitemap, new RegExp(`PAGES\\.${key}\\.path`));
      assert.ok(llms.includes(`https://go7workhorse.com${PAGES[key].path}`), `llms lists ${key}`);
    }
    assert.match(sitemap, /DOCS\.map/);
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

  it("prints the same date on the build machine and in the browser (UTC)", () => {
    const before = process.env.TZ;
    for (const zone of ["America/Los_Angeles", "Asia/Tokyo", "UTC"]) {
      process.env.TZ = zone;
      assert.equal(formatDate("2026-08-18T02:40:54Z"), "18 Aug 2026", zone);
      assert.equal(formatDate("2026-08-18T23:59:59Z"), "18 Aug 2026", zone);
    }
    process.env.TZ = before;
    assert.equal(formatDate("garbage"), "");
  });

  it("formats sizes in MB and GB", () => {
    assert.equal(formatSize(0), "");
    assert.equal(formatSize(1024 * 1024 * 250), "250 MB");
    assert.equal(formatSize(1024 * 1024 * 1024 * 1.5), "1.5 GB");
  });
});
