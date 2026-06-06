import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { loadIndex, loadGuides } from "@/lib/data";

interface BlogContent {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  tags: string[];
  content: { type: string; text: string }[];
  faq?: { q: string; a: string }[];
  relatedAnimals?: string[];
  relatedGuides?: string[];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const fp = path.join(process.cwd(), "src/data/blog/index.json");
  const posts: { slug: string }[] = JSON.parse(fs.readFileSync(fp, "utf-8"));
  return posts.slice(0, 20).map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true;


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = loadBlogPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
    alternates: { canonical: `https://bestanimalnames.com/blog/${slug}/` },
    keywords: post.tags.join(", "),
  };
}

function loadBlogPost(slug: string): BlogContent | null {
  try {
    const fp = path.join(process.cwd(), "src/data/blog", `${slug}.json`);
    return JSON.parse(fs.readFileSync(fp, "utf-8")) as BlogContent;
  } catch {
    return null;
  }
}

function renderContent(content: { type: string; text: string }[], animals: { slug: string; name: string }[]): React.ReactNode {
  const slugMap = new Map(animals.map((a) => [a.slug, a.name]));

  function replaceLinks(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    const regex = /\{([a-z0-9-]+)\}/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const animalSlug = match[1];
      const name = slugMap.get(animalSlug);
      if (name) {
        parts.push(
          <Link key={match.index} href={`/animal/${animalSlug}/`} className="text-primary font-semibold hover:underline">
            {name} Name Generator
          </Link>
        );
      } else {
        parts.push(match[0]);
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts;
  }

  return content.map((block, idx) => {
    switch (block.type) {
      case "h2":
        return <h2 key={idx} className="text-2xl font-bold mt-10 mb-4 text-gray-900">{replaceLinks(block.text)}</h2>;
      case "h3":
        return <h3 key={idx} className="text-xl font-semibold mt-8 mb-3 text-gray-800">{replaceLinks(block.text)}</h3>;
      case "p":
        return <p key={idx} className="text-gray-700 leading-relaxed mb-4">{replaceLinks(block.text)}</p>;
      default:
        return <p key={idx} className="text-gray-700 leading-relaxed mb-4">{replaceLinks(block.text)}</p>;
    }
  });
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = loadBlogPost(slug);
  if (!post) notFound();

  const animals = loadIndex();
  const guides = loadGuides();
  const guideMap = new Map(guides.map((g) => [g.slug, g.title]));
  const animalMap = new Map(animals.map((a) => [a.slug, a]));

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Animal Name Generator" },
    publisher: { "@type": "Organization", name: "Animal Name Generator", url: "https://bestanimalnames.com" },
  };

  const faqSchema = post.faq && post.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://bestanimalnames.com/" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://bestanimalnames.com/blog/" },
          { "@type": "ListItem", position: 3, name: post.title, item: `https://bestanimalnames.com/blog/${slug}/` },
        ],
      }) }} />

      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
        <Link href="/blog/" className="hover:text-primary">Blog</Link><span>/</span>
        <span className="text-gray-800 font-medium">{post.title}</span>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">{post.image}</div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-3">
            <span className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full">{post.category}</span>
            <span>{post.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{post.description}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {renderContent(post.content, animals)}
        </div>

        {/* FAQ Section */}
        {post.faq && post.faq.length > 0 && (
          <section className="mt-12 bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">❓ Frequently Asked Questions</h2>
            <div className="space-y-3">
              {post.faq.map((item, idx) => (
                <details key={idx} className="bg-gray-50 rounded-xl p-5 group">
                  <summary className="font-semibold cursor-pointer group-open:text-primary">{item.q}</summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Animals */}
        {post.relatedAnimals && post.relatedAnimals.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">🐾 Related Animal Name Generators</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {post.relatedAnimals.map((slug) => {
                const a = animalMap.get(slug);
                if (!a) return null;
                return (
                  <Link key={slug} href={`/animal/${slug}/`}
                    className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                    <div className="text-2xl mb-1">{a.icon}</div>
                    <div className="text-sm font-semibold text-gray-700 group-hover:text-primary">{a.name}</div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Guides */}
        {post.relatedGuides && post.relatedGuides.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">📖 Related Naming Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {post.relatedGuides.map((slug) => {
                const title = guideMap.get(slug);
                if (!title) return null;
                return (
                  <Link key={slug} href={`/guide/${slug}/`}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group flex items-center gap-3">
                    <span className="text-2xl">📖</span>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-primary">{title}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/10 text-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">🐾 Ready to find the perfect animal name?</p>
          <p className="text-gray-600 mb-4">Browse our complete collection of 200+ animal name generators — all 100% free.</p>
          <Link href="/animals/" className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors">
            Browse All Animals →
          </Link>
        </div>
      </article>
    </>
  );
}
