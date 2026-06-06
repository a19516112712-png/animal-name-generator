import type { Metadata } from "next";
import Link from "next/link";
import { loadIndex } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Animals — Browse 989+ Animal Name Generators",
  description: "Browse our complete collection of 989+ animal name generators. Find male, female, cute, funny names for every animal species. 100% free!",
  openGraph: { title: "All Animals — Animal Name Generator", description: "Browse 989+ animal name generators with 160+ names each.", type: "website" },
  twitter: { card: "summary_large_image", title: "All Animals", description: "989+ animal name generators — all free!" },
  alternates: { canonical: "https://bestanimalnames.com/animals/" },
};

export default function AnimalsPage() {
  const animals = loadIndex();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Animal Name Generators",
    description: `Browse ${animals.length}+ animal name generators. Find the perfect name for any pet or animal character.`,
    url: "https://bestanimalnames.com/animals/",
    isPartOf: { "@type": "WebSite", name: "Animal Name Generator", url: "https://bestanimalnames.com" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bestanimalnames.com/" },
      { "@type": "ListItem", position: 2, name: "All Animals", item: "https://bestanimalnames.com/animals/" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            🐾 All {animals.length} Animals
          </h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">
            Browse our complete collection. Click any animal to discover 9 categories of names.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animals.map((animal) => (
            <Link
              key={animal.slug}
              href={`/animal/${animal.slug}/`}
              className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="text-3xl mb-2">{animal.icon}</div>
              <div className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors truncate">
                {animal.name}
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/"
            className="text-primary font-semibold hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
