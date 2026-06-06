import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCategory, loadCategories, loadIndex, NAME_TYPES } from "@/lib/data";
import AdSlot from "@/components/AdSlot";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return loadCategories().slice(0, 30).map((c) => ({ category: c.slug }));
}

export const dynamicParams = true;


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const data = loadCategory(category);
  if (!data) return { title: "Category Not Found" };
  return {
    title: data.seoTitle,
    description: data.seoDescription,
    openGraph: { title: data.seoTitle, description: data.seoDescription, type: "website" },
    twitter: { card: "summary_large_image", title: data.seoTitle, description: data.seoDescription },
    alternates: { canonical: `https://bestanimalnames.com/category/${category}/` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const data = loadCategory(category);
  if (!data) notFound();

  const allAnimals = loadIndex();
  const animalMap = new Map(allAnimals.map((a) => [a.slug, a]));
  const categoryAnimals = data.animals.map((s) => animalMap.get(s)).filter(Boolean) as { slug: string; name: string; icon: string }[];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bestanimalnames.com/" },
      { "@type": "ListItem", position: 2, name: `${data.name} Names`, item: `https://bestanimalnames.com/category/${category}/` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What types of names are available for ${data.name.toLowerCase()}?`,
        acceptedAnswer: { "@type": "Answer", text: `We offer 9 name categories for ${data.name.toLowerCase()}: male names, female names, cute names, funny names, fantasy names, unique names, cool names, and baby names — each with 20+ hand-picked options per animal.` },
      },
      {
        "@type": "Question",
        name: `How many ${data.name.toLowerCase()} species do you cover?`,
        acceptedAnswer: { "@type": "Answer", text: `Our ${data.name} Name Generator covers ${categoryAnimals.length} different species, each with 160+ carefully curated name ideas across multiple categories.` },
      },
      {
        "@type": "Question",
        name: `How do I use the ${data.name} Name Generator?`,
        acceptedAnswer: { "@type": "Answer", text: `Simply browse the species list, click any animal to see its dedicated name page with 160+ names, or explore specific name categories (male, female, cute, etc.) through the category links above. All names are free to use with no registration required.` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
        <span className="text-gray-800 font-medium">{data.name} Names</span>
      </nav>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <div className="text-5xl mb-4">{data.icon}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{data.name} Name Generator</h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">{data.description}</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-center mb-6">📛 {data.name} Name Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
          {NAME_TYPES.map((nt) => (
            <Link key={nt.key} href={`/category/${category}/${nt.key}/`}
              className="bg-white rounded-lg px-4 py-3 text-center font-medium text-gray-700 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
              {nt.emoji} {nt.label}
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">🐾 All {data.name}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categoryAnimals.map((a) => (
            <Link key={a.slug} href={`/animal/${a.slug}/`}
              className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
              <div className="text-3xl mb-2">{a.icon}</div>
              <div className="text-sm font-semibold text-gray-700 group-hover:text-primary">{a.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">About {data.name} Names {data.icon}</h2>
        <div className="text-gray-600 space-y-3 leading-relaxed">
          <p>Welcome to the <strong>{data.name} Name Generator</strong> — your ultimate resource for finding the perfect name for your animal. We have curated hundreds of name ideas across multiple categories including male, female, cute, funny, fantasy, unique, cool, and baby names.</p>
          <p>Browse {categoryAnimals.length} different {data.name.toLowerCase()} species and discover 1000s of name ideas. Each animal has its own dedicated page with 160+ hand-picked names.</p>
          <p><strong>Why use our generator?</strong> It is 100% free, no registration required, and provides instant results. Bookmark us for fresh inspiration anytime!</p>
        </div>
      </section>
      <AdSlot position="footer" />
    </>
  );
}
