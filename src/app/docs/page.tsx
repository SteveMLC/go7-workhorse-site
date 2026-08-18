import type { Metadata } from "next";
import { Inline } from "@/components/Inline";
import { OnThisPage, Sections } from "@/components/Blocks";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { DOC_SECTIONS, FAQ } from "@/lib/content";
import { PAGES, pageMetadata } from "@/lib/pages";
import { breadcrumbLd, faqLd, techArticleLd } from "@/lib/schema";
import { REPO_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata("docs");

export default function DocsPage() {
  const page = PAGES.docs;
  return (
    <div className="page">
      <JsonLd
        data={[
          techArticleLd({ path: page.path, headline: `${page.title} — Go7 Workhorse`, description: page.description }),
          faqLd(FAQ),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: page.label, path: page.path },
          ]),
        ]}
      />
      <SiteNav current={page.path} />

      <main className="sub">
        <PageHero
          title="Docs."
          lead="Install, connect what you already pay for, and read leftover. Short on purpose. The repo holds the rest."
        >
          <OnThisPage sections={DOC_SECTIONS} extra={[{ id: "faq", title: "FAQ" }]} />
        </PageHero>

        <article className="prose">
          <Sections sections={DOC_SECTIONS} />

          <section className="doc-section" id="faq">
            <h2>
              <a href="#faq">FAQ</a>
            </h2>
            <div className="faq">
              {FAQ.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>
                    <Inline text={item.a} />
                  </p>
                </details>
              ))}
            </div>
          </section>

          <p className="prose-note">
            Something missing? The <a href={REPO_URL}>public repo</a> has the README, every release, and an issue tracker.
          </p>
        </article>

        <section className="outro" aria-labelledby="outro-title">
          <h2 id="outro-title" className="outro-title">
            Get the desk.
          </h2>
          <p className="outro-lead">Windows and macOS. Open source under MIT.</p>
          <Cta linkHref={PAGES.features.path} linkLabel="Everything it does" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
