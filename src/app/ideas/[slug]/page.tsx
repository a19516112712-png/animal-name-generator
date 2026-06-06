import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadIndex } from "@/lib/data";
import AdSlot from "@/components/AdSlot";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

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

function generateDescription(title: string, animal: string, adj: string): string {
  const descs = [
    `Looking for ${title.toLowerCase()}? You've come to the right place. BestAnimalNames.com has curated a complete collection of ${adj.toLowerCase()} ${animal} names — handpicked from thousands of ideas submitted by pet owners worldwide. Whether you need a name for a new puppy, a rescue ${animal}, or just browsing for inspiration, this list has something for everyone. All our ${animal} names are 100% free, no sign-up required. Browse the full collection below and find the perfect name today.`,
    `Discover ${title.toLowerCase()} at BestAnimalNames.com. Our ${adj.toLowerCase()} ${animal} name collection features carefully chosen names that stand out — from classic favorites to one-of-a-kind ideas you won't find anywhere else. Each name has been selected for its charm, personality, and uniqueness. Perfect for ${animal} lovers who want something special. Start exploring now and find the name that feels just right for your ${animal}.`,
    `Welcome to our ${title.toLowerCase()} collection! At BestAnimalNames.com, we've gathered hundreds of ${adj.toLowerCase()} names for ${animal}s — organized and ready for you to browse. From trendy picks to timeless classics, every name in this list has been chosen with care. Whether you're naming a show ${animal}, a family pet, or a character in your story, you'll find the perfect match here. All free, all instant, no registration needed.`,
  ];
  let h = 0;
  for (let i = 0; i < title.length; i++) h = ((h << 5) - h + title.charCodeAt(i)) | 0;
  return descs[Math.abs(h) % descs.length];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slugToTitle(slug);
  const animal = slugToAnimal(slug);
  const adj = slugToAdjective(slug);
  const description = `Discover ${title.toLowerCase()} for ${animal}s. Browse our curated collection of ${adj.toLowerCase()} ${animal} name ideas — all 100% free and instant.`;

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
  const description = generateDescription(title, animal, adj);

  const allAnimals = loadIndex();
  const categoryLink =
    animal === "dog" ? "/dog-names/" :
    animal === "cat" ? "/cat-names/" :
    animal === "rabbit" ? "/rabbit-names/" :
    animal === "horse" ? "/horse-names/" :
    animal === "bird" ? "/bird-names/" :
    animal === "hamster" ? "/hamster-names/" :
    `/${animal}-names/`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bestanimalnames.com/" },
      { "@type": "ListItem", position: 2, name: `${animal.charAt(0).toUpperCase() + animal.slice(1)} Names`, item: `https://bestanimalnames.com${categoryLink}` },
      { "@type": "ListItem", position: 3, name: title, item: `https://bestanimalnames.com/ideas/${slug}/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap">
        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
        <Link href={categoryLink} className="hover:text-primary">{animal.charAt(0).toUpperCase() + animal.slice(1)} Names</Link><span>/</span>
        <span className="text-gray-800 font-medium">{title}</span>
      </nav>

      <section className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{title}</h1>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto">
            Find the perfect {adj.toLowerCase()} name for your {animal}
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>

        <div className="mt-8 bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center">
          <p className="text-lg font-semibold mb-2">🐾 Ready to browse all {animal} names?</p>
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
