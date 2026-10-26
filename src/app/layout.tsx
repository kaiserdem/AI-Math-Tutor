import type { Metadata } from "next";
import { Manrope, Literata } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const display = Literata({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Основа — AI-репетитор з математики",
  description:
    "Інтерактивний репетитор з математики: курс радянської школи, практика на дошці, прогрес для батьків.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${sans.variable} ${display.variable} antialiased min-h-screen`}
      >
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
