import type { Metadata } from "next";
import Link from "next/link";
import { loadIndex, loadCategories, loadGuides, loadBlogPosts } from "@/lib/data";




const POPULAR_SLUGS = [
  "dog", "cat", "fox", "bear", "rabbit", "hamster", "horse", "parrot",
  "turtle", "fish", "snake", "bird", "lion", "tiger", "wolf", "elephant",
  "panda", "dolphin", "penguin", "dragon", "hedgehog", "frog", "owl", "unicorn",
];

const CATEGORY_LABELS = [
  { label: "🐕 Popular", href: "/animal/dog/", desc: "Dog, Cat, Fox, Bear, Rabbit…" },
  { label: "🦎 Reptiles", href: "/animal/snake/", desc: "Snake, Lizard, Turtle, Gecko…" },
  { label: "🦅 Birds", href: "/animal/parrot/", desc: "Parrot, Eagle, Owl, Penguin…" },
  { label: "🐟 Aquatic", href: "/animal/fish/", desc: "Fish, Dolphin, Whale, Shark…" },
  { label: "🐘 Safari", href: "/animal/lion/", desc: "Lion, Tiger, Elephant, Giraffe…" },
  { label: "🔮 Mythical", href: "/animal/dragon/", desc: "Dragon, Unicorn, Phoenix…" },
  { label: "🐹 Small Pets", href: "/animal/hamster/", desc: "Hamster, Guinea Pig, Rabbit…" },
  { label: "🐴 Farm", href: "/animal/horse/", desc: "Horse, Cow, Pig, Sheep, Goat…" },
];

export const metadata: Metadata = {
  title: "Animal Name Generator — Find the Perfect Name for Your Pet",
  description: "Discover 989+ animal name generators with 160+ names each. Find male, female, cute, funny, unique names for dogs, cats, birds, and more. 100% free!",
  openGraph: {
    title: "Animal Name Generator — Find the Perfect Name for Your Pet",
    description: "Discover 989+ animal name generators with 160+ names each. Find male, female, cute, funny, unique names for dogs, cats, birds, and more.",
    type: "website",
    siteName: "Animal Name Generator",
  },
  twitter: { card: "summary_large_image", title: "Animal Name Generator", description: "989+ animal name generators — all free!" },
  alternates: { canonical: "https://bestanimalnames.com/" },
  keywords: ["animal names", "pet names", "name generator", "dog names", "cat names", "bird names"],
};

