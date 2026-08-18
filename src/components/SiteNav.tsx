import { NAV_LINKS, PAGES } from "@/lib/pages";
import { PRODUCT_NAME } from "@/lib/site";

export function SiteNav({ current = "/" }: { current?: string }) {
  return (
    <header className="nav">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="nav-inner">
        <a className="brand" href="/">
          <img src="/logo.png" alt="" width={26} height={26} />
          <span>{PRODUCT_NAME}</span>
        </a>
        <nav className="nav-links" aria-label="Site">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.href === current ? "page" : undefined}
              className={link.href.startsWith("http") ? "nav-ext" : undefined}
            >
              {link.label}
            </a>
          ))}
          <a
            className="nav-cta"
            href={PAGES.download.path}
            aria-current={PAGES.download.path === current ? "page" : undefined}
          >
            {PAGES.download.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
