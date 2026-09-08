import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "coworking space Lagos",
    "workspace Nigeria",
    "private office Lagos",
    "hot desk",
    "developer workspace",
    "tech hub Lagos",
  ],
  applicationName: site.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${site.url}/blog/rss.xml` },
  },
  icons: {
    icon: [{ url: "/gotoforge.svg", type: "image/svg+xml" }],
    apple: [{ url: "/gotoforge.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: "en_NG",
    type: "website",
    // A static JPEG, not the /opengraph-image route: ImageResponse only emits
    // PNG, and WhatsApp does not reliably fetch a card that size.
    images: [
      {
        url: "/og/card.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/og/card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Scroll reveals are opacity:0 until observed; without JS they must not
            hide the page entirely. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ember-400 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink-950"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
