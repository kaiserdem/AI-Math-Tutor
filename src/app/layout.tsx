import type { Metadata } from "next";
import { Literata, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const display = Literata({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Основа — AI-репетитор з математики",
  description:
    "Персоналізована математична освіта в дусі класичної школи: AI-репетитор, адаптивна практика, дошка й прогрес.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uk"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
