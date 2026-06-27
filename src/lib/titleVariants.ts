/**
 * Title & Intro De-Templatization Utility
 *
 * Eliminates AI programmatic patterns by providing 8+ distinct title structures
 * and 5 unique intro paragraph templates, seeded deterministically from the
 * animal slug to prevent hydration mismatches while ensuring variety across pages.
 */

/** Deterministic hash from a string */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Pick from an array deterministically based on a seed */
function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/* ------------------------------------------------------------------ */
/*  10 completely different H1 / Title semantic structures             */
/* ------------------------------------------------------------------ */
type TitleFn = (animal: string, icon: string, category?: string) => string;

const TITLE_VARIANTS: TitleFn[] = [
  (a, i) => `The Complete Guide to Naming Your ${a} — 160+ Handpicked Ideas ${i}`,
  (a, i) => `${a} Names: 160+ Best, Cute, Unique & Funny Ideas ${i}`,
  (a, i) => `What to Name Your ${a}? 160+ Names Organized by Style & Personality ${i}`,
  (a, i) => `Best ${a} Name Ideas for Every Personality (160+ Picks) ${i}`,
  (a, i) => `Looking for ${a} Names? Here Are 160+ That Actually Work ${i}`,
  (a, i) => `From Classic to Creative: 160+ ${a} Names You'll Love ${i}`,
  (a, i) => `The Ultimate ${a} Name Collection: Male, Female, Cute & More ${i}`,
  (a, i) => `Name Your ${a} with Confidence: 160+ Curated Name Ideas ${i}`,
  (a, i) => `${a} Name Inspiration: 160+ Names Sorted by Vibe & Style ${i}`,
  (a, i) => `Need a Name for Your ${a}? Start Here — 160+ Ideas ${i}`,
];

const CATEGORY_TITLE_VARIANTS: TitleFn[] = [
  (a, i, cat) => `${cat} ${a} Names: Top Picks That Stand Out ${i}`,
  (a, i, cat) => `Best ${cat} Names for Your ${a} — Handpicked Collection ${i}`,
  (a, i, cat) => `${cat} ${a} Name Ideas That Are Anything But Boring ${i}`,
  (a, i, cat) => `Our Favorite ${cat} Names for ${a}s (All Free) ${i}`,
  (a, i, cat) => `${cat} Names for ${a}s: A Curated List You Can Trust ${i}`,
  (a, i, cat) => `Looking for ${cat} ${a} Names? Here's Our Best Collection ${i}`,
  (a, i, cat) => `Top ${cat} ${a} Names Worth Considering ${i}`,
  (a, i, cat) => `${cat} ${a} Name Generator: Find the Perfect Fit ${i}`,
];

/* ------------------------------------------------------------------ */
/*  5 unique intro paragraph templates                                 */
/* ------------------------------------------------------------------ */
type IntroFn = (animal: string, icon: string, category?: string) => string;

const INTRO_VARIANTS: IntroFn[] = [
  (a, _i, c) => {
    const label = c ? `${c.toLowerCase()} ${a.toLowerCase()}` : a.toLowerCase();
    return `Finding the right name for your ${a.toLowerCase()} can feel surprisingly hard. The name has to fit their personality, sound right when you call it, and — ideally — make you smile every time. We've put together this collection of ${label} names to save you the scrolling, guessing, and second-guessing. Every name below was chosen because it actually works — not because it filled a slot on a list.`;
  },
  (a, _i, c) => {
    const label = c ? `${c.toLowerCase()} ${a.toLowerCase()}` : a.toLowerCase();
    return `We've reviewed hundreds of ${a.toLowerCase()} names from pet owners, breeders, shelters, and naming communities — and narrowed them down to the ones people genuinely love and use. This isn't a random dump of words. It's a curated list of ${label} names organized by style so you can find what fits your ${a.toLowerCase()}'s personality without endless scrolling.`;
  },
  (a, _i, c) => {
    const label = c ? `${c.toLowerCase()} ${a.toLowerCase()}` : a.toLowerCase();
    return `So you're naming a ${a.toLowerCase()}! Whether this is your first ${a.toLowerCase()} or your fifth, the right name makes everything better — vet visits, training sessions, those quiet moments at home. We've organized our ${label} names into clear categories so you can browse by vibe instead of reading one massive, overwhelming list. Pick what resonates, skip what doesn't. No pressure, just options.`;
  },
  (a, _i, c) => {
    const label = c ? `${c.toLowerCase()} ${a.toLowerCase()}` : a.toLowerCase();
    return `A great ${a.toLowerCase()} name does more than identify your pet — it starts conversations, reflects personality, and strengthens your bond. Our ${label} name collection gives you 160+ options across eight distinct styles: male, female, cute, funny, unique, cool, fantasy, and baby. Scroll through, try a few out loud, and trust your instinct. The right name is in here somewhere.`;
  },
  (a, _i, c) => {
    const label = c ? `${c.toLowerCase()} ${a.toLowerCase()}` : a.toLowerCase();
    return `Every ${a.toLowerCase()} name tells a small story. "Luna" might be the name of your late-night companion. "Thor" might reflect your ${a.toLowerCase()}'s outsized personality in a compact body. "Mochi" might capture their soft, sweet nature. We've collected ${label} names from real owners, creative communities, and cultural traditions — names with personality, not just words on a page. Browse the categories below and find the name that tells your story.`;
  },
];

/* ------------------------------------------------------------------ */
/*  5 unique meta description variants (1-arg signatures)             */
/* ------------------------------------------------------------------ */
type MetaDescFn = (animal: string) => string;

const META_DESC_VARIANTS: MetaDescFn[] = [
  (a) => `Discover the perfect name for your ${a.toLowerCase()} — 160+ handpicked ideas across male, female, cute, funny, unique, and more. All free, all curated.`,
  (a) => `Looking for a great ${a.toLowerCase()} name? Browse 160+ original name ideas sorted by style. Find the one that fits your ${a.toLowerCase()}'s personality.`,
  (a) => `From cute to cool, classic to creative — find the ideal ${a.toLowerCase()} name in our curated collection. 160+ names organized by vibe, not just alphabet.`,
  (a) => `Name your ${a.toLowerCase()} with confidence. 160+ original name ideas hand-selected from real pet owner favorites — male, female, cute, funny, unique names and more.`,
  (a) => `Need the perfect name for your ${a.toLowerCase()}? Our curated list of 160+ names covers every style — from traditional to unexpected. Find the one that clicks.`,
];

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */

export function getPageTitle(animalSlug: string, displayName: string, icon: string, categoryLabel?: string): string {
  const seed = hashStr(animalSlug);
  if (categoryLabel) {
    return pick(CATEGORY_TITLE_VARIANTS, seed)(displayName, icon, categoryLabel);
  }
  return pick(TITLE_VARIANTS, seed)(displayName, icon);
}

export function getPageIntro(animalSlug: string, displayName: string, icon: string, categoryLabel?: string): string {
  const seed = hashStr(animalSlug + "_intro");
  return pick(INTRO_VARIANTS, seed)(displayName, icon, categoryLabel);
}

export function getMetaDescription(animalSlug: string, displayName: string): string {
  return pick(META_DESC_VARIANTS, hashStr(animalSlug + "_meta"))(displayName);
}

export { hashStr, pick };
