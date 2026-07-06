import { Metadata } from "next";
import Link from "next/link";
import { loadAnimalData, loadIndex, loadPopularAnimals, NAME_TYPES } from "@/lib/data";
import { getPageTitle, getPageIntro, getMetaDescription } from "@/lib/titleVariants";
import AdSlot from "@/components/AdSlot";
import InteractiveNamePicker from "@/components/InteractiveNamePicker";
import type { AnimalData, AnimalIndex } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await loadIndex()).slice(0, 30).map((a) => ({ slug: a.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadAnimalData(slug);
  if (!data) return { title: "Animal Not Found" };
  const title = getPageTitle(slug, data.displayName, data.icon);
  const description = getMetaDescription(slug, data.displayName);
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
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
  const data = await loadAnimalData(slug);
  const allAnimals = await loadIndex();

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Animal Not Found</h1>
        <Link href="/" className="text-primary font-semibold hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const pageTitle = getPageTitle(slug, data.displayName, data.icon);
  const pageIntro = getPageIntro(slug, data.displayName, data.icon);

  // Flatten all names and build category groups for the interactive picker
  const allNames: string[] = [
    ...data.maleNames, ...data.femaleNames, ...data.cuteNames, ...data.funnyNames,
    ...data.fantasyNames, ...data.uniqueNames, ...data.coolNames, ...data.babyNames,
  ];

  const pickerCategories = [
    { key: "male", label: "♂️ Male", names: data.maleNames },
    { key: "female", label: "♀️ Female", names: data.femaleNames },
    { key: "cute", label: "💕 Cute", names: data.cuteNames },
    { key: "funny", label: "😂 Funny", names: data.funnyNames },
    { key: "unique", label: "🌟 Unique", names: data.uniqueNames },
    { key: "cool", label: "😎 Cool", names: data.coolNames },
    { key: "fantasy", label: "🧙 Fantasy", names: data.fantasyNames },
    { key: "baby", label: "🍼 Baby", names: data.babyNames },
  ];

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
      </nav>

      {/* Facts CTA */}
      <div className="max-w-7xl mx-auto px-4 -mt-2 mb-8">
        <Link href={`/animal/${slug}/facts/`} className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-5 py-2.5 text-amber-800 font-semibold text-sm hover:bg-amber-100 transition-colors">
          💡 Learn Facts About {data.displayName}s →
        </Link>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
          <p className="text-indigo-200 text-sm mb-2">{data.icon} {data.displayName} Name Generator</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{pageTitle}</h1>
          <p className="text-indigo-100 text-lg max-w-3xl mx-auto">{pageIntro}</p>
        </div>
      </section>

      {/* ─── INTERACTIVE NAME PICKER (Above the Fold) ─── */}
      <section className="max-w-3xl mx-auto px-4 -mt-6 relative z-10 mb-10">
        <InteractiveNamePicker
          allNames={allNames}
          animalName={data.displayName}
          icon={data.icon}
          categories={pickerCategories}
        />
      </section>

      {/* Name Category Sections */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <AdSlot position="hero" />
        <div className="space-y-8">
          {nameSections.map((section) => (
            <div key={section.key} id={section.key}>
              <div className={`${section.bg} rounded-2xl p-6 shadow-sm border border-gray-100`}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  {section.emoji} {section.label} for {data.displayName}s
                </h2>
                <NameGrid names={section.names} />
              </div>
            </div>
          ))}
        </div>
        <AdSlot position="content" />
      </section>

      {/* FAQ Section */}
      {data.faq && data.faq.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            ❓ Frequently Asked Questions About {data.displayName} Names
          </h2>
          <div className="space-y-3">
            {data.faq.map((item, idx) => (
              <details key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 group">
                <summary className="font-semibold text-gray-800 cursor-pointer group-open:text-primary">
                  {item.q}
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Naming Guide */}
      {data.namingGuide && data.namingGuide.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-center mb-8">📖 {data.displayName} Naming Guide</h2>
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
      )}

      {/* Category Links + Related + Letter/Length nav */}
      <section className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Other Name Categories */}
          <div>
            <h2 className="text-2xl font-bold text-center mb-6">🔗 {data.displayName} Name Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {NAME_TYPES.map((nt) => (
                <Link
                  key={nt.key}
                  href={`/${nt.key === "names" ? `${slug}-names` : `${nt.key}-${slug}-names`}/`}
                  className="bg-white rounded-lg px-4 py-3 text-center text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-all"
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
        </div>
      </section>

      {/* Browse by Letter */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">🔤 Browse {data.displayName} Names by Letter</h2>
          <p className="text-gray-600 text-sm mb-4">
            Looking for {data.displayName.toLowerCase()} names that start with a specific letter?
            Browse our complete A-Z collection:
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-1.5">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => (
              <Link key={l} href={`/startswith/${l}/${slug}/`}
                className="bg-gray-50 hover:bg-primary/10 rounded-lg py-2 text-center text-sm font-bold text-gray-700 hover:text-primary transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Length */}
      <section className="max-w-4xl mx-auto px-4 py-6 mb-12">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">📏 Browse {data.displayName} Names by Length</h2>
          <p className="text-gray-600 text-sm mb-4">
            Prefer names of a specific length? Find short and sweet or longer distinctive names:
          </p>
          <div className="flex flex-wrap gap-2">
            {[3,4,5,6,7,8,9,10].map(n => (
              <Link key={n} href={`/length/${n}/${slug}/`}
                className="bg-gray-50 hover:bg-emerald-50 rounded-lg px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:text-emerald-700 transition-colors">
                {n} Letters
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
