import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { FaviconGeneratorTool } from "@/components/FaviconGeneratorTool";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Free Favicon Generator – Create Favicons Online",
  description:
    "Create a favicon for your website in seconds. This free favicon generator converts PNG, JPG, WebP or SVG images into a complete favicon.ico, PNG, manifest and browserconfig package - entirely in your browser, no upload required.",
  alternates: { canonical: "/favicon-generator" },
  openGraph: {
    title: "Free Favicon Generator – Create Favicons Online",
    description:
      "Online favicon generator and favicon maker - convert any image into a full favicon.ico, PNG, manifest and browserconfig package, entirely in your browser.",
  },
};

const STEPS = [
  {
    step: "01",
    title: "Upload your logo",
    body: "PNG, JPG, WebP or SVG - ideally square and at least 512×512px for the sharpest results.",
  },
  {
    step: "02",
    title: "Customize",
    body: "Choose a background, padding and rounded corners, and set a theme color for browsers and Windows tiles.",
  },
  {
    step: "03",
    title: "Download",
    body: "Grab the full favicon package as a ZIP, or copy the HTML tags straight into your site's <head>.",
  },
];

const SIZE_TABLE = [
  { file: "favicon.ico", size: "16, 32 & 48px combined", usedBy: "Legacy browsers, Windows shortcuts, the universal fallback" },
  { file: "favicon-16x16.png", size: "16×16", usedBy: "Browser tabs" },
  { file: "favicon-32x32.png", size: "32×32", usedBy: "Browser tabs & taskbar" },
  { file: "favicon-48x48.png", size: "48×48", usedBy: "Windows site icons" },
  { file: "apple-touch-icon.png", size: "180×180", usedBy: "iOS / iPadOS home screen" },
  { file: "android-chrome-192x192.png", size: "192×192", usedBy: "Android home screen & PWA" },
  { file: "android-chrome-512x512.png", size: "512×512", usedBy: "Android splash screen & PWA" },
  { file: "mstile-150x150.png", size: "150×150", usedBy: "Windows Start tile" },
  { file: "site.webmanifest", size: "—", usedBy: "PWA metadata - name, icons, colors" },
  { file: "browserconfig.xml", size: "—", usedBy: "Windows tile configuration" },
];

