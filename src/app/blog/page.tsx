import { Metadata } from "next";
import Link from "next/link";
import { loadBlogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Animal Name Generator Blog — Pet Naming Tips, Guides & Ideas",
  description: "Read our blog for pet naming tips, complete name guides, and creative ideas for naming dogs, cats, fish, birds, reptiles, and more.",
  openGraph: { title: "Animal Name Generator Blog", description: "Pet naming tips, guides, and creative name ideas for every animal." },
  twitter: { card: "summary", title: "Animal Name Generator Blog" },
  alternates: { canonical: "https://bestanimalnames.com/blog/" },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Animal Name Generator Blog",
  "description": "Pet naming tips, complete name guides, and creative ideas for every animal.",
  "url": "https://bestanimalnames.com/blog/",
};

export default async function BlogPage() {
  const posts = await loadBlogPosts();

  return (
    <>
      <script type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
        <span className="text-gray-800 font-medium">Blog</span>
      </nav>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl font-extrabold mb-4">📝 Animal Name Generator Blog</h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">Pet naming tips, complete guides, and creative ideas for every animal.</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{post.image}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    <Link href={`/blog/${post.slug}/`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-3">{post.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}/`} className="inline-block mt-3 text-sm font-semibold text-primary hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
