import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about ImageConvert.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <Breadcrumb items={[{ label: "ImageConvert", href: "/" }, { label: "Contact" }]} />
        <h1 className="font-display mt-6 text-3xl font-bold">Contact</h1>
        <p className="text-ink-muted mt-6 text-sm leading-relaxed">
          Questions, feedback, or a bug to report? Reach out at{" "}
          <a href="mailto:hello@imageconvert.app" className="text-primary font-medium">
            hello@imageconvert.app
          </a>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}
