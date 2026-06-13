// Build-time sitemap generator - writes directly to public/sitemap.xml
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "https://bestanimalnames.com";
const TODAY = new Date().toISOString().split("T")[0];

// Load animal index
const dataDir = path.join(__dirname, "..", "src", "data", "animals");
const animals = JSON.parse(
  fs.readFileSync(path.join(dataDir, "index.json"), "utf-8")
);

function esc(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEl(url, changefreq, priority) {
  return `  <url>
    <loc>${esc(url)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const urls = [];

// Static pages
urls.push(urlEl(BASE, "daily", "1.0"));
urls.push(urlEl(`${BASE}/animals/`, "weekly", "0.8"));
urls.push(urlEl(`${BASE}/blog/`, "weekly", "0.7"));
urls.push(urlEl(`${BASE}/about/`, "monthly", "0.6"));
urls.push(urlEl(`${BASE}/contact/`, "monthly", "0.6"));
urls.push(urlEl(`${BASE}/privacy-policy/`, "monthly", "0.5"));
urls.push(urlEl(`${BASE}/terms/`, "monthly", "0.5"));
urls.push(urlEl(`${BASE}/disclaimer/`, "monthly", "0.5"));
urls.push(urlEl(`${BASE}/cookie-policy/`, "monthly", "0.5"));

// Animal pages
for (const a of animals) {
  urls.push(urlEl(`${BASE}/animal/${a.slug}/`, "weekly", "0.9"));
}

// Name type pages
const nameTypeKeys = [
  "names", "male", "female", "cute", "funny",
  "fantasy", "unique", "cool", "baby",
];

for (const a of animals) {
  for (const key of nameTypeKeys) {
    const s = key === "names"
      ? `${a.slug}-names`
      : `${key}-${a.slug}-names`;
    urls.push(urlEl(`${BASE}/${s}/`, "weekly", "0.7"));
  }
}


// Category pages
const catDir = path.join(__dirname, "..", "src", "data", "categories");
try {
  const categories = JSON.parse(fs.readFileSync(path.join(catDir, "index.json"), "utf-8"));
  for (const c of categories) {
    urls.push(urlEl(`${BASE}/category/${c.slug}/`, "weekly", "0.8"));
    for (const key of nameTypeKeys) {
      urls.push(urlEl(`${BASE}/category/${c.slug}/${key}/`, "weekly", "0.7"));
    }
  }
} catch (_) {}


// Guide pages
const guideDir = path.join(__dirname, "..", "src", "data", "guides");
try {
  const guides = JSON.parse(fs.readFileSync(path.join(guideDir, "index.json"), "utf-8"));
  for (const g of guides) {
    urls.push(urlEl(`${BASE}/guide/${g.slug}/`, "weekly", "0.8"));
  }
} catch (_) {}
// Animal Facts pages
for (const a of animals) {
  urls.push(urlEl(`${BASE}/animal/${a.slug}/facts/`, "weekly", "0.8"));
}



// Blog post directory
const blogDir = path.join(__dirname, "..", "src", "data", "blog");

// Ideas pages
const ideasDir = path.join(__dirname, "..", "src", "data", "ideas");
let ideasUrls = [];
try {
  const ideas = JSON.parse(fs.readFileSync(path.join(ideasDir, "index.json"), "utf-8"));
  for (const idea of ideas) {
    const url = urlEl(`${BASE}/ideas/${idea.slug}/`, "weekly", "0.6");
    urls.push(url);
    ideasUrls.push(url);
  }
} catch (_) {}

// Blog posts
let blogUrls = [];
try {
  const blogPosts = JSON.parse(fs.readFileSync(path.join(blogDir, "index.json"), "utf-8"));
  for (const p of blogPosts) {
    const url = urlEl(`${BASE}/blog/${p.slug}/`, "weekly", "0.7");
    urls.push(url);
    blogUrls.push(url);
  }
} catch (_) {}

// Startswith URLs
const startswithAnimals = [
  "dog", "cat", "rabbit", "hamster", "horse", "bird", "parrot", "fish",
  "turtle", "snake", "lizard", "frog", "guinea-pig", "ferret", "chinchilla",
  "hedgehog", "mouse", "pig", "goat", "sheep", "cow", "chicken", "duck",
  "fox", "wolf", "bear", "lion", "tiger", "elephant", "panda", "monkey",
  "dolphin", "penguin", "owl", "eagle", "butterfly", "dragon", "unicorn",
  "phoenix", "deer", "raccoon", "squirrel", "otter", "koala", "zebra",
  "giraffe", "cheetah", "leopard", "shark", "whale", "octopus", "seal",
  "peacock", "flamingo", "swan", "parakeet", "cockatiel", "goldfish",
  "spider", "bee", "ant", "ladybug", "crab", "jellyfish", "starfish",
  "llama", "meerkat", "sloth", "hippo", "rhino", "gorilla", "crocodile",
  "kangaroo", "polar-bear", "walrus", "seahorse", "clownfish",
  "betta-fish", "canary", "gecko", "iguana", "chameleon", "axolotl",
  "capybara", "red-panda", "snow-leopard", "beluga", "narwhal", "manatee",
  "platypus", "wombat", "tasmanian-devil", "quokka", "fennec-fox",
  "serval", "ocelot", "caracal", "margay", "jaguar", "cougar",
  "bobcat", "lynx",
];
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let startswithUrls = [];
for (const animal of startswithAnimals) {
  if (!animals.find(a => a.slug === animal)) continue;
  for (const letter of letters) {
    const url = urlEl(`${BASE}/startswith/${letter}/${animal}/`, "weekly", "0.6");
    urls.push(url);
    startswithUrls.push(url);
  }
}

// Length URLs
const lengthAnimals = startswithAnimals;
const validLengths = [3, 4, 5, 6, 7, 8, 9, 10];
let lengthUrls = [];
for (const animal of lengthAnimals) {
  if (!animals.find(a => a.slug === animal)) continue;
  for (const len of validLengths) {
    const url = urlEl(`${BASE}/length/${len}/${animal}/`, "weekly", "0.6");
    urls.push(url);
    lengthUrls.push(url);
  }
}

// === Write all sitemaps ===
const publicDir = path.join(__dirname, "..", "public");
fs.mkdirSync(publicDir, { recursive: true });

// Build sitemap XML (after all URLs collected)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join("\n")}
</urlset>`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

// Sub-sitemaps
if (blogUrls.length > 0) {
  fs.writeFileSync(path.join(publicDir, "blog-sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${blogUrls.join("\n")}\n</urlset>`);
}
if (ideasUrls.length > 0) {
  fs.writeFileSync(path.join(publicDir, "ideas-sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${ideasUrls.join("\n")}\n</urlset>`);
}
if (startswithUrls.length > 0) {
  fs.writeFileSync(path.join(publicDir, "startswith-sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${startswithUrls.join("\n")}\n</urlset>`);
}
if (lengthUrls.length > 0) {
  fs.writeFileSync(path.join(publicDir, "length-sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lengthUrls.join("\n")}\n</urlset>`);
}

console.log(`✅ Generated sitemap.xml with ${urls.length} URLs`);
console.log(`   blog-sitemap.xml: ${blogUrls.length} URLs`);
console.log(`   ideas-sitemap.xml: ${ideasUrls.length} URLs`);
console.log(`   startswith-sitemap.xml: ${startswithUrls.length} URLs`);
console.log(`   length-sitemap.xml: ${lengthUrls.length} URLs`);
