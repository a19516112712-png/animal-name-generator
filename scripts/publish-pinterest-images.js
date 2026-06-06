#!/usr/bin/env node

/**
 * publish-pinterest-images.js
 *
 * Scans assets/pinterest/inbox/YYYY-MM-DD/ for PNG files,
 * copies them to public/pins/, and generates a Pinterest-ready CSV
 * with public media URLs and unique landing page links.
 *
 * Usage:
 *   node scripts/publish-pinterest-images.js                # today's date
 *   node scripts/publish-pinterest-images.js 2026-6-6       # specific date
 */

const fs = require("fs");
const path = require("path");

// ── Resolve date ───────────────────────────────────────────
const dateArg = process.argv[2];
const today = new Date();
const ds = dateArg || [
  today.getFullYear(),
  String(today.getMonth() + 1),
  String(today.getDate()),
].join("-");

// ── Paths ──────────────────────────────────────────────────
const ROOT = path.join(__dirname, "..");
const INBOX_DIR = path.join(ROOT, "assets", "pinterest", "inbox", ds);
const PINS_DIR = path.join(ROOT, "public", "pins");
const DATA_DIR = path.join(ROOT, "data", "pinterest");
const CSV_PATH = path.join(DATA_DIR, "pinterest-upload.csv");

const BASE_URL = "https://bestanimalnames.com";

// ── Board mapping ──────────────────────────────────────────
const BOARDS = {
  dog:     "Dog Names",
  cat:     "Cat Names",
  rabbit:  "Rabbit Names",
  horse:   "Horse Names",
  bird:    "Bird Names",
  hamster: "Hamster Names",
};

const DEFAULT_BOARD = "Pet Names";

