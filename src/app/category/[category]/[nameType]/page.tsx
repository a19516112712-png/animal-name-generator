import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCategory, loadCategories, loadIndex, NAME_TYPES, loadAnimalData } from "@/lib/data";
import AdSlot from "@/components/AdSlot";
import type { AnimalData } from "@/lib/data";

type Props = { params: Promise<{ category: string; nameType: string }> };

export async function generateStaticParams() {
  const cats = await loadCategories();
  const params: { category: string; nameType: string }[] = [];
  for (const c of cats) {
    for (const nt of NAME_TYPES) {
      params.push({ category: c.slug, nameType: nt.key });
    }
  }
  return params;
}

export const dynamicParams = true;


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, nameType } = await params;
  const data = await loadCategory(category);
  const nt = NAME_TYPES.find((n) => n.key === nameType);
  if (!data || !nt) return { title: "Page Not Found" };
  return {
    title: `${data.name} ${nt.label} Generator — 1000s of ${nt.label} ${data.icon}`,
    description: `Find ${nt.label.toLowerCase()} for ${data.name.toLowerCase()}. Browse our curated collection of ${data.animals.length}+ ${data.name.toLowerCase()} species. Free name generator.`,
    openGraph: { title: `${data.name} ${nt.label} Generator`, description: `${nt.label} for ${data.name.toLowerCase()}.`, type: "website" },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: `https://bestanimalnames.com/category/${category}/${nameType}/` },
    other: { "pinterest-rich-pin": "true" },
  };
}

const NAME_FIELDS: Record<string, string> = {
  names: "maleNames", male: "maleNames", female: "femaleNames",
  cute: "cuteNames", funny: "funnyNames", fantasy: "fantasyNames",
  unique: "uniqueNames", cool: "coolNames", baby: "babyNames",
};

export default async function CategoryNameTypePage({ params }: Props) {
  const { category, nameType } = await params;
  const data = await loadCategory(category);
  const nt = NAME_TYPES.find((n) => n.key === nameType);
  if (!data || !nt) notFound();

  const allAnimals = await loadIndex();
  const animalMap = new Map(allAnimals.map((a) => [a.slug, a]));
  const categoryAnimals = data.animals
    .map((s) => animalMap.get(s))
    .filter(Boolean) as { slug: string; name: string; icon: string }[];

  // CRITICAL FIX: Batch-load all animal data in parallel instead of N sequential KV reads.
  const field = NAME_FIELDS[nameType] || "maleNames";
  const animalDataMap = new Map<string, AnimalData>();
  const promises = categoryAnimals.map(async (a) => {
    const ad = await loadAnimalData(a.slug);
    if (ad) animalDataMap.set(a.slug, ad);
  });
  await Promise.all(promises);

  const allNames: { name: string; animal: string; icon: string; slug: string }[] = [];
  for (const a of categoryAnimals) {
    const ad = animalDataMap.get(a.slug);
    if (!ad) continue;
    const names = (ad as any)[field] as string[] || [];
    names.slice(0, 10).forEach((n) => {
      allNames.push({ name: n, animal: a.name, icon: a.icon, slug: a.slug });
    });
  }

  const bcSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bestanimalnames.com/" },
      { "@type": "ListItem", position: 2, name: `${data.name} Names`, item: `https://bestanimalnames.com/category/${category}/` },
      { "@type": "ListItem", position: 3, name: `${data.name} ${nt.label}`, item: `https://bestanimalnames.com/category/${category}/${nameType}/` },
    ],
  };

  const faqSchema2 = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What are the best ${nt.label.toLowerCase()} for ${data.name.toLowerCase()}?`,
        acceptedAnswer: { "@type": "Answer", text: `Our collection features ${allNames.length} ${nt.label.toLowerCase()} across ${categoryAnimals.length} ${data.name.toLowerCase()} species. Each name is hand-picked for quality, memorability, and suitability. Browse the grid above to find your favorite!` },
      },
      {
        "@type": "Question",
        name: `How were these ${data.name.toLowerCase()} ${nt.label?.toLowerCase() || nt.label.toLowerCase()} selected?`,
        acceptedAnswer: { "@type": "Answer", text: `We curated these names from diverse sources including mythology, nature, pop culture, literature, and creative wordplay. Each name was evaluated for uniqueness, pronunciation ease, and personality fit. Names are regularly refreshed to keep our collection current and inspiring.` },
      },
      {
        "@type": "Question",
        name: `Can I suggest a ${data.name.toLowerCase()} ${nt.label?.toLowerCase() || nt.label.toLowerCase()}?`,
        acceptedAnswer: { "@type": "Answer", text: `We love hearing from our community! While we don't have a direct submission form yet, we regularly review naming trends and user feedback to expand our collections. Contact us through the site to share your ideas!` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bcSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema2) }} />

      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
        <Link href={`/category/${category}/`} className="hover:text-primary">{data.name}</Link><span>/</span>
        <span className="text-gray-800 font-medium">{nt.label}</span>
      </nav>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <div className="text-5xl mb-4">{data.icon}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{data.name} {nt.label}</h1>
      <p className="text-indigo-100 text-lg max-w-2xl mx-auto">Browse {allNames.length} {nt.label.toLowerCase()} across {categoryAnimals.length} {data.name.toLowerCase()} species.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10">
          {categoryAnimals.map((a) => (
            <Link key={a.slug} href={`/${nameType === "names" ? `${a.slug}-names` : `${nameType}-${a.slug}-names`}/`}
              className="bg-white rounded-lg px-4 py-3 text-center font-medium text-gray-700 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
              {a.icon} {a.name} {nt.label}
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">{nt.emoji} {data.name} {nt.label}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {allNames.map((item, idx) => (
            <div key={idx} className="bg-white/80 rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-800 shadow-sm">
              {item.icon} {item.name}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">About {data.name} {nt.label} {data.icon}</h2>
        <div className="text-gray-600 space-y-3 leading-relaxed">
          <p>Welcome to our <strong>{data.name} {nt.label} Generator</strong> — the perfect place to find {nt.label.toLowerCase()} for your {data.name.toLowerCase()}. We have collected hundreds of names across {categoryAnimals.length} different species.</p>
          <p>Each name is hand-picked for quality and originality. Whether you need {nt.label.toLowerCase()} for a specific species or just want to browse, you will find something you love.</p>
          <p><strong>All our name generators are 100% free</strong> with no registration required. Bookmark this page and come back anytime!</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-6">🔗 {data.name} Name Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {NAME_TYPES.map((n) => (
            <Link key={n.key} href={`/category/${category}/${n.key}/`}
              className={`bg-white rounded-lg px-4 py-3 text-center font-medium border shadow-sm hover:shadow-md transition-all ${n.key === nameType ? 'border-primary text-primary' : 'border-gray-100 text-gray-700 hover:border-primary/30'}`}>
              {n.emoji} {n.label}
            </Link>
          ))}
        </div>
      </section>
      <AdSlot position="footer" />
    </>
  );
}
