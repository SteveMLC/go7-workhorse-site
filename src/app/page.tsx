import { Cta } from "@/components/Cta";
import { DeskWindow } from "@/components/DeskWindow";
import { DownloadLink } from "@/components/DownloadLink";
import { JsonLd } from "@/components/JsonLd";
import { Pointer } from "@/components/Pointer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { Stage } from "@/components/Stage";
import { HOME_FACTS } from "@/lib/content";
import { PAGES } from "@/lib/pages";
import { homeFactsLd, organizationLd, webSiteLd } from "@/lib/schema";
import { homeModel } from "@/lib/site";

export default function HomePage() {
  const model = homeModel();

  return (
    <div className="page">
      <JsonLd data={[organizationLd(), webSiteLd(), homeFactsLd()]} />
      <Pointer />
      <SiteNav current="/" />

      <main id="main">
        <section className="hero">
          <div className="halo" aria-hidden="true">
            <i />
          </div>

          <div className="mark">
            <picture>
              <source srcSet="/horse.webp" type="image/webp" />
              <img
                src="/horse.png"
                alt=""
                width={541}
                height={640}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>

          <p className="eyebrow rise" style={{ ["--i" as string]: 1 }}>
            Desktop app · Windows and macOS
          </p>
          <h1 className="rise" style={{ ["--i" as string]: 2 }}>
            {model.productName}
          </h1>
          <p className="desk-line rise" style={{ ["--i" as string]: 3 }}>
            {model.deskLine}
          </p>
          <p className="lead rise" style={{ ["--i" as string]: 4 }}>
            {model.lead}
          </p>

          <div className="actions rise" style={{ ["--i" as string]: 5 }}>
            {model.downloads.map((item) => (
              <DownloadLink
                key={item.platform}
                action={item}
                className={`btn btn-primary btn-${item.platform}`}
              />
            ))}
          </div>

          <p className="repo rise" style={{ ["--i" as string]: 6 }}>
            <a className="more" href={model.repoUrl}>
              {model.repoLabel}
              <span aria-hidden="true">›</span>
            </a>
          </p>

          <div className="thread rise" style={{ ["--i" as string]: 7 }} aria-hidden="true" />
        </section>

        <section className="shot" aria-labelledby="claim">
          <Stage>
            <h2 id="claim" className="claim">
              {model.subscriptionClaim}
            </h2>
            <div className="stage-wrap">
              <div className="stage-glow" aria-hidden="true" />
              <div className="tilt">
                <DeskWindow />
                <div className="sheen" aria-hidden="true" />
              </div>
            </div>
          </Stage>
        </section>

        <section className="facts" aria-labelledby="facts-title">
          <Stage>
            <h2 id="facts-title" className="section-title">
              What it does.
            </h2>
            <div className="tiles">
              {HOME_FACTS.map((fact, index) => (
                <article className="tile" key={fact.title} style={{ ["--i" as string]: index }}>
                  <h3>{fact.title}</h3>
                  <p>{fact.body}</p>
                </article>
              ))}
            </div>
            <p className="tiles-more">
              <a className="more" href={PAGES.features.path}>
                Everything it does<span aria-hidden="true">›</span>
              </a>
            </p>
          </Stage>
        </section>

        <section className="outro" aria-labelledby="outro-title">
          <h2 id="outro-title" className="outro-title">
            {model.deskLine}
          </h2>
          <p className="outro-lead">Windows and macOS. Open source under MIT.</p>
          <Cta linkHref={PAGES.docs.path} linkLabel="Read the docs" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
