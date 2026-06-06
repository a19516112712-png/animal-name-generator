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
// Blog post pages (MUST be before sitemap string construction)
const blogDir = path.join(__dirname, "..", "src", "data", "blog");
try {
  const blogPosts = JSON.parse(fs.readFileSync(path.join(blogDir, "index.json"), "utf-8"));
  for (const p of blogPosts) {
    urls.push(urlEl(`${BASE}/blog/${p.slug}/`, "weekly", "0.7"));
  }
} catch (_) {}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join("\n")}
</urlset>
`;

const publicDir = path.join(__dirname, "..", "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

console.log(`✅ Generated sitemap.xml with ${urls.length} URLs`);
