import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadBlogPost, loadBlogPosts, loadGuides, loadIndex } from "@/lib/data";

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

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  tags: string[];
}
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const data = await loadBlogPosts();
  return data.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadBlogPost(slug);
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

async function getRelatedPosts(currentSlug: string, count: number = 6): Promise<BlogPost[]> {
  const all = await loadBlogPosts();
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

async function getPrevNextPosts(currentSlug: string): Promise<{ prev: BlogPost | null; next: BlogPost | null }> {
  const all = await loadBlogPosts();
  const idx = all.findIndex(p => p.slug === currentSlug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await loadBlogPost(slug);
  if (!post) notFound();

  const guides = await loadGuides();
  const guideMap = new Map(guides.map(g => [g.slug, g.title]));
  const animals = await loadIndex();
  const animalMap = new Map(animals.map(a => [a.slug, a]));

  const relatedPosts = await getRelatedPosts(slug);
  const { prev, next } = await getPrevNextPosts(slug);

  return (
    <article className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span> / </span>
        <Link href="/blog/" className="hover:text-primary">Blog</Link>
        <span> / </span>
        <span className="text-gray-800">{post.title}</span>
      </nav>

      <header className="mb-8">
        <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">{post.category}</span>
        <h1 className="text-3xl font-bold mt-2 mb-2">{post.title}</h1>
        <p className="text-gray-500 text-sm">{post.date}</p>
        <p className="text-gray-600 mt-2">{post.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </header>

      <div className="prose max-w-none text-gray-700 space-y-6">
        {post.content.map((block, idx) => {
          if (block.type === "h2") return <h2 key={idx} className="text-2xl font-bold mt-8 mb-4">{block.text}</h2>;
          if (block.type === "h3") return <h3 key={idx} className="text-xl font-bold mt-6 mb-3">{block.text}</h3>;
          if (block.type === "p") return <p key={idx} className="leading-relaxed">{block.text}</p>;
          return null;
        })}
      </div>

      {post.faq && post.faq.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-4">
            {post.faq.map((item, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                <summary className="font-semibold cursor-pointer group-open:text-primary">{item.q}</summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

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
  );
}