const FAQS = [
  {
    question: "What sizes should my website include?",
    answer:
      "A complete favicon package should include 16×16 and 32×32 for browsers, 180×180 for Apple devices, and 192×192 and 512×512 for Android devices and PWAs. This generator produces all of those, plus a 48×48 size for Windows and a 150×150 Windows tile icon, so you're covered everywhere.",
  },
  {
    question: "What is the best image format for creating a favicon?",
    answer:
      "Upload a square PNG or SVG of at least 512×512 pixels. A square source avoids any cropping or distortion, a high resolution keeps every generated size sharp - including the large 512×512 Android/PWA icon - and PNG or SVG both support transparency, unlike JPG.",
  },
  {
    question: "Do I still need a favicon.ico file?",
    answer:
      "Yes. It remains the standard fallback for compatibility - some older browsers, Windows shortcuts, and services that check for a favicon only look for /favicon.ico directly, regardless of what PNG-based tags you've added to your HTML.",
  },
  {
    question: "Can I create a transparent favicon?",
    answer:
      "Yes. Choose Transparent for the background and the generated icons keep their alpha channel. Transparent favicons work well with both light and dark browser themes, since there's no background box to clash with the surrounding UI.",
  },
  {
    question: "Where should I upload my favicon files?",
    answer:
      "Upload the generated files to your website's root directory - the same folder your homepage lives in - so paths like /favicon.ico and /site.webmanifest resolve correctly. Then add the generated HTML tags to the <head> section of your pages, or your site's shared template.",
  },
  {
    question: "Do favicons help with SEO?",
    answer:
      "Not directly - a favicon isn't a ranking factor Google scores your page on. But it does improve branding and user recognition, and can increase click-through rates, since search engines display favicons next to results on both mobile and desktop.",
  },
  {
    question: "How do I change my favicon?",
    answer:
      "Generate a new package with this tool and re-upload the files to your site, overwriting the old ones at the same paths. If your browser still shows the old icon afterward, that's almost always caching - see \"Why isn't my favicon updating?\" below.",
  },
  {
    question: "Can I use an SVG as a favicon?",
    answer:
      "Yes - modern browsers support an SVG favicon link tag, and SVG favicons scale perfectly at any size. Support isn't universal though, so it's normally added alongside, not instead of, the PNG and ICO files this tool generates.",
  },
  {
    question: "Why isn't my favicon updating?",
    answer:
      "Almost always browser caching - favicons are cached more aggressively than regular images, sometimes for weeks. Try a hard refresh, clear your browser's cache for the site, or open the page in a private/incognito window. If you're using a CDN, you may also need to purge the cached favicon files there.",
  },
  {
    question: "What is a web app manifest?",
    answer:
      "A web app manifest (site.webmanifest) is a JSON file that tells browsers how your site should behave if someone adds it to their home screen or installs it as a Progressive Web App - it lists the icons to use, your app's name, and colors like the theme and background color.",
  },
  {
    question: "Can I use one favicon for all devices?",
    answer:
      "You can technically point every platform at a single image, but it won't look as sharp - iOS, Android and Windows each expect a specific size and can crop or pad a mismatched icon oddly. Generating the full set, like this tool does, is what actually guarantees a crisp icon everywhere.",
  },
  {
    question: "What size should my logo be before uploading?",
    answer:
      "At least 512×512 pixels, and square. That matches the largest icon this tool generates - the Android/PWA 512×512 icon - so nothing gets upscaled and blurry; everything smaller is generated by scaling down, not up.",
  },
  {
    question: "Are favicon files cached by browsers?",
    answer:
      "Yes, heavily - often more aggressively than other images on a page, sometimes for weeks at a time. That's expected behavior for performance, but it's also why a favicon update can take a while to show up for returning visitors.",
  },
  {
    question: "Is this favicon generator free?",
    answer:
      "Yes - this is a completely free favicon generator. It works entirely in your browser and doesn't require an account or any software installation.",
  },
  {
    question: "Is my uploaded image private?",
    answer:
      "Yes. Every icon is generated directly in your browser using the Canvas API - your image is never uploaded to a server, so it stays entirely on your device.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "cloudvertify", item: "/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "/convert" },
    { "@type": "ListItem", position: 3, name: "Favicon Generator", item: "/favicon-generator" },
  ],
};