// ── Helpers ────────────────────────────────────────────────
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function csvEscape(field) {
  const s = String(field);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function generateDescription(title, animal) {
  const templates = [
    `Discover ${title.toLowerCase()} for your ${animal}. Browse our curated collection of unique, cute, and creative ideas — all 100% free.`,
    `Looking for ${title.toLowerCase()}? Find hundreds of handpicked ${animal} names perfect for puppies, adults, males, and females.`,
    `${title} for every ${animal} lover. From funny to elegant, explore our complete name collection with 989+ animal categories.`,
    `Find the best ${title.toLowerCase()}. Browse unique, popular, and creative ${animal} name ideas for your new pet — free and instant.`,
    `${title} — handpicked and curated for ${animal} owners. Discover cute, funny, unique, and trending names for every ${animal}.`,
  ];
  const idx = hashStr(title) % templates.length;
  return templates[idx];
}

function parseFilename(filename) {
  // "100-creative-cat-names.png" → { slug: "100-creative-cat-names", title, animal }
  const raw = filename.replace(/\.png$/i, "");
  const name = raw.replace(/-names$/, "");
  const parts = name.split("-");
  if (parts.length < 3) {
    const t = name.replace(/-/g, " ");
    return { slug: raw, title: t, animal: "" };
  }
  return {
    slug: raw,
    num:    parts[0],
    adj:    parts.slice(1, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    animal: parts[parts.length - 1].toLowerCase(),
    title:  parts[0] + " " + parts.slice(1, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " " + parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1) + " Names",
  };
}

// ── Main ───────────────────────────────────────────────────
console.log(`📂 Scanning: ${INBOX_DIR}`);

if (!fs.existsSync(INBOX_DIR)) {
  console.error(`❌ Inbox directory not found: ${INBOX_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(INBOX_DIR).filter(f => /\.png$/i.test(f)).sort();

if (files.length === 0) {
  console.error(`❌ No PNG files found in ${INBOX_DIR}`);
  process.exit(1);
}

console.log(`   Found ${files.length} PNG files`);

// Ensure target dirs exist
fs.mkdirSync(PINS_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

// Process each file
const rows = [];
let copied = 0;
let failed = 0;

for (const filename of files) {
  const src = path.join(INBOX_DIR, filename);
  const dst = path.join(PINS_DIR, filename);

  // Copy file
  try {
    fs.copyFileSync(src, dst);
    copied++;
  } catch (err) {
    console.error(`   ⚠️  Failed to copy ${filename}: ${err.message}`);
    failed++;
    continue;
  }

  // Parse metadata
  const { slug, title, animal } = parseFilename(filename);
  const board = BOARDS[animal] || DEFAULT_BOARD;
  const description = generateDescription(title, animal);
  const mediaUrl = `${BASE_URL}/pins/${filename}`;
  // Unique landing page link per pin
  const link = `${BASE_URL}/ideas/${slug}/`;

  // Validate URL format
  if (!mediaUrl.startsWith(BASE_URL) || !mediaUrl.endsWith(".png")) {
    console.error(`   ❌ Invalid media URL: ${mediaUrl}`);
    failed++;
    continue;
  }
  if (!link.startsWith(BASE_URL + "/ideas/")) {
    console.error(`   ❌ Invalid link: ${link}`);
    failed++;
    continue;
  }

  rows.push({
    title:       title,
    media_url:   mediaUrl,
    board:       board,
    description: description,
    link:        link,
  });
}

// Write CSV — field order: Title, Media URL, Pinterest board, Description, Link
const header = "Title,Media URL,Pinterest board,Description,Link";
const csvLines = [header];
for (const row of rows) {
  csvLines.push(
    `${csvEscape(row.title)},${csvEscape(row.media_url)},${csvEscape(row.board)},${csvEscape(row.description)},${csvEscape(row.link)}`
  );
}
fs.writeFileSync(CSV_PATH, csvLines.join("\n") + "\n");

// ── Validation ─────────────────────────────────────────────
console.log(`\n📊 Results:`);
console.log(`   Copied:  ${copied} files → public/pins/`);
console.log(`   CSV:     ${rows.length} rows → data/pinterest/pinterest-upload.csv`);

// Validate all URLs
let urlErrors = 0;
for (const row of rows) {
  if (!row.media_url.startsWith(BASE_URL + "/pins/")) { console.error(`   ❌ Bad URL prefix: ${row.media_url}`); urlErrors++; }
  if (!row.media_url.endsWith(".png")) { console.error(`   ❌ Bad URL extension: ${row.media_url}`); urlErrors++; }
  if (!row.link.startsWith(BASE_URL + "/ideas/")) { console.error(`   ❌ Bad Link: ${row.link}`); urlErrors++; }
}

if (urlErrors === 0) {
  console.log(`   ✅ All ${rows.length} rows validated`);
} else {
  console.error(`   ❌ ${urlErrors} validation errors`);
}

// Unique links check
const uniqueLinks = new Set(rows.map(r => r.link));
if (uniqueLinks.size === rows.length) {
  console.log(`   ✅ All ${rows.length} links are unique`);
} else {
  console.error(`   ❌ Only ${uniqueLinks.size} unique links out of ${rows.length} rows`);
}

// Desc length check
for (const row of rows) {
  const len = row.description.length;
  if (len < 80 || len > 150) {
    console.error(`   ⚠️  Description length ${len} for "${row.title}"`);
  }
}

// Board distribution
const boardCount = {};
for (const row of rows) {
  boardCount[row.board] = (boardCount[row.board] || 0) + 1;
}
console.log(`\n📌 Board distribution:`);
for (const [board, count] of Object.entries(boardCount).sort((a, b) => b[1] - a[1])) {
  console.log(`   ${board}: ${count}`);
}

// Sample
console.log(`\n📋 Sample rows:`);
for (const row of rows.slice(0, 3)) {
  console.log(`   ${row.title}`);
  console.log(`   → Media: ${row.media_url}`);
  console.log(`   → Board: ${row.board}`);
  console.log(`   → Link:  ${row.link}`);
  console.log();
}

console.log("✅ Done!");
