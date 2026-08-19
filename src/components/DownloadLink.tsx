"use client";

import type { DownloadAction } from "@/lib/site";
import { trackDownloadNavigation } from "@/lib/analytics";

type DownloadLinkProps = {
  action: DownloadAction;
  className: string;
};

export function DownloadLink({ action, className }: DownloadLinkProps) {
  return (
    <a
      className={className}
      href={action.href}
      onClick={(event) => {
        trackDownloadNavigation(event, action);
      }}
    >
      {action.label}
    </a>
  );
}