export default function FaviconGeneratorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb
              items={[
                { label: "cloudvertify", href: "/" },
                { label: "Tools", href: "/convert" },
                { label: "Favicon Generator" },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            Favicon Generator
          </h1>
          <p className="text-ink/70 mt-4">
            Create a favicon for your website in seconds. This free favicon generator turns any
            PNG, JPG, WebP or SVG logo into a complete favicon.ico, PNG and manifest package -
            entirely in your browser, nothing uploaded.
          </p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <FaviconGeneratorTool />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">What is a Favicon?</h2>
          <p className="text-ink-muted leading-relaxed">
            A favicon (short for &quot;favorite icon&quot;) is the small square image that
            represents your website - the icon you see in a browser tab, bookmarks bar, browser
            history, and search results. Beyond the classic 16×16 browser tab icon, a modern
            favicon is really a whole package: separate icons sized for iOS home screens, Android
            home screens and PWAs, and Windows tiles, each with its own expected size and file
            name.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Why Every Website Needs a Favicon</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Makes your site recognizable among a dozen open browser tabs.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Reinforces your brand every time someone bookmarks or revisits your site.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Looks correct when someone adds your site to their home screen or installs it as a
              PWA.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Signals a finished, professional site rather than an unfinished project - a missing
              favicon shows up as a blank, generic page icon that every visitor sees.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Create a Favicon</h2>
          <p className="text-ink-muted leading-relaxed">
            Creating a favicon used to mean manually resizing your logo into half a dozen files
            by hand. This favicon maker automates the whole thing - upload your logo once and
            this website favicon generator produces every required size automatically.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step}>
                <div className="font-readout text-primary text-sm">{s.step}</div>
                <h3 className="mt-2 font-medium">{s.title}</h3>
                <p className="text-ink-muted mt-2 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Required Favicon Sizes</h2>
          <p className="text-ink-muted leading-relaxed">
            Every platform expects its own icon size, and this generator produces the full set
            in one pass - here&apos;s exactly what each file is for.
          </p>
          <div className="border-border mt-6 overflow-x-auto rounded-xl border text-left">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="p-3 font-medium">File</th>
                  <th className="p-3 font-medium">Size</th>
                  <th className="p-3 font-medium">Used by</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_TABLE.map((row) => (
                  <tr key={row.file} className="border-border border-b last:border-0">
                    <td className="font-readout p-3">{row.file}</td>
                    <td className="text-ink-muted p-3">{row.size}</td>
                    <td className="text-ink-muted p-3">{row.usedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">ICO vs PNG vs SVG Favicons</h2>
          <p className="text-ink-muted leading-relaxed">
            ICO is the original favicon format - a single file that bundles multiple resolutions
            together, and it&apos;s still the most universally supported fallback, including by
            very old browsers and Windows itself.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            PNG favicons are simpler: one file, one size, with full transparency support. Modern
            browsers pick whichever PNG size best matches how the icon is displayed, which looks
            sharper than scaling a single ICO frame up or down.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            SVG favicons are vector, so they render crisply at any size - but browser support is
            less consistent than PNG or ICO. In practice, shipping all three - favicon.ico as a
            fallback, sized PNGs for crisp rendering, and optionally an SVG - covers every browser
            and device without any guesswork.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Add a Favicon to HTML</h2>
          <p className="text-ink-muted leading-relaxed">
            Upload the generated files to your website&apos;s root directory - the same folder as
            your homepage - then paste the HTML tags this tool generates into the &lt;head&gt;
            section of your pages, or into your site&apos;s shared layout or template so you only
            need to add it once.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Add a Favicon in WordPress</h2>
          <p className="text-ink-muted leading-relaxed">
            Most WordPress themes read the favicon from Appearance → Customize → Site Identity,
            where you can upload a &quot;Site Icon&quot; and WordPress generates the sizes it
            needs automatically. If your theme or a caching plugin doesn&apos;t pick it up, you
            can also upload the files this tool generates directly to your theme&apos;s root
            folder and add the HTML tags to your theme&apos;s header.php, or via a plugin like
            Insert Headers and Footers.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Add a Favicon in Next.js</h2>
          <p className="text-ink-muted leading-relaxed">
            In the Next.js App Router, drop favicon.ico or icon.png directly into your app/
            directory and Next.js serves and links it automatically - no manual tags needed. For
            the full package this tool generates, place the files in your public/ folder instead
            and add the HTML tags to the metadata export in app/layout.tsx (or a &lt;head&gt;
            block if you&apos;re on the Pages Router) - the same way this site links its own
            favicon.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Best Practices</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Start from a square, high-resolution source image (512×512px or larger) so every
              generated size stays sharp.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Keep the design simple - fine detail disappears at 16×16px, so a bold, simplified
              mark reads better than a complex logo.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Use a transparent background unless you specifically need a solid brand color
              behind the icon.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Regenerate and re-upload whenever your logo changes - browsers cache favicons
              aggressively, so give it time (or a hard refresh) to show up.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Keep favicon.ico at your site&apos;s root even if you&apos;re using the newer
              PNG-based tags, since some browsers and services still request it directly by that
              exact path.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently asked questions</h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">More tools</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/svg-optimizer" className="conversion-pill px-4 py-1.5 text-sm">
                SVG Optimizer
              </Link>
            </li>
            <li>
              <Link href="/svg-to-png" className="conversion-pill px-4 py-1.5 text-sm">
                Convert SVG to PNG
              </Link>
            </li>
            <li>
              <Link href="/png-to-svg" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to SVG
              </Link>
            </li>
            <li>
              <Link href="/image-to-base64" className="conversion-pill px-4 py-1.5 text-sm">
                Image to Base64 Converter
              </Link>
            </li>
            <li>
              <Link href="/responsive-image-generator" className="conversion-pill px-4 py-1.5 text-sm">
                Responsive Image Generator
              </Link>
            </li>
            <li>
              <Link href="/resize-image-to-100kb" className="conversion-pill px-4 py-1.5 text-sm">
                Resize Image to 100KB
              </Link>
            </li>
            <li>
              <Link href="/convert" className="conversion-pill px-4 py-1.5 text-sm">
                View all converters
              </Link>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
