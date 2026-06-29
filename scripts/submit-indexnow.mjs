/**
 * IndexNow Batch Submission Script
 * 
 * Reads the built sitemap.xml, extracts all URLs, batches them (≤10,000 per call),
 * and submits to Bing/Yandex/Seznam via IndexNow API.
 * 
 * Usage:
 *   node scripts/submit-indexnow.mjs          # submit all URLs
 *   node scripts/submit-indexnow.mjs --dry    # dry run (print stats only)
 *   node scripts/submit-indexnow.mjs --recent  # submit only recently modified URLs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Configuration ───────────────────────────────────────────────
const INDEXNOW_KEY = "ae9dc27df3cf412eb219cf1e7be16353";
const INDEXNOW_KEY_LOCATION = `https://bestanimalnames.com/${INDEXNOW_KEY}.txt`;
const HOST = "bestanimalnames.com";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 10000;              // IndexNow max per request
const CONCURRENCY = 3;                 // parallel batch submissions
const REQUEST_TIMEOUT_MS = 30000;      // 30s per batch
const SITEMAP_PATH = path.join(__dirname, "..", "public", "sitemap.xml");
// ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry");
const RECENT_ONLY = args.includes("--recent");

/** Strip wrapping, trim, and return only <loc> content */
function extractUrlsFromSitemap(filepath) {
  if (!fs.existsSync(filepath)) {
    console.error(`❌ Sitemap not found: ${filepath}`);
    console.error("   Run 'node scripts/generate-sitemap.mjs' first or build the project.");
    process.exit(1);
  }

  const xml = fs.readFileSync(filepath, "utf-8");
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

/** Chunk array into batches */
function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/** Submit a single batch (array of URL strings) to IndexNow */
async function submitBatch(batch, batchIndex, totalBatches) {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: batch,
  };

  const body = JSON.stringify(payload);

  if (DRY_RUN) {
    console.log(`  [DRY] Batch ${batchIndex}/${totalBatches}: ${batch.length} URLs ready`);
    return { ok: true, urls: batch.length };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (res.ok) {
      console.log(`  ✅ Batch ${batchIndex}/${totalBatches}: ${batch.length} URLs submitted (${res.status})`);
      return { ok: true, urls: batch.length, status: res.status };
    }

    const text = await res.text().catch(() => "");
    console.error(`  ❌ Batch ${batchIndex}/${totalBatches}: HTTP ${res.status} — ${text.slice(0, 200)}`);
    return { ok: false, urls: batch.length, status: res.status, error: text };
  } catch (err) {
    clearTimeout(timer);
    console.error(`  ❌ Batch ${batchIndex}/${totalBatches}: ${err.message}`);
    return { ok: false, urls: batch.length, error: err.message };
  }
}

/** Submit all batches with limited concurrency */
async function submitAll(batches) {
  const results = [];
  const total = batches.length;

  for (let i = 0; i < batches.length; i += CONCURRENCY) {
    const slice = batches.slice(i, i + CONCURRENCY);
    const promises = slice.map((batch, j) =>
      submitBatch(batch, i + j + 1, total)
    );
    const settled = await Promise.all(promises);
    results.push(...settled);
  }

  return results;
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 IndexNow Batch Submission for bestanimalnames.com\n");

  console.log("📋 Configuration:");
  console.log(`   Key:         ${INDEXNOW_KEY}`);
  console.log(`   Key location: ${INDEXNOW_KEY_LOCATION}`);
  console.log(`   Endpoint:    ${INDEXNOW_ENDPOINT}`);
  console.log(`   Batch size:  ${BATCH_SIZE}`);
  console.log(`   Concurrency: ${CONCURRENCY}`);
  console.log(`   Dry run:     ${DRY_RUN}`);
  console.log("");

  // 1. Extract URLs
  console.log("📖 Reading sitemap...");
  const allUrls = extractUrlsFromSitemap(SITEMAP_PATH);
  console.log(`   Found ${allUrls.toLocaleString()} URLs\n`);

  // 2. Optional: filter to recent only (last 24h by sitemap <lastmod>)
  let urls = allUrls;
  if (RECENT_ONLY) {
    const today = new Date().toISOString().split("T")[0];
    const xml = fs.readFileSync(SITEMAP_PATH, "utf-8");
    const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
    const recentUrls = urlBlocks
      .filter((block) => block.includes(`<lastmod>${today}`))
      .map((block) => {
        const m = block.match(/<loc>([^<]+)<\/loc>/);
        return m ? m[1].trim() : null;
      })
      .filter(Boolean);
    urls = recentUrls;
    console.log(`🔍 Filtered to ${urls.length} recently-modified URLs (${today})\n`);
  }

  if (urls.length === 0) {
    console.log("⚠️  No URLs to submit. Exiting.");
    process.exit(0);
  }

  // 3. Batch
  const batches = chunk(urls, BATCH_SIZE);
  console.log(`📦 Split into ${batches.length} batch(es) (${BATCH_SIZE} URLs each)\n`);

  // 4. Submit
  if (!DRY_RUN) {
    console.log("📤 Submitting to IndexNow...\n");
  }
  const startTime = Date.now();
  const results = await submitAll(batches);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // 5. Summary
  const succeeded = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);
  const totalSubmitted = succeeded.reduce((sum, r) => sum + r.urls, 0);

  console.log("");
  console.log("═══════════════════════════════════════════");
  console.log("📊 SUBMISSION SUMMARY");
  console.log("═══════════════════════════════════════════");
  console.log(`   Total URLs:     ${urls.length.toLocaleString()}`);
  console.log(`   Batches:        ${batches.length}`);
  console.log(`   Succeeded:      ${succeeded.length} batch(es) — ${totalSubmitted.toLocaleString()} URLs`);
  console.log(`   Failed:         ${failed.length} batch(es)`);
  console.log(`   Elapsed:        ${elapsed}s`);

  if (failed.length > 0 && !DRY_RUN) {
    console.log("\n⚠️  Failed batches:");
    failed.forEach((f) => {
      console.log(`   - ${f.urls} URLs: ${f.error || `HTTP ${f.status}`}`);
    });
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log("\n💡 Dry run complete. Remove --dry to submit for real.");
  } else {
    console.log("\n✅ All batches submitted successfully!");
  }
}

main();
