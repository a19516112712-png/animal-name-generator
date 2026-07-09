import { Metadata } from "next";
import Link from "next/link";
import { loadAnimalData, loadIndex, parseNameTypeSlugFromIndex, getAllNameTypeSlugsFromIndex, NAME_TYPES } from "@/lib/data";
import { getPageTitle, getPageIntro } from "@/lib/titleVariants";
import AdSlot from "@/components/AdSlot";
import InteractiveNamePicker from "@/components/InteractiveNamePicker";
import type { AnimalData, AnimalIndex, NameType } from "@/lib/data";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  const allAnimals = await loadIndex();
  return getAllNameTypeSlugsFromIndex(allAnimals).slice(0, 30).map((s) => ({ slug: [s] }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const allAnimals = await loadIndex();
  const parsed = parseNameTypeSlugFromIndex(allAnimals, [""].concat(slug));
  if (!parsed) return { title: "Page Not Found" };
  const data = await loadAnimalData(parsed.animalSlug);
  if (!data) return { title: "Page Not Found" };
  const categoryLabel = parsed.nameType.key === "names" ? undefined : parsed.nameType.label;
  const title = getPageTitle(parsed.animalSlug, data.displayName, data.icon, categoryLabel);
  return {
    title,
    description: `${parsed.nameType.seoDescPrefix} ${data.displayName.toLowerCase()} names. Browse our curated collection and find the perfect ${parsed.nameType.label.toLowerCase()} for your ${data.displayName.toLowerCase()} ${data.icon}.`,
    openGraph: { title, description: `${parsed.nameType.seoDescPrefix} ${data.displayName.toLowerCase()} names.`, type: "website" },
    twitter: { card: "summary_large_image" },
    other: { "pinterest-rich-pin": "true" },
    alternates: {
      canonical: `https://bestanimalnames.com/${parsed.nameType.key === "names" ? `${parsed.animalSlug}-names` : `${parsed.nameType.key}-${parsed.animalSlug}-names`}/`,
    },
  };
}

function NameGrid({ names }: { names: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
      {names.map((name, idx) => (
        <div key={idx} className="bg-white/80 rounded-lg px-4 py-3 text-center font-medium text-gray-800 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
          {name}
        </div>
      ))}
    </div>
  );
}

/**
 * Deterministic related animals — same pattern as animal/[slug]/page.tsx.
 * No sort(), no Math.random(), O(n) linear scan.
 */
function getRelatedAnimals(all: AnimalIndex[], current: string, count: number): AnimalIndex[] {
  let hash = 0;
  for (let i = 0; i < current.length; i++) {
    hash = ((hash << 5) - hash) + current.charCodeAt(i);
    hash |= 0;
  }
  const offset = Math.abs(hash) % all.length;
  const result: AnimalIndex[] = [];
  for (let i = 0; i < all.length && result.length < count; i++) {
    const idx = (offset + i) % all.length;
    if (all[idx].slug !== current) {
      result.push(all[idx]);
    }
  }
  return result;
}

export default async function NameTypePage({ params }: Props) {
  const { slug } = await params;
  // loadIndex() is cached by kv.ts — single KV read per request
  const allAnimals = await loadIndex();
  const parsed = parseNameTypeSlugFromIndex(allAnimals, slug);

  if (!parsed) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <Link href="/" className="text-primary font-semibold hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const { animalSlug, nameType } = parsed;
  const data = await loadAnimalData(animalSlug);
  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Animal Not Found</h1>
        <Link href="/" className="text-primary font-semibold hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const categoryLabel = nameType.key === "names" ? undefined : nameType.label;
  const pageTitle = getPageTitle(animalSlug, data.displayName, data.icon, categoryLabel);
  const pageIntro = getPageIntro(animalSlug, data.displayName, data.icon, categoryLabel);

  // Build picker data focused on this name type
  const pickerNames: string[] = (data[nameType.field] as string[]) || data.maleNames;
  const pickerCategories = nameType.key === "names" ? [
    { key: "male", label: "♂️ Male", names: data.maleNames },
    { key: "female", label: "♀️ Female", names: data.femaleNames },
    { key: "cute", label: "💕 Cute", names: data.cuteNames },
    { key: "funny", label: "😂 Funny", names: data.funnyNames },
    { key: "unique", label: "🌟 Unique", names: data.uniqueNames },
    { key: "cool", label: "😎 Cool", names: data.coolNames },
    { key: "fantasy", label: "🧙 Fantasy", names: data.fantasyNames },
    { key: "baby", label: "🍼 Baby", names: data.babyNames },
  ] : undefined;

  const categoryLinks = NAME_TYPES.filter((nt) => nt.key !== nameType.key);
  const relatedAnimals = getRelatedAnimals(allAnimals, animalSlug, 8);

  const pageUrl = `https://bestanimalnames.com/${nameType.key === "names" ? `${animalSlug}-names` : `${nameType.key}-${animalSlug}-names`}/`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bestanimalnames.com/" },
      { "@type": "ListItem", position: 2, name: "All Animals", item: "https://bestanimalnames.com/animals/" },
      { "@type": "ListItem", position: 3, name: `${data.displayName} Names`, item: `https://bestanimalnames.com/animal/${animalSlug}/` },
      { "@type": "ListItem", position: 4, name: `${data.displayName} ${nameType.label}`, item: pageUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What are ${nameType.label.toLowerCase()} for ${data.displayName.toLowerCase()}s?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${nameType.label} for ${data.displayName.toLowerCase()}s are specially selected names that reflect the personality, appearance, and unique traits of ${data.displayName.toLowerCase()}s. Our collection includes ${pickerNames.length}+ hand-picked options ranging from classic to creative.`,
        },
      },
      {
        "@type": "Question",
        name: `How do I choose the right ${nameType.label.toLowerCase()} for my ${data.displayName.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Focus on names that match your ${data.displayName.toLowerCase()}'s personality, are easy to pronounce, and avoid confusion with commands or household names. Test a few favorites over several days — the right name will feel increasingly natural with use.`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span className="text-gray-300">/</span>
        <Link href="/animals/" className="hover:text-primary">All Animals</Link><span className="text-gray-300">/</span>
        <Link href={`/animal/${animalSlug}/`} className="hover:text-primary">{data.displayName}</Link><span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">{nameType.label}</span>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
          <p className="text-indigo-200 text-sm mb-2">{data.icon} {data.displayName} {nameType.label}</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{pageTitle}</h1>
          <p className="text-indigo-100 text-lg max-w-3xl mx-auto">{pageIntro}</p>
        </div>
      </section>

      {/* ─── INTERACTIVE NAME PICKER ─── */}
      <section className="max-w-3xl mx-auto px-4 -mt-6 relative z-10 mb-10">
        <InteractiveNamePicker
          allNames={pickerNames}
          animalName={data.displayName}
          icon={data.icon}
          categories={pickerCategories}
        />
      </section>

      <AdSlot position="hero" />

      {/* All Names Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            {nameType.emoji} All {data.displayName} {nameType.label}
          </h2>
          <NameGrid names={pickerNames} />
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
            Looking for the perfect {nameType.label.toLowerCase()} for
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

      {/* Naming Guide */}
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
        <Link href={`/animal/${animalSlug}/`} className="text-primary font-semibold hover:underline">
          ← Back to {data.displayName} Names
        </Link>
      </div>
    </>
  );
}
