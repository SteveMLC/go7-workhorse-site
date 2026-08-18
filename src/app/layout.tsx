import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
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
    images: [{ url: "/og.png", width: 1280, height: 640, alt: PRODUCT_NAME }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCT_NAME,
    description: DESK_LINE,
    images: ["/og.png"],
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

export const viewport: Viewport = {
  themeColor: "#08081f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Marks JS before first paint so scroll-reveal motion never hides the page from a no-JS reader. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <GoogleAnalytics />
      </head>
      <body>{children}</body>
    </html>
  );
}
