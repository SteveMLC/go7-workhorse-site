import { DOCS } from "@/lib/docs";
import { PAGES } from "@/lib/pages";

/** The docs table of contents. A sticky rail on wide screens, a list under the title on phones. */
export function DocsRail({ current }: { current?: string }) {
  return (
    <nav className="rail" aria-label="Docs">
      <a className="rail-home" href={PAGES.docs.path} aria-current={current ? undefined : "page"}>
        Docs
      </a>
      <ol>
        {DOCS.map((doc) => (
          <li key={doc.slug}>
            <a
              href={`${PAGES.docs.path}/${doc.slug}`}
              aria-current={doc.slug === current ? "page" : undefined}
            >
              {doc.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
