import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadIndex, loadAnimalData, loadAllIdeas, type AnimalData } from "@/lib/data";

import AdSlot from "@/components/AdSlot";


interface IdeaIndexItem {
  slug: string;
  animal?: string;
  adjective?: string;
  number?: string;
}


async function findIdeaBySlug(slug: string): Promise<IdeaIndexItem | null> {
  const all = await loadAllIdeas();
  return all.find(i => i.slug === slug) || null;
}

async function getRelatedIdeas(currentSlug: string, count: number = 8): Promise<IdeaIndexItem[]> {
  const all = await loadAllIdeas();
  const current = await findIdeaBySlug(currentSlug);
  const currentAnimal = current?.animal || slugToAnimal(currentSlug);
  return all
    .filter(i => {
      if (i.slug === currentSlug) return false;
      const iAnimal = i.animal || slugToAnimal(i.slug);
      return iAnimal === currentAnimal;
    })
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  const ideas = await loadAllIdeas();
  return ideas.map((idea) => ({ slug: idea.slug }));
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/-names$/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    + " Names";
}

function slugToAnimal(slug: string): string {
  const parts = slug.replace(/-names$/, "").split("-");
  return parts[parts.length - 1].toLowerCase();
}

function slugToAdjective(slug: string): string {
  const parts = slug.replace(/-names$/, "").split("-");
  return parts.slice(1, -1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function slugToNum(slug: string): string {
  const parts = slug.replace(/-names$/, "").split("-");
  return parts[0];
}

function mapAdjToNameField(adj: string): keyof AnimalData {
  const adjLower = adj.toLowerCase();
  const cuteWords = ["cute", "adorable", "sweet", "lovable", "gentle", "happy", "playful", "tiny", "fluffy"];
  const funnyWords = ["funny", "quirky", "silly", "hilarious"];
  const coolWords = ["cool", "elegant", "beautiful", "majestic", "brave", "royal", "mighty", "charming"];
  const uniqueWords = ["unique", "creative", "clever", "modern", "trendy"];
  const fantasyWords = ["exotic", "wild", "magical", "fantasy"];
  const classicWords = ["classic", "famous", "popular", "traditional"];
  
  if (cuteWords.some(w => adjLower.includes(w))) return "cuteNames";
  if (funnyWords.some(w => adjLower.includes(w))) return "funnyNames";
  if (coolWords.some(w => adjLower.includes(w))) return "coolNames";
  if (uniqueWords.some(w => adjLower.includes(w))) return "uniqueNames";
  if (fantasyWords.some(w => adjLower.includes(w))) return "fantasyNames";
  if (classicWords.some(w => adjLower.includes(w))) return "maleNames";
  return "uniqueNames";
}

function getAnimalCategoryLink(animal: string): string {
  const links: Record<string, string> = {
    dog: "/dog-names/", cat: "/cat-names/", rabbit: "/rabbit-names/",
    horse: "/horse-names/", bird: "/bird-names/", hamster: "/hamster-names/",
  };
  return links[animal] || `/${animal}-names/`;
}

function generateNamingTips(title: string, animal: string, adj: string): string[] {
  return [
    `Say the name aloud several times before committing — ${adj.toLowerCase()} ${animal} names should feel natural and joyful every time you call your pet.`,
    `Choose a name with clear consonant sounds that your ${animal} can easily distinguish from background noise and everyday conversation.`,
    `Consider your ${animal}'s personality before finalizing. The most ${adj.toLowerCase()} name is the one that genuinely matches who your companion actually is.`,
    `Test your top three choices for a few days each. The name that consistently feels right during feeding, play, and cuddle time is your winner.`,
    `Involve your whole household in the decision. A ${adj.toLowerCase()} ${animal} name should resonate with everyone who will use it daily for years to come.`,
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slugToTitle(slug);
  const animal = slugToAnimal(slug);
  const adj = slugToAdjective(slug);
  const description = `${title} for ${animal}s. Browse ${adj.toLowerCase()} ${animal} name ideas handpicked from our collection of 989+ animal categories — all 100% free and instant.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `https://bestanimalnames.com/ideas/${slug}/` },
  };
}

export default async function IdeasPage({ params }: Props) {
  const { slug } = await params;
  const title = slugToTitle(slug);
  const animal = slugToAnimal(slug);
  const adj = slugToAdjective(slug);
  const num = slugToNum(slug);

  const animalData = await loadAnimalData(animal);
  const nameField = mapAdjToNameField(adj);
  
  let sampleNames: string[] = [];
  if (animalData) {
    const names = animalData[nameField] as string[] || [];
    // Get up to 20 names, if fewer than 20, supplement from other categories
    sampleNames = names.slice(0, 20);
    if (sampleNames.length < 20) {
      const allCategories: (keyof AnimalData)[] = ["maleNames", "femaleNames", "cuteNames", "funnyNames", "fantasyNames", "uniqueNames", "coolNames", "babyNames"];
      for (const cat of allCategories) {
        if (sampleNames.length >= 20) break;
        if (cat === nameField) continue;
        const extra = (animalData[cat] as string[] || []).filter(n => !sampleNames.includes(n));
        sampleNames = sampleNames.concat(extra.slice(0, 20 - sampleNames.length));
      }
    }
  }

  const allAnimals = await loadIndex();
  const categoryLink = getAnimalCategoryLink(animal);
  const namingTips = generateNamingTips(title, animal, adj);
  const animalIcon = animalData?.icon || "🐾";

  const imgSrc = `https://bestanimalnames.com/pins/${slug}.png`;

  const intro = `Looking for ${title.toLowerCase()}? You have come to the right place. BestAnimalNames.com has curated a complete collection of ${adj.toLowerCase()} ${animal} names handpicked from thousands of ideas submitted by pet owners worldwide. Whether you need a name for a new ${animal === "dog" ? "puppy" : animal === "cat" ? "kitten" : animal}, a rescue ${animal}, or just browsing for inspiration, this list of ${num}+ names has something for everyone. Our ${adj.toLowerCase()} ${animal} name collection features carefully chosen names that stand out from classic favorites to one-of-a-kind ideas you will not find anywhere else. Each name has been selected for its charm, personality, and uniqueness, perfect for ${animal} lovers who want something special. All our ${animal} names are 100% free, no sign-up required.`;

  const namingTipsIntro = `Naming your ${animal} is one of the most personal and lasting decisions you will make as a pet owner. The right ${adj.toLowerCase()} ${animal} name becomes part of your daily vocabulary, spoken hundreds of times over years of companionship. Here are five essential tips for choosing the perfect ${adj.toLowerCase()} name for your ${animal}.`;

  const relatedAnimals = allAnimals
    .filter(a => a.slug !== animal)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  const relatedIdeas = await getRelatedIdeas(slug, 8);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bestanimalnames.com/" },
      { "@type": "ListItem", position: 2, name: `${animal.charAt(0).toUpperCase() + animal.slice(1)} Names`, item: `https://bestanimalnames.com${categoryLink}` },
      { "@type": "ListItem", position: 3, name: title, item: `https://bestanimalnames.com/ideas/${slug}/` },
    ],
  };

  const itemListSchema = sampleNames.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: sampleNames.map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
    })),
  } : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: `Find the perfect ${adj.toLowerCase()} name for your ${animal} — ${num}+ handpicked ideas from BestAnimalNames.com.`,
    author: { "@type": "Organization", name: "BestAnimalNames Editorial Team", url: "https://bestanimalnames.com/about/" },
    publisher: { "@type": "Organization", name: "BestAnimalNames", url: "https://bestanimalnames.com" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://bestanimalnames.com/ideas/${slug}/` },
    datePublished: "2025-06-01",
    dateModified: "2026-06-25",
    inLanguage: "en",
  };

  const faqSchema = namingTips.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: namingTips.map((tip) => ({
      "@type": "Question",
      name: tip.split(" — ")[0] || tip.slice(0, 80) + "...",
      acceptedAnswer: { "@type": "Answer", text: tip },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {itemListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap">
        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
        <Link href={categoryLink} className="hover:text-primary">{animal.charAt(0).toUpperCase() + animal.slice(1)} Names</Link><span>/</span>
        <span className="text-gray-800 font-medium">{title}</span>
      </nav>

      <section className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{title}</h1>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto">
            Find the perfect {adj.toLowerCase()} name for your {animal} — {num}+ handpicked ideas
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8">
        {/* Sample Names */}
        {sampleNames.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {animalIcon} Sample {adj} {animal.charAt(0).toUpperCase() + animal.slice(1)} Names
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sampleNames.map((name) => (
                <Link
                  key={name}
                  href={`${categoryLink}`}
                  className="bg-amber-50 hover:bg-amber-100 rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-800 hover:text-primary transition-colors"
                >
                  {name}
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href={categoryLink} className="text-primary hover:underline text-sm font-semibold">
                See all {animal} names →
              </Link>
            </div>
          </div>
        )}

        {/* Intro */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4">About These {adj} {animal.charAt(0).toUpperCase() + animal.slice(1)} Names</h2>
          <p className="text-gray-700 leading-relaxed">{intro}</p>
        </div>

        {/* Naming Tips */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4">Tips for Choosing the Perfect {animal.charAt(0).toUpperCase() + animal.slice(1)} Name</h2>
          <p className="text-gray-700 mb-4">{namingTipsIntro}</p>
          <ol className="space-y-3 list-decimal list-inside">
            {namingTips.map((tip, i) => (
              <li key={i} className="text-gray-700 leading-relaxed pl-1">{tip}</li>
            ))}
          </ol>
        </div>

        {/* Pinterest Image */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 text-center">
          <h2 className="text-xl font-bold mb-4">Save This Idea</h2>
          <img
            src={imgSrc}
            alt={title}
            className="max-w-full h-auto rounded-xl mx-auto shadow-md"
            style={{ maxHeight: "400px" }}
          />
          <p className="text-sm text-gray-500 mt-3">
            Pin this {adj.toLowerCase()} {animal} names collection to your Pinterest board
          </p>
        </div>

        {/* Related Name Collections */}
        {relatedIdeas.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold mb-4">🔗 Related {animal.charAt(0).toUpperCase() + animal.slice(1)} Name Collections</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {relatedIdeas.map((idea) => {
                const ideaTitle = slugToTitle(idea.slug);
                const ideaAnimal = slugToAnimal(idea.slug);
                const ideaNum = slugToNum(idea.slug);
                return (
                  <Link
                    key={idea.slug}
                    href={`/ideas/${idea.slug}/`}
                    className="bg-amber-50 hover:bg-amber-100 rounded-lg p-3 text-center border border-amber-200 hover:border-primary/30 transition-colors"
                  >
                    <div className="text-xs font-semibold text-gray-800 line-clamp-2">{ideaTitle}</div>
                    <div className="text-xs text-gray-500 mt-1">{ideaNum}+ names</div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Animals */}
        {relatedAnimals.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold mb-4">Explore More Animal Names</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {relatedAnimals.map((a) => (
                <Link
                  key={a.slug}
                  href={`/animal/${a.slug}/`}
                  className="bg-gray-50 hover:bg-primary/5 rounded-lg p-3 text-center text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  <div className="text-xl mb-1">{a.icon}</div>
                  <div>{a.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center">
          <p className="text-lg font-semibold mb-2">Ready to browse all {animal} names?</p>
          <p className="text-gray-600 mb-4">
            Explore our complete {animal} name collection — {title.toLowerCase()} and more. 100% free, no sign-up.
          </p>
          <Link
            href={categoryLink}
            className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
          >
            Browse All {animal.charAt(0).toUpperCase() + animal.slice(1)} Names →
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-primary hover:underline text-sm">
            ← Back to BestAnimalNames.com
          </Link>
        </div>
      </section>

      <AdSlot position="footer" />
    </>
  );
}
