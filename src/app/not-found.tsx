import type { Metadata } from "next";
import { Cta } from "@/components/Cta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { PAGES } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Not found — Go7 Workhorse",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="page">
      <SiteNav />
      <main className="sub" id="main">
        <section className="sub-hero">
          <div className="sub-halo" aria-hidden="true" />
          <p className="eyebrow rise" style={{ ["--i" as string]: 1 }}>
            404
          </p>
          <h1 className="rise" style={{ ["--i" as string]: 2 }}>
            Nothing at this address.
          </h1>
          <p className="sub-lead rise" style={{ ["--i" as string]: 3 }}>
            The desk is one page, plus features, docs and download.
          </p>
        </section>
        <section className="outro">
          <Cta linkHref={PAGES.home.path} linkLabel="Back to the door" />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
