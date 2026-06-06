import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Animal Name Generator - 989+ Animals, 1000s of Name Ideas",
  description:
    "Free animal name generator with 989+ animals. Male, female, cute, funny, fantasy, unique, cool, and baby names. Perfect for pets, characters, and more!",
  keywords:
    "animal names, pet name generator, dog names, cat names, male names, female names, cute names",
  metadataBase: new URL("https://bestanimalnames.com"),
  openGraph: {
    title: "Animal Name Generator - 989+ Animals, 1000s of Name Ideas",
    description: "Free animal name generator with 989+ animals. Browse thousands of name ideas across 9 categories!",
    type: "website",
    siteName: "Animal Name Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Animal Name Generator - 989+ Animals, 1000s of Name Ideas",
    description: "Free animal name generator. Male, female, cute, funny, fantasy names for 989+ animals.",
  },
  robots: "index, follow",
  alternates: { canonical: "https://bestanimalnames.com" },
  manifest: "/manifest.json",
  other: {
    "p:domain_verify": "acc18c9aa2855ead49c874b6cac9cb61",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Animal Name Generator",
  url: "https://bestanimalnames.com",
  description: "Free animal name generator with 989+ animals. Browse thousands of name ideas across 9 categories.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://bestanimalnames.com/animals?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f8fafc] text-[#1e293b]">
        <GoogleAnalytics gaId="G-C9HPD23Y02" />
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-primary hover:text-primary-dark transition-colors">
              🐾 AnimalNameGen
            </Link>
            <div className="flex gap-6 text-sm font-medium text-gray-600">
              <Link href="/animals/" className="hover:text-primary transition-colors">Animals</Link>
              <Link href="/guide/japanese-animal-names/" className="hover:text-primary transition-colors">Guides</Link>
              <Link href="/blog/" className="hover:text-primary transition-colors">Blog</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-900 text-gray-400 py-10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about/" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact/" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy-policy/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms/" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer/" className="hover:text-white transition-colors">Disclaimer</Link></li>
                <li><Link href="/cookie-policy/" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/animals/" className="hover:text-white transition-colors">All Animals</Link></li>
                <li><Link href="/blog/" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/animal/dog/" className="hover:text-white transition-colors">Dog Names</Link></li>
                <li><Link href="/animal/cat/" className="hover:text-white transition-colors">Cat Names</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Popular Guides</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/guide/how-to-name-your-dog/" className="hover:text-white transition-colors">How to Name Your Dog</Link></li>
                <li><Link href="/guide/how-to-name-your-cat/" className="hover:text-white transition-colors">How to Name Your Cat</Link></li>
                <li><Link href="/guide/japanese-animal-names/" className="hover:text-white transition-colors">Japanese Animal Names</Link></li>
                <li><Link href="/guide/mythological-animal-names/" className="hover:text-white transition-colors">Mythological Names</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Latest Blog</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog/top-100-dog-names-2024/" className="hover:text-white transition-colors">Top 100 Dog Names</Link></li>
                <li><Link href="/blog/unique-cat-names-stand-out/" className="hover:text-white transition-colors">Unique Cat Names</Link></li>
                <li><Link href="/blog/mythological-animal-names/" className="hover:text-white transition-colors">Mythological Names</Link></li>
                <li><Link href="/blog/norse-viking-animal-names/" className="hover:text-white transition-colors">Norse Viking Names</Link></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Animal Name Generator. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
