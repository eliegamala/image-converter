import type { Metadata } from "next";
import { Big_Shoulders, Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// next/font/google downloads and self-hosts these at build time - the
// browser never makes a runtime request to Google Fonts, which removes the
// extra external round trip the original prototype had (see DEVELOPMENT.md
// 2: "Fonts (Google Fonts CDN)").
const bigShoulders = Big_Shoulders({
  variable: "--font-shoulders",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Image Converter – Convert, Compress & Optimize Images Online",
    template: "%s — ImageConvert",
  },
  description:
    "Convert JPG, PNG, WebP, AVIF and HEIC images online. Compress and optimize images without losing quality. Fast, free, secure and no registration required.",
  openGraph: {
    type: "website",
    siteName: "ImageConvert",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ImageConvert",
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
      className={`${bigShoulders.variable} ${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
