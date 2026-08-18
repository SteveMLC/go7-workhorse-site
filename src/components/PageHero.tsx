import type { ReactNode } from "react";

/** The top of a subpage: a small light, the title, one line under it. */
export function PageHero({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children?: ReactNode;
}) {
  return (
    <section className="sub-hero">
      <div className="sub-halo" aria-hidden="true" />
      <h1 className="rise" style={{ ["--i" as string]: 1 }}>
        {title}
      </h1>
      <p className="sub-lead rise" style={{ ["--i" as string]: 2 }}>
        {lead}
      </p>
      {children ? (
        <div className="rise" style={{ ["--i" as string]: 3 }}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
