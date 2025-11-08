import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "The Forge Academy - Where Failure is Mandatory",
  description: "Real teams. Real clients. Real equity. The only academy where you run real companies and earn equity as you learn.",
  keywords: ["startup academy", "entrepreneurship", "business education", "equity learning", "real companies"],
  openGraph: {
    title: "The Forge Academy - Where Failure is Mandatory",
    description: "Real teams. Real clients. Real equity.",
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
