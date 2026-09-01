import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { JetBrains_Mono, Open_Sans, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

// next/font/google downloads and self-hosts these at build time - the
// browser never makes a runtime request to Google Fonts, which removes the
// extra external round trip the original prototype had (see DEVELOPMENT.md
// 2: "Fonts (Google Fonts CDN)").
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Image Converter – Convert, Compress & Optimize Images Online",
    template: "%s — cloudvertify",
  },
  description:
    "Convert JPG, PNG, WebP, AVIF and HEIC images online. Compress and optimize images without losing quality. Fast, free, secure and no registration required.",
  openGraph: {
    type: "website",
    siteName: "cloudvertify",
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "wDsT2GxYz85GMgcDa37NIEGqD-2yM8F8qCt6cc7ZSqE",
  },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "cloudvertify",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web-based)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free browser-based tool to convert and compress images between JPG, PNG, WebP, AVIF and HEIC, to a target file size or the best quality possible.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${openSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <Header />
        {children}
      </body>
      {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
