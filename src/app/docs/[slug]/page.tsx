import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inline } from "@/components/Inline";
import { OnThisPage, Sections } from "@/components/Blocks";
import { DocsRail } from "@/components/DocsRail";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { DOCS, DOC_SLUGS, docBySlug, docNeighbours } from "@/lib/docs";
import { PAGES, metadataFor } from "@/lib/pages";
import { breadcrumbLd, faqLd, techArticleLd } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return DOC_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = docBySlug(slug);
  if (!doc) return {};
  return metadataFor({ path: `${PAGES.docs.path}/${doc.slug}`, title: doc.title, description: doc.lead });
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = docBySlug(slug);
  if (!doc) notFound();
  const path = `${PAGES.docs.path}/${doc.slug}`;
  const { prev, next } = docNeighbours(doc.slug);
  const index = DOCS.findIndex((item) => item.slug === doc.slug);

  return (
    <div className="page">
      <JsonLd
        data={[
          techArticleLd({ path, headline: `${doc.title} — Go7 Workhorse docs`, description: doc.lead }),
          ...(doc.faq ? [faqLd(doc.faq)] : []),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: PAGES.docs.label, path: PAGES.docs.path },
            { name: doc.title, path },
          ]),
        ]}
      />
      <SiteNav current={PAGES.docs.path} />

      <main className="sub docs-layout" id="main">
        <DocsRail current={doc.slug} />

        <article className="doc">
          <header className="doc-head">
            <p className="doc-crumb">
              <a href={PAGES.docs.path}>Docs</a>
              <span aria-hidden="true"> / </span>
              <span>
                {String(index + 1).padStart(2, "0")} of {String(DOCS.length).padStart(2, "0")}
              </span>
            </p>
            <h1 className="rise" style={{ ["--i" as string]: 1 }}>
              {doc.title}
            </h1>
            <p className="doc-lead rise" style={{ ["--i" as string]: 2 }}>
              {doc.lead}
            </p>
            {doc.sections.length > 1 ? (
              <div className="rise" style={{ ["--i" as string]: 3 }}>
                <OnThisPage sections={doc.sections} />
              </div>
            ) : null}
          </header>

          <div className="prose doc-body">
            <Sections sections={doc.sections} />

            {doc.faq ? (
              <div className="faq">
                {doc.faq.map((item) => (
                  <details key={item.q}>
                    <summary>{item.q}</summary>
                    <p>
                      <Inline text={item.a} />
                    </p>
                  </details>
                ))}
              </div>
            ) : null}
          </div>

          <nav className="doc-nav" aria-label="Next and previous">
            {prev ? (
              <a className="doc-nav-prev" href={`${PAGES.docs.path}/${prev.slug}`}>
                <span>Previous</span>
                <strong>{prev.title}</strong>
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a className="doc-nav-next" href={`${PAGES.docs.path}/${next.slug}`}>
                <span>Next</span>
                <strong>{next.title}</strong>
              </a>
            ) : (
              <a className="doc-nav-next" href={PAGES.download.path}>
                <span>Then</span>
                <strong>Download the desk</strong>
              </a>
            )}
          </nav>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
