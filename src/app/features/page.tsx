import type { Metadata } from "next";
import { OnThisPage, Sections } from "@/components/Blocks";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { FEATURE_SECTIONS } from "@/lib/content";
import { FEATURES_MD_URL, PAGES, pageMetadata } from "@/lib/pages";
import { breadcrumbLd, webPageLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata("features");

export default function FeaturesPage() {
  const page = PAGES.features;
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

      <main className="sub" id="main">
        <PageHero
          title="Everything the desk does."
          lead="Every ability that ships, on one page. It follows the repo's FEATURES.md line for line: if it is not there, it is not shipped."
        >
          <OnThisPage sections={FEATURE_SECTIONS} />
        </PageHero>

        <article className="prose">
          <Sections sections={FEATURE_SECTIONS} />
          <p className="prose-note">
            The source of truth is{" "}
            <a href={FEATURES_MD_URL}>docs/FEATURES.md</a> in the public repo. Every release updates it.
          </p>
        </article>

        <section className="outro" aria-labelledby="outro-title">
          <h2 id="outro-title" className="outro-title">
            Get the desk.
          </h2>
          <p className="outro-lead">Windows and macOS. Open source under MIT.</p>
          <Cta linkHref={PAGES.docs.path} linkLabel="Read the docs" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
