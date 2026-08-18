import type { Metadata } from "next";
import { Inline } from "@/components/Inline";
import { JsonLd } from "@/components/JsonLd";
import { LatestRelease } from "@/components/LatestRelease";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { DOWNLOAD_STEPS } from "@/lib/content";
import { PAGES, pageMetadata } from "@/lib/pages";
import { breadcrumbLd, webPageLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata("download");

export default function DownloadPage() {
  const page = PAGES.download;
  return (
    <div className="page">
      <JsonLd
        data={[
          webPageLd({ path: page.path, name: page.title, description: page.description }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: page.label, path: page.path },
          ]),
        ]}
      />
      <SiteNav current={page.path} />

      <main className="sub">
        <PageHero
          title="Download."
          lead="Windows and macOS. Installers come from GitHub Releases, built and signed for each platform."
        />

        <section className="dl-wrap rise" style={{ ["--i" as string]: 3 }} aria-label="Installers">
          <LatestRelease />
        </section>

        <article className="prose prose-cols">
          <section className="doc-section" id="mac">
            <h2>On a Mac</h2>
            <ul>
              {DOWNLOAD_STEPS.mac.map((line) => (
                <li key={line}>
                  <Inline text={line} />
                </li>
              ))}
            </ul>
          </section>
          <section className="doc-section" id="windows">
            <h2>On Windows</h2>
            <ul>
              {DOWNLOAD_STEPS.windows.map((line) => (
                <li key={line}>
                  <Inline text={line} />
                </li>
              ))}
            </ul>
          </section>
          <section className="doc-section" id="then">
            <h2>Then</h2>
            <ol>
              {DOWNLOAD_STEPS.then.map((line) => (
                <li key={line}>
                  <Inline text={line} />
                </li>
              ))}
            </ol>
          </section>
          <section className="doc-section" id="linux">
            <h2>Linux</h2>
            <p>Builds and tests in CI. No installer yet.</p>
          </section>
        </article>

        <p className="prose-note center">
          Need a hand? <a href={PAGES.docs.path}>Read the docs</a> or open an issue in the public repo.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
