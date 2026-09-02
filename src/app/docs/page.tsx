import type { Metadata } from "next";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { Inline } from "@/components/Inline";
import { CONTACT_ROUTES } from "@/lib/content";
import { DOCS } from "@/lib/docs";
import { PAGES, pageMetadata } from "@/lib/pages";
import { breadcrumbLd, docsIndexLd, webPageLd } from "@/lib/schema";
import { REPO_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata("docs");

export default function DocsIndexPage() {
  const page = PAGES.docs;
  return (
    <div className="page">
      <JsonLd
        data={[
          webPageLd({ path: page.path, name: page.title, description: page.description }),
          docsIndexLd(),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: page.label, path: page.path },
          ]),
        ]}
      />
      <SiteNav current={page.path} />

      <main className="sub" id="main">
        <PageHero
          title="Docs."
          lead="Install, connect what you already pay for, and read leftover. Short on purpose. The repo holds the rest."
        />

        <ol className="doc-cards" aria-label="Guides">
          {DOCS.map((doc, index) => (
            <li key={doc.slug} className="doc-card rise" style={{ ["--i" as string]: Math.min(index, 8) + 2 }}>
              <a href={`${page.path}/${doc.slug}`}>
                <span className="doc-card-n">{String(index + 1).padStart(2, "0")}</span>
                <strong>{doc.title}</strong>
                <span className="doc-card-lead">{doc.lead}</span>
              </a>
            </li>
          ))}
        </ol>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title" className="section-title">
            Get in touch.
          </h2>
          <ul className="contact-list">
            {CONTACT_ROUTES.map((route) => (
              <li key={route.where}>
                <span className="contact-need">{route.need}</span>
                <a className="contact-where" href={route.href}>
                  {route.where}
                  <span aria-hidden="true">›</span>
                </a>
                <span className="contact-note">
                  <Inline text={route.note} />
                </span>
              </li>
            ))}
          </ul>
          <p className="prose-note center">
            Something missing? The <a href={REPO_URL}>public repo</a> has the README, every release, and an issue tracker.
          </p>
        </section>

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
