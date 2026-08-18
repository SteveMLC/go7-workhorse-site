import type { Metadata } from "next";
import { DESK_LINE, NO_HOST_CLAIM, PRODUCT_NAME, SITE_ORIGIN } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: `${PRODUCT_NAME} — ${DESK_LINE}`,
  description: `${DESK_LINE} ${NO_HOST_CLAIM} Native desktop for Windows and macOS.`,
  icons: { icon: "/favicon.ico", apple: "/logo.png" },
  openGraph: {
    title: PRODUCT_NAME,
    description: DESK_LINE,
    url: SITE_ORIGIN,
    siteName: PRODUCT_NAME,
    images: [{ url: "/logo.png", width: 512, height: 512, alt: PRODUCT_NAME }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: PRODUCT_NAME,
    description: DESK_LINE,
  },
  alternates: {
    canonical: "/",
    types: {
      "text/plain": [
        { url: "/llms.txt", title: "LLM source" },
        { url: "/llms-full.txt", title: "LLM full brief" },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
