import Link from "next/link";
import fs from "fs";
import path from "path";

interface AnimalIndex {
  slug: string;
  name: string;
  icon: string;
}

function loadIndex(): AnimalIndex[] {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "src/data/animals/index.json"), "utf-8")
  );
}

const POPULAR_SLUGS = [
  "dog", "cat", "fox", "bear", "rabbit", "hamster", "horse", "parrot",
  "turtle", "fish", "snake", "bird", "lion", "tiger", "wolf", "elephant",
  "panda", "dolphin", "penguin", "dragon", "hedgehog", "frog", "owl", "unicorn",
];

const CATEGORIES = [
  { label: "🐕 Popular", href: "/animal/dog/", desc: "Dog, Cat, Fox, Bear, Rabbit…" },
  { label: "🦎 Reptiles", href: "/animal/snake/", desc: "Snake, Lizard, Turtle, Gecko…" },
  { label: "🦅 Birds", href: "/animal/parrot/", desc: "Parrot, Eagle, Owl, Penguin…" },
  { label: "🐟 Aquatic", href: "/animal/fish/", desc: "Fish, Dolphin, Whale, Shark…" },
  { label: "🐘 Safari", href: "/animal/lion/", desc: "Lion, Tiger, Elephant, Giraffe…" },
  { label: "🔮 Mythical", href: "/animal/dragon/", desc: "Dragon, Unicorn, Phoenix…" },
  { label: "🐹 Small Pets", href: "/animal/hamster/", desc: "Hamster, Guinea Pig, Rabbit…" },
  { label: "🐴 Farm", href: "/animal/horse/", desc: "Horse, Cow, Pig, Sheep, Goat…" },
];

export default function HomePage() {
  const allAnimals = loadIndex();
  const popular = POPULAR_SLUGS.map((s) => allAnimals.find((a) => a.slug === s)).filter(
    Boolean
  ) as AnimalIndex[];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Animal Name <span className="text-accent">Generator</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
            Find the perfect name for 200+ animals. 9 name categories, 1000s of ideas —
            all free, all instant!
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
              View All 200+ →
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
            See all →
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

      {/* Featured Categories */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            📂 Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                  {cat.label}
                </div>
                <div className="text-xs text-gray-500">{cat.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-center">
        <h2 className="text-3xl font-bold mb-6">🎯 How It Works</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-bold mb-1">1. Search</div>
            <div className="text-sm text-gray-500">Find any animal from our 200+ collection</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-4xl mb-3">📋</div>
            <div className="font-bold mb-1">2. Browse Names</div>
            <div className="text-sm text-gray-500">Explore 9 categories of curated name ideas</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-4xl mb-3">❤️</div>
            <div className="font-bold mb-1">3. Pick & Love</div>
            <div className="text-sm text-gray-500">Choose the perfect name for your animal</div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary/5 border-t border-primary/10 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">🧙 Adding new animals is easy</h2>
          <p className="text-gray-600">
            Drop a JSON file into{" "}
            <code className="bg-white px-2 py-1 rounded text-sm font-mono">src/data/animals/</code>
            {" "}and the page auto-generates with names, FAQ, SEO, and Schema. No code changes needed.
          </p>
        </div>
      </section>
    </>
  );
}
