#!/usr/bin/env node

/**
 * publish-pinterest-images.js
 *
 * Scans assets/pinterest/inbox/YYYY-MM-DD/ for PNG files,
 * copies them to public/pins/, and generates a Pinterest-ready CSV
 * with public media URLs.
 *
 * Usage:
 *   node scripts/publish-pinterest-images.js                # today's date
 *   node scripts/publish-pinterest-images.js 2026-06-06     # specific date
 */

const fs = require("fs");
const path = require("path");

// ── Resolve date ───────────────────────────────────────────
const dateArg = process.argv[2];
const today = new Date();
const ds = dateArg || [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
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
  dog:     "Dog Names 🐕",
  cat:     "Cat Names 🐱",
  rabbit:  "Rabbit Names 🐰",
  horse:   "Horse Names 🐴",
  bird:    "Bird Names 🦜",
  hamster: "Hamster Names 🐹",
};

const DEFAULT_BOARD = "Pet Names 🐾";

const DESCRIPTIONS = [
  "Find the perfect name for your pet. 100% free, no sign-up required. #petnames",
  "Discover hundreds of handpicked pet names. Free name generator with 989+ animals. #petnames",
  "Looking for the best pet names? Browse our curated collection — all free! #petnames",
  "Unique and creative pet name ideas for every animal. Free, instant, no registration. #petnames",
  "The ultimate pet name collection. 989+ animals, 160+ names each. 100% free! #petnames",
];

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

function parseFilename(filename) {
  // "100-creative-cat-names.png" → { num: "100", adj: "Creative", animal: "cat", title: "100 Creative Cat Names" }
  const name = filename.replace(/\.png$/i, "").replace(/-names$/, "");
  const parts = name.split("-");
  if (parts.length < 3) {
    return { num: "", adj: "", animal: "", title: name.replace(/-/g, " ") };
  }
  return {
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
  const { num, adj, animal, title } = parseFilename(filename);
  const board = BOARDS[animal] || DEFAULT_BOARD;
  const desc  = DESCRIPTIONS[hashStr(filename) % DESCRIPTIONS.length];
  const mediaUrl = `${BASE_URL}/pins/${filename}`;

  // Validate URL format
  if (!mediaUrl.startsWith(BASE_URL) || !mediaUrl.endsWith(".png")) {
    console.error(`   ❌ Invalid media URL: ${mediaUrl}`);
    failed++;
    continue;
  }

  rows.push({
    title:       title,
    description: desc,
    board:       board,
    media_url:   mediaUrl,
  });
}

// Write CSV
const header = "title,description,board,media_url";
const csvLines = [header];
for (const row of rows) {
  csvLines.push(
    `${csvEscape(row.title)},${csvEscape(row.description)},${csvEscape(row.board)},${csvEscape(row.media_url)}`
  );
}
fs.writeFileSync(CSV_PATH, csvLines.join("\n") + "\n");

// ── Validation ─────────────────────────────────────────────
console.log(`\n📊 Results:`);
console.log(`   Copied:  ${copied} files → public/pins/`);
console.log(`   CSV:     ${rows.length} rows → data/pinterest/pinterest-upload.csv`);

// Validate all media URLs
let urlErrors = 0;
for (const row of rows) {
  const url = row.media_url;
  if (!url.startsWith(BASE_URL + "/pins/")) {
    console.error(`   ❌ Bad URL prefix: ${url}`);
    urlErrors++;
  }
  if (!url.endsWith(".png")) {
    console.error(`   ❌ Bad URL extension: ${url}`);
    urlErrors++;
  }
}

if (urlErrors === 0) {
  console.log(`   ✅ All ${rows.length} media URLs validated`);
} else {
  console.error(`   ❌ ${urlErrors} URL validation errors`);
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
  console.log(`   → ${row.media_url}`);
  console.log(`   → ${row.board}`);
  console.log();
}

console.log("✅ Done!");
