"use client";

import type { DownloadAction } from "@/lib/site";

type DownloadLinkProps = {
  action: DownloadAction;
  className: string;
};

export function DownloadLink({ action, className }: DownloadLinkProps) {
  return (
    <a
      className={className}
      href={action.href}
      data-analytics-download={action.platform}
    >
      {action.label}
    </a>
  );
}
