import type { Metadata } from "next";
import { ChangelogLive } from "@/components/ChangelogLive";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { fetchReleasesAtBuild } from "@/lib/changelog";
import { PAGES, RELEASES_INDEX_URL, pageMetadata } from "@/lib/pages";
import { breadcrumbLd, webPageLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata("changelog");

export default async function ChangelogPage() {
  const page = PAGES.changelog;
  const releases = await fetchReleasesAtBuild();
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
          title="Changelog."
          lead="What changed, release by release. Read from GitHub Releases, where the installers are."
        />

        <section className="log-wrap rise" style={{ ["--i" as string]: 3 }} aria-label="Releases">
          <ChangelogLive initial={releases} />
        </section>

        <p className="prose-note center">
          Versions follow the repo's rules; the desk checks GitHub for a newer release from Settings → Profile.{" "}
          <a href={RELEASES_INDEX_URL}>All releases on GitHub</a>.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
