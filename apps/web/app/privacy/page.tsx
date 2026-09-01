import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How cloudvertify handles the images and data you upload.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <Breadcrumb items={[{ label: "cloudvertify", href: "/" }, { label: "Privacy Policy" }]} />
        <h1 className="font-display mt-6 text-3xl font-bold">Privacy Policy</h1>
        <div className="text-ink-muted mt-6 flex flex-col gap-4 text-sm leading-relaxed">
          <p>
            cloudvertify converts and compresses images entirely through a server-side
            optimization engine. This page explains exactly what happens to your data.
          </p>
          <h2 className="text-ink mt-4 font-semibold">Images you upload</h2>
          <p>
            An uploaded image is held in memory only for as long as it takes to convert it. Once
            the converted file is returned to your browser, the original and converted copies are
            discarded - neither is written to disk or kept after the request completes.
          </p>
          <h2 className="text-ink mt-4 font-semibold">Accounts and sign-up</h2>
          <p>
            cloudvertify does not require an account, a login, or any personal information to
            convert an image.
          </p>
          <h2 className="text-ink mt-4 font-semibold">Local storage</h2>
          <p>
            The site does not use browser storage to hold any image data. Any preferences a
            future version of the site remembers locally would never include the contents of an
            uploaded image.
          </p>
          <h2 className="text-ink mt-4 font-semibold">Analytics and cookies</h2>
          <p>
            cloudvertify uses Google Analytics to understand how visitors use the site, such as
            which pages and tools are viewed and how visitors arrived here. Google Analytics uses
            cookies and collects information like your approximate location, device and browser
            type, and on-site activity. This data is never linked to the images you convert. You
            can opt out using a browser extension such as the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="text-primary font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            , or by blocking cookies in your browser settings.
          </p>
          <h2 className="text-ink mt-4 font-semibold">Changes to this policy</h2>
          <p>
            If this policy changes, the updated version will be posted on this page with a
            revised date.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
