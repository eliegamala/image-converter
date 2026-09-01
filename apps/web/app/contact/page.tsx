import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about cloudvertify.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <Breadcrumb items={[{ label: "cloudvertify", href: "/" }, { label: "Contact" }]} />
        <h1 className="font-display mt-6 text-3xl font-bold">Contact</h1>
        <p className="text-ink-muted mt-6 text-sm leading-relaxed">
          Questions, feedback, or a bug to report? Reach out at{" "}
          <a href="mailto:hello@cloudvertify.app" className="text-primary font-medium">
            hello@cloudvertify.app
          </a>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}
