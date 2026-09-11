import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Pathway_Extreme } from "next/font/google";
import "./globals.css";

const displayFont = Pathway_Extreme({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-display",
});

const labelFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-label",
});

const quoteFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-quote",
});

export const metadata: Metadata = {
  title: "KORALS",
  description: "Korals is a boutique web studio for ambitious teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${labelFont.variable} ${quoteFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
