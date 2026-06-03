import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Animal Name Generator - 200+ Animals, 1000s of Name Ideas",
  description:
    "Free animal name generator with 200+ animals. Male, female, cute, funny, fantasy, unique, cool, and baby names. Perfect for pets, characters, and more!",
  keywords:
    "animal names, pet name generator, dog names, cat names, male names, female names, cute names",
  metadataBase: new URL("https://animalnamegen.com"),
  openGraph: {
    title: "Animal Name Generator - 200+ Animals, 1000s of Name Ideas",
    description:
      "Free animal name generator with 200+ animals. Browse thousands of name ideas across 9 categories!",
    type: "website",
    siteName: "Animal Name Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Animal Name Generator - 200+ Animals, 1000s of Name Ideas",
    description:
      "Free animal name generator. Male, female, cute, funny, fantasy names for 200+ animals.",
  },
  robots: "index, follow",
  alternates: { canonical: "https://animalnamegen.com" },
  manifest: "/manifest.json",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Animal Name Generator",
  url: "https://animalnamegen.com",
  description:
    "Free animal name generator with 200+ animals. Browse thousands of name ideas across 9 categories.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://animalnamegen.com/animals?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f8fafc] text-[#1e293b]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a
              href="/"
              className="text-xl font-bold text-primary hover:text-primary-dark transition-colors"
            >
              🐾 AnimalNameGen
            </a>
            <div className="flex gap-6 text-sm font-medium text-gray-600">
              <a href="/" className="hover:text-primary transition-colors">
                Home
              </a>
              <a href="/animals/" className="hover:text-primary transition-colors">
                All Animals
              </a>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-900 text-gray-400 py-10 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm">
            <p className="font-semibold text-white mb-2">🐾 AnimalNameGen</p>
            <p>&copy; {new Date().getFullYear()} Animal Name Generator. All rights reserved.</p>
            <p className="mt-1">
              The ultimate free animal name generator — 200+ animals, 1000s of names.
            </p>
            <div className="mt-4 flex justify-center gap-6 text-xs">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <a href="/animals/" className="hover:text-white transition-colors">All Animals</a>
              <a href="/animal/dog/" className="hover:text-white transition-colors">Dog Names</a>
              <a href="/animal/cat/" className="hover:text-white transition-colors">Cat Names</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
