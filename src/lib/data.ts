import { kvGet, kvGetArray } from "@/lib/kv";

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

// Pre-built set for O(1) popular-slug lookup
const POPULAR_SLUG_SET = new Set([
  "dog", "cat", "fox", "bear", "rabbit", "hamster", "horse", "parrot",
  "turtle", "fish", "snake", "bird", "lion", "tiger", "wolf", "elephant",
  "panda", "dolphin", "penguin", "butterfly", "owl", "hedgehog",
  "guinea-pig", "ferret", "chinchilla", "frog", "gecko", "dragon",
  "unicorn", "phoenix",
]);

/**
 * Small hardcoded list of popular animals used by "related animals" grids
 * on detail pages. Replaces loadIndex() (989 items) with a tiny static array.
 */
const POPULAR_ANIMALS: AnimalIndex[] = [
  { slug: "dog", name: "Dog", icon: "🐶" },
  { slug: "cat", name: "Cat", icon: "🐱" },
  { slug: "fox", name: "Fox", icon: "🦊" },
  { slug: "bear", name: "Bear", icon: "🐻" },
  { slug: "rabbit", name: "Rabbit", icon: "🐰" },
  { slug: "hamster", name: "Hamster", icon: "🐹" },
  { slug: "horse", name: "Horse", icon: "🐴" },
  { slug: "parrot", name: "Parrot", icon: "🦜" },
  { slug: "turtle", name: "Turtle", icon: "🐢" },
  { slug: "fish", name: "Fish", icon: "🐟" },
  { slug: "snake", name: "Snake", icon: "🐍" },
  { slug: "bird", name: "Bird", icon: "🐦" },
  { slug: "lion", name: "Lion", icon: "🦁" },
  { slug: "tiger", name: "Tiger", icon: "🐯" },
  { slug: "wolf", name: "Wolf", icon: "🐺" },
  { slug: "elephant", name: "Elephant", icon: "🐘" },
  { slug: "panda", name: "Panda", icon: "🐼" },
  { slug: "dolphin", name: "Dolphin", icon: "🐬" },
  { slug: "penguin", name: "Penguin", icon: "🐧" },
  { slug: "butterfly", name: "Butterfly", icon: "🦋" },
  { slug: "owl", name: "Owl", icon: "🦉" },
  { slug: "hedgehog", name: "Hedgehog", icon: "🦔" },
  { slug: "guinea-pig", name: "Guinea Pig", icon: "🐹" },
  { slug: "ferret", name: "Ferret", icon: "🦡" },
  { slug: "chinchilla", name: "Chinchilla", icon: "🐭" },
  { slug: "frog", name: "Frog", icon: "🐸" },
  { slug: "gecko", name: "Gecko", icon: "🦎" },
  { slug: "dragon", name: "Dragon", icon: "🐲" },
  { slug: "unicorn", name: "Unicorn", icon: "🦄" },
  { slug: "phoenix", name: "Phoenix", icon: "🔥" },
];

export async function loadAnimalData(slug: string): Promise<AnimalData | null> {
  return await kvGet<AnimalData>(`animals/${slug}`);
}

export async function loadIndex(): Promise<AnimalIndex[]> {
  return await kvGetArray<AnimalIndex>("animals/index");
}

/**
 * Returns the first `count` animals, with POPULAR_SLUG_SET members
 * prioritized to the front.
 */
export async function getTopAnimals(count: number): Promise<AnimalIndex[]> {
  const all = await loadIndex();
  const popular: AnimalIndex[] = [];
  const rest: AnimalIndex[] = [];
  for (const a of all) {
    if (POPULAR_SLUG_SET.has(a.slug)) {
      popular.push(a);
    } else {
      rest.push(a);
    }
  }
  while (popular.length < count && rest.length > 0) {
    popular.push(rest.shift()!);
  }
  return popular.slice(0, count);
}

/**
 * Get a small hardcoded list of popular animals for related-animals grids.
 * Replaces loadIndex() which loads ~989 items from KV.
 */
export function getPopularAnimals(): AnimalIndex[] {
  return POPULAR_ANIMALS;
}

