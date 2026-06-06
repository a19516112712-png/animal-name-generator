#!/usr/bin/env node

/**
 * generate-daily-pins.js
 * Generates today-pins.csv with 30 unique Pinterest pin ideas.
 * Output: data/daily-pins/today-pins.csv
 *
 * Usage: node scripts/generate-daily-pins.js
 */

const fs = require("fs");
const path = require("path");

// ── Configuration ──────────────────────────────────────────
const ANIMALS = ["Dog", "Cat", "Rabbit", "Horse", "Bird", "Hamster"];
const ROWS_PER_RUN = 30;
const OUTPUT_DIR = path.join(__dirname, "..", "data", "daily-pins");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "today-pins.csv");

const NUMBERS = [50, 75, 100, 120, 150, 175, 200, 250, 300];

const ADJECTIVES = [
  "Cute", "Funny", "Unique", "Cool", "Beautiful", "Popular",
  "Adorable", "Clever", "Sweet", "Charming", "Lovable", "Playful",
  "Majestic", "Elegant", "Quirky", "Creative", "Famous", "Trendy",
  "Classic", "Modern", "Exotic", "Royal", "Magical", "Wild",
  "Gentle", "Brave", "Happy", "Fluffy", "Tiny", "Mighty",
];

const SUBTITLES = [
  "Cute & Adorable Ideas",
  "Unique & Creative Ideas",
  "Loved By Pet Owners",
  "Funny Names For Every Pet",
  "Top Picks For New Owners",
  "Perfect For Your New Friend",
  "Trending Name Ideas 2025",
  "Handpicked Just For You",
  "Names That Make You Smile",
  "Best Collection Online",
  "Veterinarian Approved Picks",
  "Names Your Pet Will Love",
  "Curated For Maximum Cuteness",
  "The Ultimate Name List",
  "Inspiration For Every Pet",
];

// ── Helpers ────────────────────────────────────────────────

/** Pick `n` random distinct items from array */
function pick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/** Build a title string */
function buildTitle(animal) {
  const num = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  return `${num} ${adj} ${animal} Names`;
}

/** Escape CSV field if needed */
function csvEscape(field) {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

// ── Main ───────────────────────────────────────────────────

function generate() {
  const used = new Set();
  const rows = [];

  // Distribute ~5 per animal for 6 animals = 30
  const perAnimal = Math.floor(ROWS_PER_RUN / ANIMALS.length); // 5
  const remainder = ROWS_PER_RUN % ANIMALS.length;              // 0

  const counts = {};
  ANIMALS.forEach((a) => (counts[a] = perAnimal));
  // Add remainder to first few animals if needed
  for (let i = 0; i < remainder; i++) {
    counts[ANIMALS[i]]++;
  }

  // Build unique titles
  let attempts = 0;
  const maxAttempts = 500;

  for (const animal of ANIMALS) {
    let needed = counts[animal];
    while (needed > 0 && attempts < maxAttempts) {
      const title = buildTitle(animal);
      if (!used.has(title)) {
        used.add(title);
        const subtitle = SUBTITLES[Math.floor(Math.random() * SUBTITLES.length)];
        rows.push({ animal, title, subtitle });
        needed--;
      }
      attempts++;
    }
  }

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Write CSV
  const header = "animal,title,subtitle";
  const csvLines = [header];
  for (const row of rows) {
    csvLines.push(
      `${csvEscape(row.animal)},${csvEscape(row.title)},${csvEscape(row.subtitle)}`
    );
  }

  fs.writeFileSync(OUTPUT_FILE, csvLines.join("\n") + "\n");

  console.log(`✅ Generated ${rows.length} pins → ${OUTPUT_FILE}`);
  console.log(`   Animals: ${[...new Set(rows.map((r) => r.animal))].join(", ")}`);
  console.log(`   Sample titles:`);
  for (const r of rows.slice(0, 5)) {
    console.log(`     ${r.title}  →  ${r.subtitle}`);
  }
  if (rows.length > 5) console.log(`     ... and ${rows.length - 5} more`);
}

generate();
