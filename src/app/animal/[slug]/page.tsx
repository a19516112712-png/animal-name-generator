import { Metadata } from "next";
import Link from "next/link";
import { loadAnimalData, loadIndex, loadPopularAnimals, NAME_TYPES } from "@/lib/data";
import AdSlot from "@/components/AdSlot";
import type { AnimalData, AnimalIndex } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return loadIndex().slice(0, 30).map((a) => ({ slug: a.slug }));
}

export const dynamicParams = true;


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = loadAnimalData(slug);
  if (!data) return { title: "Animal Not Found" };
  return {
    title: data.seoTitle,
    description: data.seoDescription,
    openGraph: {
      title: data.seoTitle,
      description: data.seoDescription,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: data.seoTitle, description: data.seoDescription },
    alternates: { canonical: `https://bestanimalnames.com/animal/${slug}/` },
    other: {
      "pinterest-rich-pin": "true",
      ...(data.pinterestTitle ? { "og:see_also": `https://bestanimalnames.com/animal/${slug}/` } : {}),
    },
  };
}

function NameGrid({ names }: { names: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {names.map((name, idx) => (
        <div
          key={idx}
          className="bg-white/80 rounded-lg px-4 py-3 text-center font-medium text-gray-800 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
        >
          {name}
        </div>
      ))}
    </div>
  );
}

function getRelated(all: AnimalIndex[], current: string, count: number): AnimalIndex[] {
  return all.filter((a) => a.slug !== current).sort(() => Math.random() - 0.5).slice(0, count);
}

export default async function AnimalPage({ params }: Props) {
  const { slug } = await params;
  const data = loadAnimalData(slug);
  const allAnimals = loadIndex();
  const popular = loadPopularAnimals().slice(0, 10);

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Animal Not Found</h1>
        <Link href="/" className="text-primary font-semibold hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bestanimalnames.com/" },
      { "@type": "ListItem", position: 2, name: "All Animals", item: "https://bestanimalnames.com/animals/" },
      { "@type": "ListItem", position: 3, name: `${data.displayName} Names`, item: `https://bestanimalnames.com/animal/${slug}/` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const nameSections: { key: string; label: string; emoji: string; names: string[]; bg: string }[] = [
    { key: "male", label: "Male Names", emoji: "♂️", names: data.maleNames, bg: "bg-blue-50" },
    { key: "female", label: "Female Names", emoji: "♀️", names: data.femaleNames, bg: "bg-pink-50" },
    { key: "cute", label: "Cute Names", emoji: "💕", names: data.cuteNames, bg: "bg-purple-50" },
    { key: "funny", label: "Funny Names", emoji: "😂", names: data.funnyNames, bg: "bg-yellow-50" },
    { key: "fantasy", label: "Fantasy Names", emoji: "🧙", names: data.fantasyNames, bg: "bg-indigo-50" },
    { key: "unique", label: "Unique Names", emoji: "🌟", names: data.uniqueNames, bg: "bg-teal-50" },
    { key: "cool", label: "Cool Names", emoji: "😎", names: data.coolNames, bg: "bg-slate-50" },
    { key: "baby", label: "Baby Names", emoji: "🍼", names: data.babyNames, bg: "bg-rose-50" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/animals/" className="hover:text-primary">All Animals</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{data.displayName} Names</span>

        {/* Facts CTA */}
        <div className="max-w-7xl mx-auto px-4 -mt-2 mb-8">
          <Link href={`/animal/${slug}/facts/`} className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-5 py-2.5 text-amber-800 font-semibold text-sm hover:bg-amber-100 transition-colors">
            💡 Learn Facts About {data.displayName}s →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 text-center">
          <div className="text-6xl mb-4">{data.icon}</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{data.displayName} Name Generator</h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">{data.description}</p>
          <p className="text-sm text-indigo-200 mt-3">160 hand-picked name ideas across 8 categories — all free!</p>
        </div>
      </section>

      <AdSlot position="hero" />

      {/* Name Sections */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-5">
        {nameSections.map((sec) => (
          <section key={sec.key} className={`rounded-2xl p-6 ${sec.bg}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {sec.emoji} {data.displayName} {sec.label}
              </h2>
              <Link
                href={`/${sec.key}-${slug}-names/`}
                className="text-sm font-semibold text-primary hover:underline whitespace-nowrap"
              >
                View all →
              </Link>
            </div>
            <NameGrid names={sec.names} />
          </section>
        ))}
      </div>

      <AdSlot position="content" />

      {/* Naming Guide */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">📖 {data.displayName} Naming Guide</h2>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <ul className="space-y-3">
            {data.namingGuide.map((tip, idx) => (
              <li key={idx} className="flex gap-3 text-gray-700">
                <span className="text-primary font-bold text-lg">0{idx + 1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Category Links */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-center mb-6">🔗 {data.displayName} Name Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {NAME_TYPES.map((nt) => (
            <Link
              key={nt.key}
              href={`/${nt.key === "names" ? `${slug}-names` : `${nt.key}-${slug}-names`}/`}
              className="bg-white rounded-lg px-4 py-3 text-center font-medium text-gray-700 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              {nt.emoji} {nt.label}
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">❓ {data.displayName} Name FAQ</h2>
        <div className="space-y-3">
          {data.faq.map((item, idx) => (
            <details key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 group">
              <summary className="font-semibold cursor-pointer group-open:text-primary list-none">{item.q}</summary>
              <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <AdSlot position="faq" />

      {/* About / SEO */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">About {data.displayName} Names {data.icon}</h2>
          <div className="text-gray-600 space-y-3 leading-relaxed">
            <p>
              Welcome to the ultimate <strong>{data.displayName} Name Generator</strong> — your one-stop
              destination for finding the perfect {data.displayName.toLowerCase()} name. We have curated
              160 unique name ideas across 8 categories including male, female, cute, funny, fantasy,
              unique, cool, and baby names. Whether you are naming a pet, a fictional character, or just
              exploring for fun, our generator has you covered.
            </p>
            <p>
              Our {data.displayName.toLowerCase()} names are carefully selected from diverse sources —
              mythology, pop culture, nature, and pure creative imagination. Each category offers 20
              hand-picked names that reflect different personality traits and characteristics.
            </p>
            <p>
              <strong>Why use our {data.displayName} Name Generator?</strong> It is 100% free, requires
              no registration, and provides instant results. You can browse all categories on a single
              page or dive deeper into specific name types through our dedicated category pages.
              Bookmark us and come back anytime you need fresh name inspiration!
            </p>
          </div>
        </div>
      </section>

      <AdSlot position="footer" />

      {/* Internal Links */}
      <section className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Related Categories */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">🔗 Related {data.displayName} Categories</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {NAME_TYPES.slice(1).map((nt) => (
              <Link
                key={nt.key}
                href={`/${nt.key}-${slug}-names/`}
                className="bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-all"
              >
                {nt.emoji} {data.displayName} {nt.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Animals */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">⭐ Popular Animals</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {getRelated(allAnimals, slug, 10).map((a) => (
              <Link
                key={a.slug}
                href={`/animal/${a.slug}/`}
                className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="text-2xl mb-1">{a.icon}</div>
                <div className="text-xs font-semibold text-gray-700 group-hover:text-primary truncate">{a.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
