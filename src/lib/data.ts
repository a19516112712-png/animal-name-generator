import { BUNDLED_DATA } from "@/data/bundled";

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
  pinterestTitle?: string;
  pinterestDescription?: string;
  pinterestKeywords?: string[];
  pinterestPins?: { title: string; description: string }[];
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

function slugToKey(slug: string): string {
  return `animals_${slug}`;
}

export function loadAnimalData(slug: string): AnimalData | null {
  const key = slugToKey(slug);
  const data = (BUNDLED_DATA as Record<string, unknown>)[key];
  if (!data) return null;
  return data as AnimalData;
}

export function loadIndex(): AnimalIndex[] {
  const data = (BUNDLED_DATA as Record<string, unknown>)["animals_index"];
  if (!data) return [];
  return data as AnimalIndex[];
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

export interface CategoryData {
  slug: string;
  name: string;
  icon: string;
  description: string;
  animals: string[];
  seoTitle: string;
  seoDescription: string;
}

export function loadCategories(): CategoryData[] {
  const data = (BUNDLED_DATA as Record<string, unknown>)["categories_index"];
  if (!data) return [];
  return data as CategoryData[];
}

export function loadCategory(slug: string): CategoryData | null {
  const all = loadCategories();
  return all.find(c => c.slug === slug) || null;
}

export interface FactData {
  slug: string;
  displayName: string;
  icon: string;
  scientificName: string;
  classification: { kingdom: string; phylum: string; class: string; order: string; family: string };
  habitat: string;
  diet: string;
  lifespan: string;
  size: string;
  conservationStatus: string;
  funFacts: string[];
  seoTitle: string;
  seoDescription: string;
}

function factSlugToKey(slug: string): string {
  return `facts_${slug}`;
}

export function loadFactData(slug: string): FactData | null {
  const key = factSlugToKey(slug);
  const data = (BUNDLED_DATA as Record<string, unknown>)[key];
  if (!data) return null;
  return data as FactData;
}

export function loadFactIndex(): { slug: string; displayName: string; icon: string }[] {
  const data = (BUNDLED_DATA as Record<string, unknown>)["facts_index"];
  if (!data) return [];
  return data as { slug: string; displayName: string; icon: string }[];
}

export interface GuideData {
  slug: string;
  title: string;
  description: string;
  category: string;
  relatedAnimals: string[];
  faq: { q: string; a: string }[];
}

export function loadGuides(): GuideData[] {
  const data = (BUNDLED_DATA as Record<string, unknown>)["guides_index"];
  if (!data) return [];
  return data as GuideData[];
}

export function loadGuide(slug: string): GuideData | null {
  const key = `guides_${slug}`;
  const data = (BUNDLED_DATA as Record<string, unknown>)[key];
  if (!data) return null;
  return data as GuideData;
}