export async function loadPopularAnimals(): Promise<AnimalIndex[]> {
  const all = await loadIndex();
  // Use pre-built set for O(1) membership check — avoids nested .find() on 989 items
  const popular: AnimalIndex[] = [];
  for (const a of all) {
    if (POPULAR_SLUG_SET.has(a.slug)) {
      popular.push(a);
    }
  }
  // Fill remaining slots with non-popular animals (deterministic, no sort)
  for (const a of all) {
    if (popular.length >= 100 && popular.length < all.length) {
      popular.push(a);
    }
  }
  return popular;
}

export function parseNameTypeSlugFromIndex(allAnimals: AnimalIndex[], slugSegments: string[]): { animalSlug: string; nameType: NameType } | null {
  const fullPath = slugSegments.join("/");
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

export function getAllNameTypeSlugsFromIndex(allAnimals: AnimalIndex[]): string[] {
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

export async function loadCategories(): Promise<CategoryData[]> {
  return await kvGetArray<CategoryData>("categories/index");
}

export async function loadCategory(slug: string): Promise<CategoryData | null> {
  const all = await loadCategories();
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

export async function loadFactData(slug: string): Promise<FactData | null> {
  return await kvGet<FactData>(`facts/${slug}`);
}

export async function loadFactIndex(): Promise<{ slug: string; displayName: string; icon: string }[]> {
  return await kvGetArray<{ slug: string; displayName: string; icon: string }>("facts/index");
}

export interface GuideData {
  slug: string;
  title: string;
  description: string;
  category: string;
  relatedAnimals: string[];
  faq: { q: string; a: string }[];
}

export async function loadGuides(): Promise<GuideData[]> {
  return await kvGetArray<GuideData>("guides/index");
}

export async function loadGuide(slug: string): Promise<GuideData | null> {
  return await kvGet<GuideData>(`guides/${slug}`);
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  tags: string[];
}

export async function loadBlogPosts(): Promise<BlogPost[]> {
  return await kvGetArray<BlogPost>("blog/index");
}

export interface BlogContent {
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

export async function loadBlogPost(slug: string): Promise<BlogContent | null> {
  return await kvGet<BlogContent>(`blog/${slug}`);
}

export interface IdeaIndexItem {
  slug: string;
  animal?: string;
  adjective?: string;
  number?: string;
}

export async function loadAllIdeas(): Promise<IdeaIndexItem[]> {
  return await kvGetArray<IdeaIndexItem>("ideas/index");
}

// ---------------------------------------------------------------------------
// Direct slug parser — O(1) per request, replaces parseNameTypeSlugFromIndex()
// which iterated all 989 animals on every request.
// ---------------------------------------------------------------------------

/**
 * Parse a URL slug directly into { animalSlug, nameType } without loading
 * the full animals/index from KV. Replaces the O(n) scan of 989 animals.
 *
 * URL patterns handled:
 *   male-dog-names       → type=male, animal=dog
 *   cat-names            → type=names, animal=cat
 *   cute-red-panda-names → type=cute, animal=red-panda
 */
export function parseSlugDirectly(slugSegments: string[]): { animalSlug: string; nameType: NameType } | null {
  const raw = slugSegments.join("-");
  // Remove trailing -names if present
  const withoutSuffix = raw.endsWith("-names") ? raw.slice(0, -6) : raw;

  // Try each name type prefix first (e.g., male-dog → type=male, animal=dog)
  for (const nt of NAME_TYPES) {
    if (nt.key === "names") continue; // handled below
    const prefix = `${nt.key}-`;
    if (withoutSuffix.startsWith(prefix)) {
      const animalSlug = withoutSuffix.slice(prefix.length);
      if (animalSlug) return { animalSlug, nameType: nt };
    }
  }

  // No type prefix — the whole thing is the animal slug, type=names
  if (withoutSuffix) {
    return { animalSlug: withoutSuffix, nameType: NAME_TYPES[0] }; // names
  }

  return null;
}

/**
 * Fast slug-to-animal verification: check if an animal exists by direct KV lookup.
 * Much cheaper than loadIndex() + .find().
 */
export async function verifyAnimalSlugExists(slug: string): Promise<boolean> {
  const data = await kvGet<{ slug: string }>(`animals/${slug}`);
  return data !== null;
}
