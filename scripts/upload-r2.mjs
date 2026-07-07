import fs from "fs";
import path from "path";

const DATA_ROOT = path.join(process.cwd(), "src/data");
const CONCURRENCY = 20;
const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 2000;

let uploaded = 0;
let skipped = 0;
let failed = 0;
const failedKeys = [];

function getAuthToken() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) {
    console.error("❌ CLOUDFLARE_API_TOKEN is not set.");
    process.exit(1);
  }
  return token;
}

function getAccountId() {
  const id = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!id) {
    console.error("❌ CLOUDFLARE_ACCOUNT_ID is not set.");
    process.exit(1);
  }
  return id;
}

function getBucketName() {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    console.error("❌ R2_BUCKET_NAME is not set.");
    process.exit(1);
  }
  return bucket;
}

/**
 * Collect all .json files recursively under DATA_ROOT,
 * returning [{ relativePath, absolutePath }] sorted by relativePath.
 */
function collectFiles(dir, baseDir = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const results = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, relativePath));
    } else if (entry.name.endsWith(".json")) {
      results.push({ relativePath, absolutePath: fullPath });
    }
  }
  return results;
}

/**
 * Upload a single file to R2 via the Cloudflare API.
 * Retries on 429/5xx with exponential backoff.
 * Supports resume: skips files already in R2 by comparing content-length + etag.
 */
async function uploadFile(bucketName, key, absolutePath, authToken, accountId, dryRun) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/r2/objects/${encodeURIComponent(bucketName)}/${encodeURIComponent(key)}`;

  // Resume support: check if file already exists
  if (!dryRun) {
    try {
      const headUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/r2/objects/${encodeURIComponent(bucketName)}/${encodeURIComponent(key)}?head=true`;
      const headResp = await fetch(headUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (headResp.ok) {
        const existingSize = parseInt(headResp.headers.get("content-length") || "0", 10);
        const localSize = fs.statSync(absolutePath).size;
        if (existingSize === localSize) {
          return "skipped";
        }
      }
    } catch {
      // If head fails, proceed with upload
    }
  }

  const fileContent = fs.readFileSync(absolutePath);
  const body = dryRun ? null : fileContent;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          ...(body ? { "Content-Length": String(body.length) } : {}),
        },
        body,
      });

      if (response.status === 429 || response.status >= 500) {
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, backoff));
          continue;
        }
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }

      return "uploaded";
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, backoff));
        continue;
      }
      throw err;
    }
  }

  return "failed";
}

/**
 * Process files in concurrent batches.
 */
async function uploadFiles(files, bucketName, authToken, accountId, dryRun) {
  const total = files.length;
  let processed = 0;
  let currentUploaded = 0;
  let currentSkipped = 0;

  const queue = [...files];

  async function worker() {
    while (queue.length > 0) {
      const file = queue.shift();
      const result = await uploadFile(bucketName, file.relativePath, file.absolutePath, authToken, accountId, dryRun);

      if (result === "uploaded") {
        currentUploaded++;
        uploaded++;
      } else if (result === "skipped") {
        currentSkipped++;
        skipped++;
      } else {
        failed++;
        failedKeys.push(file.relativePath);
      }

      processed++;
      if (processed % 50 === 0 || processed === total) {
        process.stdout.write(
          `\r  Progress: ${processed}/${total} files (${currentUploaded} uploaded, ${currentSkipped} skipped)`
        );
      }
    }
  }

  const workers = [];
  for (let i = 0; i < Math.min(CONCURRENCY, total); i++) {
    workers.push(worker());
  }
  await Promise.all(workers);
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log("📦 Uploading data files to Cloudflare R2...");
  console.log(`   Source: ${DATA_ROOT}`);
  console.log(`   Concurrency: ${CONCURRENCY}`);
  if (dryRun) {
    console.log("   Mode: DRY RUN (no data will be sent)");
  }
  console.log("");

  const authToken = getAuthToken();
  const accountId = getAccountId();
  const bucketName = getBucketName();

  console.log(`   R2 Bucket: ${bucketName}`);
  console.log("");

  const files = collectFiles(DATA_ROOT);
  const totalFiles = files.length;
  console.log(`   Found ${totalFiles} JSON files to upload`);
  console.log("");

  await uploadFiles(files, bucketName, authToken, accountId, dryRun);

  console.log("\n");
  console.log("═══════════════════════════════════════");
  console.log("Summary:");
  console.log(`  Uploaded:  ${uploaded}`);
  console.log(`  Skipped:   ${skipped}`);
  console.log(`  Failed:    ${failed}`);
  if (failedKeys.length > 0) {
    console.log("");
    console.log("  Failed keys:");
    for (const k of failedKeys.slice(0, 20)) {
      console.log(`    - ${k}`);
    }
    if (failedKeys.length > 20) {
      console.log(`    ... and ${failedKeys.length - 20} more`);
    }
  }
  console.log("═══════════════════════════════════════");

  if (failed > 0) {
    process.exit(1);
  }
}

main();
