import fs from "fs";
import path from "path";

export interface AnimalData {
  slug: string;
  displayName: string;
  icon: string;
  description: string;
  metaDescription: string;
  maleNames: string[];
  femaleNames: string[];
  cuteNames: string[];
  funnyNames: string[];
  fantasyNames: string[];
  uniqueNames: string[];
  coolNames: string[];
  babyNames: string[];
  faq: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
  namingGuide: string[];
}

export interface AnimalIndex {
  slug: string;
  name: string;
  icon: string;
}

export interface NameType {
  key: string;
  label: string;
  emoji: string;
  seoTitleSuffix: string;
  seoDescPrefix: string;
  field: keyof AnimalData;
}

export const NAME_TYPES: NameType[] = [
  { key: "names", label: "Names", emoji: "📛", seoTitleSuffix: "Name Generator", seoDescPrefix: "Discover the perfect", field: "maleNames" },
  { key: "male", label: "Male Names", emoji: "♂️", seoTitleSuffix: "Male Name Generator", seoDescPrefix: "Strong and bold", field: "maleNames" },
  { key: "female", label: "Female Names", emoji: "♀️", seoTitleSuffix: "Female Name Generator", seoDescPrefix: "Beautiful and graceful", field: "femaleNames" },
  { key: "cute", label: "Cute Names", emoji: "💕", seoTitleSuffix: "Cute Name Generator", seoDescPrefix: "Adorable and sweet", field: "cuteNames" },
  { key: "funny", label: "Funny Names", emoji: "😂", seoTitleSuffix: "Funny Name Generator", seoDescPrefix: "Hilarious and witty", field: "funnyNames" },
  { key: "fantasy", label: "Fantasy Names", emoji: "🧙", seoTitleSuffix: "Fantasy Name Generator", seoDescPrefix: "Magical and mythical", field: "fantasyNames" },
  { key: "unique", label: "Unique Names", emoji: "🌟", seoTitleSuffix: "Unique Name Generator", seoDescPrefix: "One-of-a-kind and rare", field: "uniqueNames" },
  { key: "cool", label: "Cool Names", emoji: "😎", seoTitleSuffix: "Cool Name Generator", seoDescPrefix: "Stylish and trendy", field: "coolNames" },
  { key: "baby", label: "Baby Names", emoji: "🍼", seoTitleSuffix: "Baby Name Generator", seoDescPrefix: "Tiny and precious", field: "babyNames" },
];

const DATA_DIR = path.join(process.cwd(), "src/data/animals");

export function loadAnimalData(slug: string): AnimalData | null {
  try {
    const fp = path.join(DATA_DIR, `${slug}.json`);
    return JSON.parse(fs.readFileSync(fp, "utf-8")) as AnimalData;
  } catch {
    return null;
  }
}

export function loadIndex(): AnimalIndex[] {
  const fp = path.join(DATA_DIR, "index.json");
  return JSON.parse(fs.readFileSync(fp, "utf-8")) as AnimalIndex[];
}

export function loadPopularAnimals(): AnimalIndex[] {
  const all = loadIndex();
  const popularSlugs = [
    "dog", "cat", "fox", "bear", "rabbit", "hamster", "horse", "parrot",
    "turtle", "fish", "snake", "bird", "lion", "tiger", "wolf", "elephant",
    "panda", "dolphin", "penguin", "butterfly", "owl", "hedgehog",
    "guinea-pig", "ferret", "chinchilla", "frog", "gecko", "dragon",
    "unicorn", "phoenix",
  ];
  const popular = popularSlugs.map((s) => all.find((a) => a.slug === s)).filter(Boolean) as AnimalIndex[];
  for (const a of all) {
    if (!popular.find((p) => p.slug === a.slug)) popular.push(a);
  }
  return popular;
}

export function parseNameTypeSlug(slugSegments: string[]): { animalSlug: string; nameType: NameType } | null {
  const fullPath = slugSegments.join("/");
  const allAnimals = loadIndex();
  
  for (const animal of allAnimals) {
    for (const nt of NAME_TYPES) {
      const pattern = nt.key === "names"
        ? `${animal.slug}-names`
        : `${nt.key}-${animal.slug}-names`;
      if (fullPath === pattern) {
        return { animalSlug: animal.slug, nameType: nt };
      }
    }
  }
  return null;
}

export function getAllNameTypeSlugs(): string[] {
  const allAnimals = loadIndex();
  const slugs: string[] = [];
  for (const animal of allAnimals) {
    for (const nt of NAME_TYPES) {
      const s = nt.key === "names"
        ? `${animal.slug}-names`
        : `${nt.key}-${animal.slug}-names`;
      slugs.push(s);
    }
  }
  return slugs;
}
