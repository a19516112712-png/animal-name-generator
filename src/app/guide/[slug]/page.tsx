import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadGuide, loadGuides, loadIndex, loadAnimalData } from "@/lib/data";
import AdSlot from "@/components/AdSlot";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return loadGuides().slice(0, 30).map((g) => ({ slug: g.slug }));
}

export const dynamicParams = true;


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = loadGuide(slug);
  if (!guide) return { title: "Not Found" };
  return {
    title: guide.title,
    description: guide.description,
    openGraph: { title: guide.title, description: guide.description, type: "article" },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description },
    alternates: { canonical: `https://bestanimalnames.com/guide/${slug}/` },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = loadGuide(slug);
  if (!guide) notFound();

  const allAnimals = loadIndex();
  const animalMap = new Map(allAnimals.map((a) => [a.slug, a]));
  const relatedAnimals = guide.relatedAnimals.map((s) => animalMap.get(s)).filter(Boolean) as { slug: string; name: string; icon: string }[];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question", name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bestanimalnames.com/" },
      { "@type": "ListItem", position: 2, name: "Naming Guides", item: "https://bestanimalnames.com/guides/" },
      { "@type": "ListItem", position: 3, name: guide.title, item: `https://bestanimalnames.com/guide/${slug}/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap">
        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
        <span className="text-gray-800 font-medium">{guide.title}</span>
      </nav>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{guide.title}</h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">{guide.description}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">📖 About This Guide</h2>
          <p className="text-gray-700 leading-relaxed">{guide.description}</p>
        </div>

        {relatedAnimals.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">🐾 Related Animals</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedAnimals.slice(0, 12).map((a) => (
                <Link key={a.slug} href={`/animal/${a.slug}/`}
                  className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                  <div className="text-2xl mb-1">{a.icon}</div>
                  <div className="text-xs font-semibold text-gray-600 group-hover:text-primary">{a.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {guide.faq.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">❓ Frequently Asked Questions</h2>
            <div className="space-y-3">
              {guide.faq.map((item, idx) => (
                <details key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 group">
                  <summary className="font-semibold cursor-pointer group-open:text-primary">{item.q}</summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center">
          <p className="text-lg font-semibold mb-2">🐾 Ready to find the perfect animal name?</p>
          <p className="text-gray-600 mb-4">Browse 989 animal name generators — all 100% free.</p>
          <Link href="/animals/" className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors">
            Browse All Animals →
          </Link>
        </div>
      </section>
      <AdSlot position="footer" />
    </>
  );
}
