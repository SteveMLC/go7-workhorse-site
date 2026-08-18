"use client";

import type { DownloadAction } from "@/lib/site";
import { trackDownloadClick } from "@/lib/analytics";

type DownloadLinkProps = {
  action: DownloadAction;
  className: string;
};

export function DownloadLink({ action, className }: DownloadLinkProps) {
  return (
    <a
      className={className}
      href={action.href}
      onClick={() => {
        trackDownloadClick(action);
      }}
    >
      {action.label}
    </a>
  );
}
