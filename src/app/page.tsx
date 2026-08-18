import { DeskWindow } from "@/components/DeskWindow";
import { Pointer } from "@/components/Pointer";
import { Stage } from "@/components/Stage";
import { homeModel } from "@/lib/site";

export default function HomePage() {
  const model = homeModel();
  const releases = model.downloads[0].href;

  return (
    <div className="page">
      <Pointer />

      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="/">
            <img src="/logo.png" alt="" width={26} height={26} />
            <span>{model.productName}</span>
          </a>
          <nav className="nav-links" aria-label="Site">
            <a href={model.repoUrl}>{model.repoLabel}</a>
            <a href={releases}>Releases</a>
            <a className="nav-cta" href={releases}>
              Download
            </a>
          </nav>
        </div>
      </header>

      <main>
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
              <a
                key={item.platform}
                className={`btn btn-primary btn-${item.platform}`}
                href={item.href}
              >
                {item.label}
              </a>
            ))}
            <a className="more" href={model.repoUrl}>
              {model.repoLabel}
              <span aria-hidden="true">›</span>
            </a>
          </div>

          <p className="fine rise" style={{ ["--i" as string]: 6 }}>
            {model.noHostClaim}
          </p>

          <div className="thread rise" style={{ ["--i" as string]: 8 }} aria-hidden="true" />
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
      </main>

      <footer className="foot">
        <span>{model.productName} · MIT · Go7 Studio</span>
        <span className="foot-links">
          <a href="https://go7studio.com">go7studio.com</a>
          <span aria-hidden="true"> · </span>
          <a href={model.agentSource}>llms.txt</a>
        </span>
      </footer>
    </div>
  );
}
