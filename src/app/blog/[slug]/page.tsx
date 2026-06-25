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
  return posts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true;
export const revalidate = 3600;


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


function loadAllBlogPosts(): BlogContent[] {
  const fp = path.join(process.cwd(), "src/data/blog/index.json");
  return JSON.parse(fs.readFileSync(fp, "utf-8")) as BlogContent[];
}

function getRelatedPosts(currentSlug: string, count: number = 6): BlogContent[] {
  const all = loadAllBlogPosts();
  const current = all.find(p => p.slug === currentSlug);
  if (!current) return [];
  
  const scored = all
    .filter(p => p.slug !== currentSlug)
    .map(p => {
      let score = 0;
      if (p.category === current.category) score += 3;
      const sharedTags = p.tags.filter(t => current.tags.includes(t));
      score += sharedTags.length * 2;
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(x => x.post);
  
  return scored;
}

function getPrevNextPosts(currentSlug: string): { prev: BlogContent | null; next: BlogContent | null } {
  const all = loadAllBlogPosts();
  const idx = all.findIndex(p => p.slug === currentSlug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

function renderContent(content: { type: string; text: string }[], animals: { slug: string; name: string }[]): React.ReactNode {
  const slugMap = new Map(animals.map((a) => [a.slug, a.name]));

  const HAS_HTML = /<[a-zA-Z][^>]*>/;

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

  function renderTocBlock(html: string, idx: number): React.ReactNode {
    const liRegex = /<li>\s*<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>\s*<\/li>/g;
    const items: { href: string; text: string }[] = [];
    let match;
    while ((match = liRegex.exec(html)) !== null) {
      items.push({ href: match[1], text: match[2].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'") });
    }
    if (items.length === 0) return null;
    return (
      <div key={idx} className="bg-gradient-to-br from-primary/5 to-indigo-50 rounded-2xl p-6 border border-primary/10 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Table of Contents</h3>
        <ol className="space-y-2 list-none pl-0">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5 min-w-[1.5em]">{i + 1}.</span>
              <a href={item.href} className="text-gray-700 hover:text-primary hover:underline transition-colors text-sm leading-relaxed">
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  function hasHtml(text: string): boolean {
    return HAS_HTML.test(text);
  }

  function isTocBlock(text: string): boolean {
    return /^<(ol|ul)>/.test(text.trim());
  }

  return content.map((block, idx) => {
    // TOC blocks: parse HTML list into styled React components
    if (block.type === "p" && isTocBlock(block.text)) {
      return renderTocBlock(block.text, idx);
    }

    // Blocks with HTML tags: render safely using dangerouslySetInnerHTML
    // (content is generated by our own build pipeline; trusted source)
    if (hasHtml(block.text)) {
      const Tag = block.type === "h2" ? "h2" : block.type === "h3" ? "h3" : "p";
      const className = block.type === "h2"
        ? "text-2xl font-bold mt-10 mb-4 text-gray-900"
        : block.type === "h3"
        ? "text-xl font-semibold mt-8 mb-3 text-gray-800"
        : "text-gray-700 leading-relaxed mb-4";
      return <Tag key={idx} className={className} dangerouslySetInnerHTML={{ __html: block.text }} />;
    }

    // Plain text blocks: use replaceLinks for {animal-slug} patterns
    switch (block.type) {
      case "toc": {
        const items: { href: string; text: string }[] = (block as any).items || [];
        if (items.length === 0) return null;
        return (
          <div key={idx} className="bg-gradient-to-br from-primary/5 to-indigo-50 rounded-2xl p-6 border border-primary/10 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Table of Contents</h3>
            <ol className="space-y-2 list-none pl-0">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5 min-w-[1.5em]">{i + 1}.</span>
                  <a href={item.href} className="text-gray-700 hover:text-primary hover:underline transition-colors text-sm leading-relaxed">
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        );
      }
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
  const relatedPosts = getRelatedPosts(slug, 6);
  const { prev, next } = getPrevNextPosts(slug);

  const articleBody = post.content.map(b => b.text).join(" ");
  const wordCount = articleBody.split(/\s+/).length;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@type": "Organization", name: "BestAnimalNames Editorial Team", url: "https://bestanimalnames.com/about/" },
    publisher: { "@type": "Organization", name: "BestAnimalNames", url: "https://bestanimalnames.com" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://bestanimalnames.com/blog/${slug}/` },
    wordCount,
    articleBody,
    image: `https://bestanimalnames.com/images/og/blog-${slug}.png`,
    inLanguage: "en",
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
            <span className="text-gray-500">By BestAnimalNames Editorial Team</span>
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

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">📝 Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((rp) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}/`}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                  <div className="text-3xl mb-3">{rp.image}</div>
                  <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">{rp.category}</span>
                  <h3 className="text-sm font-bold text-gray-800 mt-2 group-hover:text-primary line-clamp-2">{rp.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rp.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Previous / Next Navigation */}
        {(prev || next) && (
          <nav className="mt-12 grid grid-cols-2 gap-4" aria-label="Post navigation">
            {prev ? (
              <Link href={`/blog/${prev.slug}/`}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group text-left">
                <span className="text-xs text-gray-500">← Previous Post</span>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-primary mt-1 line-clamp-1">{prev.title}</p>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/blog/${next.slug}/`}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group text-right">
                <span className="text-xs text-gray-500">Next Post →</span>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-primary mt-1 line-clamp-1">{next.title}</p>
              </Link>
            ) : <div />}
          </nav>
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
