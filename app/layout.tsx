import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSlot } from "@/components/ads/AdSlot";
import { buildRootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f6" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="ko" className="scroll-smooth">
      <body className="app-bg flex min-h-screen flex-col antialiased">
        {adsClient ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        ) : null}
        <Script
          async
          src="https://ads-partners.coupang.com/g.js"
          strategy="lazyOnload"
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-[var(--foreground)] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[var(--background)] focus:shadow-[var(--shadow-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--ring-offset)]"
        >
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main-content" className="flex min-h-0 min-w-0 flex-1 flex-col" tabIndex={-1}>
          {children}
        </main>
        <div className="pointer-events-none fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
          <div className="pointer-events-auto origin-left scale-[0.34] sm:scale-[0.42] lg:scale-[0.7] xl:scale-100">
            <AdSlot variant="floatingLeft" />
          </div>
        </div>
        <div className="pointer-events-none fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
          <div className="pointer-events-auto origin-right scale-[0.34] sm:scale-[0.42] lg:scale-[0.7] xl:scale-100">
            <AdSlot variant="floatingRight" />
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
