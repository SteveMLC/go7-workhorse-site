import { DownloadLink } from "@/components/DownloadLink";
import { homeModel } from "@/lib/site";

/** The download pair, with one quiet link under it. Same on every page. */
export function Cta({
  linkHref,
  linkLabel,
  className = "",
}: {
  linkHref: string;
  linkLabel: string;
  className?: string;
}) {
  const model = homeModel();
  return (
    <div className={`cta ${className}`.trim()}>
      <div className="actions">
        {model.downloads.map((item) => (
          <DownloadLink
            key={item.platform}
            action={item}
            className={`btn btn-primary btn-${item.platform}`}
          />
        ))}
      </div>
      <p className="repo">
        <a className="more" href={linkHref}>
          {linkLabel}
          <span aria-hidden="true">›</span>
        </a>
      </p>
    </div>
  );
}
