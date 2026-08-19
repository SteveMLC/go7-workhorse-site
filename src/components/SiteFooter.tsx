import { FOOTER_LINKS } from "@/lib/pages";
import { PRODUCT_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="foot">
      <span className="foot-brand">
        <img src="/logo.png" alt="" width={18} height={18} />
        {PRODUCT_NAME} · MIT · Go7 Studio
      </span>
      <nav className="foot-links" aria-label="Footer">
        {FOOTER_LINKS.map((link) => (
          <a key={link.href} href={link.href} data-analytics-outbound={link.analyticsEvent}>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
