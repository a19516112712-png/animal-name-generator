import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPopularAnimals, getTopAnimals, loadFactData, loadFactIndex } from "@/lib/data";
import AdSlot from "@/components/AdSlot";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const topAnimals = await getTopAnimals(100);
  const topSlugs = new Set(topAnimals.map(a => a.slug));
  const facts = await loadFactIndex();
  return facts.filter(f => topSlugs.has(f.slug)).map(f => ({ slug: f.slug }));
}

export const dynamicParams = true;



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const fact = await loadFactData(slug);
  if (!fact) return { title: "Facts Not Found" };
  return {
    title: fact.seoTitle,
    description: fact.seoDescription,
    openGraph: { title: fact.seoTitle, description: fact.seoDescription, type: "article" },
    twitter: { card: "summary_large_image", title: fact.seoTitle, description: fact.seoDescription },
    alternates: { canonical: `https://bestanimalnames.com/animal/${slug}/facts/` },
  };
}

export default async function FactsPage({ params }: Props) {
  const { slug } = await params;
  const fact = await loadFactData(slug);
  const popular = getPopularAnimals().slice(0, 8);

  if (!fact) notFound();

  const animalSchema = {
    "@context": "https://schema.org",
    "@type": "Animal",
    name: fact.displayName,
    description: fact.seoDescription,
    taxonomy: {
      kingdom: fact.classification.kingdom,
      phylum: fact.classification.phylum,
      class: fact.classification.class,
      order: fact.classification.order,
      family: fact.classification.family,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bestanimalnames.com/" },
      { "@type": "ListItem", position: 2, name: "All Animals", item: "https://bestanimalnames.com/animals/" },
      { "@type": "ListItem", position: 3, name: `${fact.displayName} Names`, item: `https://bestanimalnames.com/animal/${slug}/` },
      { "@type": "ListItem", position: 4, name: `${fact.displayName} Facts`, item: `https://bestanimalnames.com/animal/${slug}/facts/` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Where do ${fact.displayName.toLowerCase()}s live?`,
        acceptedAnswer: { "@type": "Answer", text: `${fact.displayName}s primarily live in ${fact.habitat.toLowerCase()}.` },
      },
      {
        "@type": "Question",
        name: `What do ${fact.displayName.toLowerCase()}s eat?`,
        acceptedAnswer: { "@type": "Answer", text: `${fact.displayName}s are ${fact.diet.toLowerCase()}.` },
      },
      {
        "@type": "Question",
        name: `How long do ${fact.displayName.toLowerCase()}s live?`,
        acceptedAnswer: { "@type": "Answer", text: `The average lifespan of a ${fact.displayName.toLowerCase()} is ${fact.lifespan.toLowerCase()}.` },
      },
      {
        "@type": "Question",
        name: `How big do ${fact.displayName.toLowerCase()}s get?`,
        acceptedAnswer: { "@type": "Answer", text: `${fact.displayName}s typically reach sizes of ${fact.size.toLowerCase()}.` },
      },
      {
        "@type": "Question",
        name: `What is the conservation status of ${fact.displayName.toLowerCase()}s?`,
        acceptedAnswer: { "@type": "Answer", text: `The ${fact.displayName.toLowerCase()} is currently listed as ${fact.conservationStatus} by the IUCN.` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(animalSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
        <Link href={`/animal/${slug}/`} className="hover:text-primary">{fact.displayName} Names</Link><span>/</span>
        <span className="text-gray-800 font-medium">{fact.displayName} Facts</span>
      </nav>

      <section className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <div className="text-6xl mb-4">{fact.icon}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{fact.displayName} Facts</h1>
          <p className="text-emerald-100 text-lg italic mb-2">{fact.scientificName}</p>
          <p className="text-emerald-100 max-w-xl mx-auto">Discover fascinating facts about {fact.displayName.toLowerCase()}s — habitat, diet, lifespan, and more!</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Classification */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">🔬 Scientific Classification</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {Object.entries(fact.classification).map(([key, val]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-3">
                <div className="text-gray-500 capitalize text-xs">{key}</div>
                <div className="font-semibold text-gray-800">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">🌍</div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Habitat</h3>
            <p className="text-gray-800">{fact.habitat}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">🍽️</div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Diet</h3>
            <p className="text-gray-800">{fact.diet}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">⏳</div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Lifespan</h3>
            <p className="text-gray-800">{fact.lifespan}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">📏</div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Size</h3>
            <p className="text-gray-800">{fact.size}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">🛡️</div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Conservation</h3>
            <p className="text-gray-800">{fact.conservationStatus}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">🏷️</div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Scientific Name</h3>
            <p className="text-gray-800 italic text-sm">{fact.scientificName}</p>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
          <h2 className="text-xl font-bold mb-4">💡 Fun Facts About {fact.displayName}s</h2>
          <ul className="space-y-3">
            {fact.funFacts.map((f, i) => (
              <li key={i} className="flex gap-3 text-gray-700">
                <span className="text-amber-500 font-bold text-lg flex-shrink-0">0{i + 1}</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center">
          <p className="text-lg font-semibold mb-2">🐾 Looking for {fact.displayName} names?</p>
          <p className="text-gray-600 mb-4">Browse 160+ hand-picked {fact.displayName.toLowerCase()} names across 9 categories.</p>
          <Link href={`/animal/${slug}/`} className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors">
            {fact.displayName} Name Generator →
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-5">🐾 Popular Animal Facts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {popular.filter(p => p.slug !== slug).slice(0, 8).map((a) => (
            <Link key={a.slug} href={`/animal/${a.slug}/facts/`}
              className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
              <div className="text-2xl mb-1">{a.icon}</div>
              <div className="text-xs font-semibold text-gray-600 group-hover:text-primary">{a.name}</div>
            </Link>
          ))}
        </div>
      </section>
      <AdSlot position="footer" />
    </>
  );
}
