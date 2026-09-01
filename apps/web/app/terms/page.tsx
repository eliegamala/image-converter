import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply to using cloudvertify.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <Breadcrumb items={[{ label: "cloudvertify", href: "/" }, { label: "Terms of Service" }]} />
        <h1 className="font-display mt-6 text-3xl font-bold">Terms of Service</h1>
        <div className="text-ink-muted mt-6 flex flex-col gap-4 text-sm leading-relaxed">
          <h2 className="text-ink mt-4 font-semibold">Using the service</h2>
          <p>
            cloudvertify is provided free of charge for converting and compressing images you
            have the right to use. You&apos;re responsible for the content of anything you
            upload.
          </p>
          <h2 className="text-ink mt-4 font-semibold">No warranty</h2>
          <p>
            The service is provided &quot;as is&quot;, without warranties of any kind, express or
            implied, including fitness for a particular purpose. Conversion results (quality,
            file size, and processing time) can vary by image and are not guaranteed.
          </p>
          <h2 className="text-ink mt-4 font-semibold">Acceptable use</h2>
          <p>
            Don&apos;t use the service to process content you don&apos;t have the right to use,
            or in a way intended to abuse, overload, or disrupt it.
          </p>
          <h2 className="text-ink mt-4 font-semibold">Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, cloudvertify is not liable for any indirect,
            incidental, or consequential damages arising from use of the service.
          </p>
          <h2 className="text-ink mt-4 font-semibold">Changes</h2>
          <p>
            These terms may be updated from time to time. Continued use of the service after a
            change means you accept the updated terms.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