export default async function HomePage() {
  const allAnimals = await loadIndex();
  const categories = await loadCategories();
  const guides = await loadGuides();
  const blogPosts = await loadBlogPosts();

  const animalCount = allAnimals.length;
  const categoryCount = categories.length;
  // total pages = animals × 11 (page + facts + 9 name-types) + categories × 11 + static(9) + guides + blog
  const popular = POPULAR_SLUGS.map((s) => allAnimals.find((a) => a.slug === s)).filter(
    Boolean
  ) as { slug: string; name: string; icon: string }[];

  // Structured Data Schemas
  const totalPages = animalCount * 11 + categoryCount * 10 + 9 + guides.length + blogPosts.length;

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Animal Name Generator",
    url: "https://bestanimalnames.com",
    description: "Discover the perfect name for any animal. Browse 989+ animal name generators with 160+ hand-picked names each.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://bestanimalnames.com/animals/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Animal Name Generator",
    url: "https://bestanimalnames.com",
    description: "Free animal name generator with 989+ species and 160+ names per animal.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Animal Name <span className="text-accent">Generator</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
            Find the perfect name for {animalCount}+ animals, {categoryCount}+ categories, {totalPages}+ pages of ideas — all free, all instant!
          </p>

          {/* Search Box */}
          <form
            action="/animals/"
            method="GET"
            className="max-w-lg mx-auto flex gap-2"
          >
            <input
              type="text"
              name="q"
              placeholder="Search animals... (e.g., dog, cat, fox)"
              className="flex-1 px-5 py-4 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="bg-accent hover:bg-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex justify-center gap-4 flex-wrap mt-8">
            <Link
              href="/animal/dog/"
              className="bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              🐕 Dog Names
            </Link>
            <Link
              href="/animal/cat/"
              className="bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              🐱 Cat Names
            </Link>
            <Link
              href="/animals/"
              className="bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
            >
              View All {animalCount}+ →
            </Link>
          </div>
        </div>
      </section>

      {/* Top 20 Popular */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">⭐ Popular Animals</h2>
          <Link
            href="/animals/"
            className="text-primary font-semibold hover:underline text-sm"
          >
            See all {animalCount} animals →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {popular.map((animal) => (
            <Link
              key={animal.slug}
              href={`/animal/${animal.slug}/`}
              className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="text-3xl mb-2">{animal.icon}</div>
              <div className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors truncate">
                {animal.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      
      {/* Explore Animal Facts */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">💡 Explore Animal Facts</h2>
              <p className="text-gray-600 mb-4">Learn about {animalCount} animals — scientific names, habitats, diets, lifespans, and fun trivia.</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link href="/animal/dog/facts/" className="bg-white border border-amber-200 rounded-full px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 transition-colors">
                  🐕 Dog Facts
                </Link>
                <Link href="/animal/cat/facts/" className="bg-white border border-amber-200 rounded-full px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 transition-colors">
                  🐱 Cat Facts
                </Link>
                <Link href="/animal/lion/facts/" className="bg-white border border-amber-200 rounded-full px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 transition-colors">
                  🦁 Lion Facts
                </Link>
                <Link href="/animals/" className="bg-amber-600 text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-amber-700 transition-colors">
                  All {animalCount} Animals →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            📂 Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {CATEGORY_LABELS.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="font-bold text-gray-800 group-hover:text-primary transition-colors mb-1">
                  {cat.label}
                </div>
                <div className="text-sm text-gray-500">{cat.desc}</div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/category/dog-breeds/"
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
            >
              Browse {categoryCount} Categories →
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Teaser */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center mb-8">📝 Latest from Our Blog</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogPosts.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}/`}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="text-3xl mb-2">{post.image}</div>
              <div className="text-xs text-gray-400 mb-1">{post.date} · {post.category}</div>
              <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors mb-1 line-clamp-2">{post.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
            </Link>
          ))}
        </div>
        {blogPosts.length > 3 && (
          <div className="text-center mt-6">
            <Link href="/blog/" className="text-primary font-semibold hover:underline">Read all {blogPosts.length} articles →</Link>
          </div>
        )}
      </section>

      {/* Guide Teaser */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">📖 Naming Guides</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {guides.slice(0, 8).map((g) => (
              <Link key={g.slug} href={`/guide/${g.slug}/`}
                className="bg-gray-50 rounded-lg px-4 py-3 text-center text-sm font-medium text-gray-700 border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all">
                {g.title.split(" —")[0]}
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/guide/japanese-animal-names/" className="text-primary font-semibold hover:underline">Browse {guides.length} guides →</Link>
          </div>
        </div>
      </section>

      {/* Dog & Cat SEO */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-3">🐕 Most Popular Dog Names</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Dogs are loyal companions and choosing the right name helps build a lasting bond.
              Trending names like <strong>Max</strong>, <strong>Charlie</strong>, and <strong>Cooper</strong>
              remain evergreen favorites. For female dogs, <strong>Luna</strong>, <strong>Bella</strong>,
              and <strong>Daisy</strong> continue to top the charts. Two-syllable names are especially
              effective because dogs can distinguish them easily from everyday commands.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whatever your dog&apos;s personality — goofy, noble, energetic, or calm — our
              <a href="/animal/dog/" className="text-primary font-semibold hover:underline"> dog name generator</a> offers 160+ curated names spanning cute, funny, fantasy, and unique
              categories. Browse all {allAnimals.find(a => a.slug === "dog")?.name.toLowerCase()} names or explore specific categories like
              <a href="/male-dog-names/" className="text-primary font-semibold hover:underline"> male dog names</a> and
              <a href="/female-dog-names/" className="text-primary font-semibold hover:underline"> female dog names</a>.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-3">🐱 Unique & Cute Cat Names</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Cats are mysterious, elegant, and full of personality. Names like <strong>Luna</strong>,
              <strong>Oliver</strong>, and <strong>Cleo</strong> have charmed pet owners for years.
              Feline names tend to be graceful, soft-sounding, and often inspired by mythology, nature,
              and pop culture. Cats respond especially well to names ending in an &quot;ee&quot; vowel sound.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether your cat is a regal lounger or a mischievous explorer, our
              <a href="/animal/cat/" className="text-primary font-semibold hover:underline"> cat name generator</a> helps you find the ideal match from 160+ curated names. Explore
              <a href="/cute-cat-names/" className="text-primary font-semibold hover:underline"> cute cat names</a> and
              <a href="/funny-cat-names/" className="text-primary font-semibold hover:underline"> funny cat names</a> too.
            </p>
          </div>
        </div>
      </section>

      {/* Why Use */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            🐾 Why Use Animal Name Generator
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {[
              { icon: "🌍", title: `${animalCount}+ Animals`, desc: "From dogs and cats to axolotls and zebras — find names for virtually any animal." },
              { icon: "📋", title: `${totalPages}+ Name Pages`, desc: `Each animal has dedicated pages with curated names across multiple categories.` },
              { icon: "💕", title: "Cute Names", desc: "Adorable and sweet names perfect for pets that melt your heart." },
              { icon: "😂", title: "Funny Names", desc: "Witty, pun-filled, and hilarious names that will make everyone smile." },
              { icon: "🌟", title: "Unique Names", desc: "One-of-a-kind names you will not find anywhere else, hand-picked for originality." },
              { icon: "🎁", title: "Completely Free", desc: "No sign-ups, no subscriptions, no hidden costs. Every name, every category — always free." },
              { icon: "📱", title: "Mobile Friendly", desc: "Browse names on any device. Our site works seamlessly on phones, tablets, and desktops." },
              { icon: "🔄", title: "Updated Regularly", desc: "We refresh our name collections frequently to keep ideas fresh and relevant." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>
              Naming an animal is a special moment. Whether you are bringing home a new puppy, adopting
              a rescue cat, naming a classroom hamster, or creating a character for your story, the
              right name creates an instant connection. At <strong>Animal Name Generator</strong>, we
              make that moment effortless and fun.
            </p>
            <p>
              Our site is built for speed and simplicity. No complicated menus, no pop-up ads, no
              forced account creation. Just open the animal you are interested in, scroll through
              the names, and pick your favorite. And because we are fully mobile-friendly, you can
              browse names on your phone while visiting a shelter or at the pet store.
            </p>
            <p>
              We are proud to serve a global community of animal lovers. Start exploring and discover
              why thousands of people trust Animal Name Generator for their most important naming decisions.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
