import type { Metadata } from "next";
import { Archivo_Black, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
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
  description: "A coral tribute experience",
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
