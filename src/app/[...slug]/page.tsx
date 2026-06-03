import { Metadata } from "next";
import Link from "next/link";
import { loadAnimalData, loadIndex, parseNameTypeSlug, getAllNameTypeSlugs, NAME_TYPES, loadPopularAnimals } from "@/lib/data";
import AdSlot from "@/components/AdSlot";
import type { AnimalData, AnimalIndex, NameType } from "@/lib/data";

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return getAllNameTypeSlugs().map((s) => ({ slug: [s] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseNameTypeSlug(["", ...slug]);
  if (!parsed) return { title: "Page Not Found" };
  const data = loadAnimalData(parsed.animalSlug);
  if (!data) return { title: "Page Not Found" };
  return {
    title: parsed.nameType.key === "names"
      ? `${data.displayName} Name Generator - 100+ ${data.displayName} Names ${data.icon}`
      : `${data.displayName} ${parsed.nameType.label} Generator - ${parsed.nameType.seoTitleSuffix} ${data.icon}`,
    description: `${parsed.nameType.seoDescPrefix} ${data.displayName.toLowerCase()} names. Browse our curated collection and find the perfect ${parsed.nameType.label.toLowerCase()} for your ${data.displayName.toLowerCase()} ${data.icon}.`,
    openGraph: {
      title: `${data.displayName} ${parsed.nameType.label} Generator`,
      description: `${parsed.nameType.seoDescPrefix} ${data.displayName.toLowerCase()} names.`,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: `https://animalnamegen.com/${parsed.nameType.key === "names" ? `${parsed.animalSlug}-names` : `${parsed.nameType.key}-${parsed.animalSlug}-names`}/`,
    },
  };
}

function NameGrid({ names }: { names: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
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

export default async function NameTypePage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseNameTypeSlug(slug);
  const allAnimals = loadIndex();

  if (!parsed) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <Link href="/" className="text-primary font-semibold hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const { animalSlug, nameType } = parsed;
  const data = loadAnimalData(animalSlug);
  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Animal Not Found</h1>
        <Link href="/" className="text-primary font-semibold hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const names = (data[nameType.field] as string[]) || data.maleNames;
  const pageTitle = nameType.key === "names"
    ? `${data.displayName} Names`
    : `${data.displayName} ${nameType.label}`;

  const categoryLinks = NAME_TYPES.filter((nt) => nt.key !== nameType.key);
  const relatedAnimals = allAnimals.filter((a) => a.slug !== animalSlug).sort(() => Math.random() - 0.5).slice(0, 8);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href={`/animal/${animalSlug}/`} className="hover:text-primary">{data.displayName} Names</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{nameType.label}</span>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-16 text-center">
          <div className="text-5xl mb-4">{nameType.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{pageTitle} Generator</h1>
          <p className="text-indigo-100 max-w-xl mx-auto">
            {nameType.seoDescPrefix} {data.displayName.toLowerCase()} names — hand-picked and 100% free to use.
            Discover the perfect {nameType.label.toLowerCase()} for your {data.displayName.toLowerCase()} {data.icon}.
          </p>
        </div>
      </section>

      <AdSlot position="hero" />

      {/* All Names */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            {nameType.emoji} All {data.displayName} {nameType.label}
          </h2>
          <NameGrid names={names} />
        </div>
      </section>

      <AdSlot position="content" />

      {/* Intro / SEO Content */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose max-w-none text-gray-600 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {nameType.key === "names"
              ? `The Ultimate ${data.displayName} Name Generator ${data.icon}`
              : `Best ${data.displayName} ${nameType.label} ${data.icon}`}
          </h2>
          <p>
            Looking for the perfect {nameType.label?.toLowerCase() || nameType.label.toLowerCase()} for
            your {data.displayName.toLowerCase()}? You have come to the right place! Our{" "}
            <strong>{data.displayName} {nameType.label} Generator</strong> offers a carefully curated
            collection of {nameType.label.toLowerCase()} that will inspire you. Whether you need a name
            for a pet, a character in a story, a game avatar, or just for fun — we have got you covered.
          </p>
          <p>
            All our {data.displayName.toLowerCase()} {nameType.label.toLowerCase()} are hand-selected to
            be memorable, meaningful, and easy to pronounce. We draw inspiration from nature, mythology,
            pop culture, literature, and creative wordplay. Each name is chosen to capture the unique
            spirit and personality of a {data.displayName.toLowerCase()}.
          </p>
          <p>
            Our {data.displayName} {nameType.label} Generator is <strong>100% free</strong> and requires
            no registration. Simply browse the list above, find a name that resonates with you, and start
            using it right away. We update our collections regularly, so bookmark this page and come back
            for fresh ideas!
          </p>
        </div>
      </section>

      {/* Naming Tips */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          📝 Tips for Choosing {data.displayName} {nameType.label}
        </h2>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <ul className="space-y-3 text-gray-700">
            {data.namingGuide.map((tip, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AdSlot position="faq" />

      {/* Category Links */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-center mb-6">
          🔍 Explore Other {data.displayName} Name Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categoryLinks.map((nt) => (
            <Link
              key={nt.key}
              href={`/${nt.key === "names" ? `${animalSlug}-names` : `${nt.key}-${animalSlug}-names`}/`}
              className="bg-white rounded-lg px-4 py-3 text-center font-medium text-gray-700 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              {nt.emoji} {data.displayName} {nt.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Related Animals */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-center mb-6">🐾 More Animals to Explore</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {relatedAnimals.map((a) => (
            <Link
              key={a.slug}
              href={`/animal/${a.slug}/`}
              className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="text-3xl mb-1">{a.icon}</div>
              <div className="text-sm font-semibold text-gray-700 group-hover:text-primary truncate">{a.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot position="footer" />

      {/* Back link */}
      <div className="text-center pb-12">
        <Link
          href={`/animal/${animalSlug}/`}
          className="text-primary font-semibold hover:underline"
        >
          ← Back to {data.displayName} Names
        </Link>
      </div>
    </>
  );
}
