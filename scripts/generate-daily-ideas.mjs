#!/usr/bin/env node
/**
 * Daily Ideas Page Generator
 *
 * Generates 30 new SEO Ideas pages (route: /ideas/[slug]).
 * Each slug is a self-contained URL that the existing 
 * src/app/ideas/[slug]/page.tsx renders dynamically.
 *
 * Slug format: {number}-{adjective}-{animal}-names
 * Example: 120-fluffy-bunny-names
 *
 * Usage: node scripts/generate-daily-ideas.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// === DATA LOADING ===

function loadJSON(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), "utf-8"));
}

function saveJSON(relPath, data) {
  const fp = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}

const animals = loadJSON("src/data/animals/index.json");
const existingIdeas = loadJSON("src/data/ideas/index.json");
const existingSlugs = new Set(existingIdeas.map((i) => i.slug));

// === SLUG GENERATION ===

// Adjectives categorized for SEO diversity
const adjectivePool = [
  // Cute / adorable
  "adorable", "sweet", "cute", "lovable", "precious", "fluffy", "cuddly",
  // Cool / stylish
  "cool", "stylish", "trendy", "modern", "chic", "elegant", "sleek",
  // Unique / creative
  "unique", "creative", "clever", "quirky", "unusual", "rare", "exotic",
  // Fun / playful
  "funny", "playful", "cheerful", "happy", "bubbly", "spunky", "silly",
  // Bold / strong
  "brave", "bold", "mighty", "daring", "fierce", "strong", "powerful",
  // Beautiful / majestic
  "beautiful", "gorgeous", "majestic", "stunning", "lovely", "charming", "graceful",
  // Classic / timeless
  "classic", "timeless", "traditional", "popular", "famous", "beloved", "iconic",
  // Wild / natural
  "wild", "natural", "earthy", "rustic", "organic", "free-spirited", "untamed",
  // Gentle / calm
  "gentle", "calm", "peaceful", "serene", "tender", "mellow", "soft",
  // Royal / noble
  "royal", "noble", "regal", "imperial", "distinguished", "dignified", "grand",
  // Sparkling / bright
  "sparkling", "bright", "radiant", "dazzling", "shining", "vibrant", "glowing",
  // Magical / mystical
  "magical", "mystical", "enchanted", "fantastical", "mythical", "legendary", "epic",
];

const numberPool = [
  "100", "120", "150", "175", "200", "250", "300", "350", "400", "500",
];

function randItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateIdeas(count) {
  const newIdeas = [];
  const shuffledAnimals = shuffle(animals);

  for (let i = 0; i < count && shuffledAnimals.length > 0; i++) {
    // Cycle through animals
    const animal = shuffledAnimals[i % shuffledAnimals.length];
    const animalSlug = animal.slug;

    let slug;
    let attempts = 0;

    do {
      const adj = randItem(adjectivePool);
      const num = randItem(numberPool);
      slug = `${num}-${adj}-${animalSlug}-names`;
      attempts++;
    } while (existingSlugs.has(slug) && attempts < 30);

    if (existingSlugs.has(slug)) {
      // Skip if we can't find a unique slug
      continue;
    }

    existingSlugs.add(slug);
    newIdeas.push({ slug });
  }

  return newIdeas;
}

// === MAIN ===

function main() {
  console.log("💡 Daily Ideas Generator");
  console.log(`📅 Date: ${new Date().toISOString().split("T")[0]}`);
  console.log(`📊 Existing ideas: ${existingIdeas.length}`);
  console.log("");

  // Generate 30 new ideas
  const newIdeas = generateIdeas(30);
  console.log(`✨ Generated ${newIdeas.length} new ideas:`);

  newIdeas.forEach((idea, i) => {
    console.log(`  ${i + 1}. /ideas/${idea.slug}/`);
  });

  if (newIdeas.length < 30) {
    console.log(`\n⚠️  Only generated ${newIdeas.length}/30 ideas (some combinations already existed).`);
  }

  // Update ideas index
  const updatedIndex = [...existingIdeas, ...newIdeas];
  saveJSON("src/data/ideas/index.json", updatedIndex);
  console.log(`\n📋 Ideas index updated: ${updatedIndex.length} total`);

  // Update sitemap
  console.log("🗺️  Regenerating sitemap...");
  try {
    const result = execSync("node scripts/generate-sitemap.mjs", {
      cwd: ROOT,
      stdio: "pipe",
      encoding: "utf-8",
    });
    console.log(result.trim());
  } catch (e) {
    console.error("Sitemap generation failed:", e.message);
  }

  console.log("\n✅ Daily ideas generation complete!");
  console.log(`📈 New ideas: ${newIdeas.length}`);
  console.log(`📈 Total ideas: ${updatedIndex.length}`);

  return { newIdeas, totalIdeas: updatedIndex.length };
}

main();
