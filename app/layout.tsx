import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Forge - Tech Hub & Startup Academy",
  description: "Premium workspace for developers and startup academy where failure is mandatory. Join our tech community today.",
  keywords: ["coworking space", "tech hub", "developer workspace", "startup academy", "entrepreneurship", "private offices"],
  icons: {
    icon: [
      { url: '/gotoforge.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/gotoforge.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: "Forge - Where Developers Build Together",
    description: "Premium workspace and startup academy for the tech community.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
