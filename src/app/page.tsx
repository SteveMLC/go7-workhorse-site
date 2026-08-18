import { DeskWindow } from "@/components/DeskWindow";
import { homeModel } from "@/lib/site";

export default function HomePage() {
  const model = homeModel();

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="/">
          <img src="/logo.png" alt="" width={28} height={28} />
          {model.productName}
        </a>
        <nav className="top-links">
          <a href={model.repoUrl}>{model.repoLabel}</a>
          <a href={model.downloads[0].href}>Releases</a>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">Desktop app · Windows and macOS</p>
          <h1>{model.productName}</h1>
          <p className="desk-line">{model.deskLine}</p>
          <p className="lead">{model.lead}</p>
          <p className="claim">{model.subscriptionClaim}</p>
          <div className="actions">
            {model.downloads.map((item) => (
              <a
                key={item.platform}
                className={`btn btn-${item.platform}`}
                href={item.href}
              >
                {item.label}
              </a>
            ))}
            <a className="btn btn-ghost" href={model.repoUrl}>
              {model.repoLabel}
            </a>
          </div>
          <p className="no-host">{model.noHostClaim}</p>
        </div>
        <DeskWindow />
      </section>

      <section className="fit">
        <div>
          <h3>A good fit if</h3>
          <ul>
            {model.fit.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Not a fit if</h3>
          <ul>
            {model.notFit.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="foot">
        <span>{model.productName} · MIT · Go7 Studio</span>
        <a href="https://go7studio.com">go7studio.com</a>
      </footer>
    </main>
  );
}
