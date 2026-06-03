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

export const metadata = {
  title: "All Animals - Animal Name Generator | 200+ Animals",
  description:
    "Browse all 200+ animals in our name generator. Find male, female, cute, funny, fantasy, unique, cool, and baby names for every animal.",
};

export default function AnimalsPage() {
  const animals = loadIndex();

  return (
    <>
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            🐾 All {animals.length} Animals
          </h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">
            Browse our complete collection. Click any animal to discover 9 categories of names.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animals.map((animal) => (
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
        <div className="text-center mt-10">
          <Link
            href="/"
            className="text-primary font-semibold hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
