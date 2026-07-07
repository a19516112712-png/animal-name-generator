import fs from "fs";
import path from "path";

const DATA_ROOT = path.join(process.cwd(), "src/data");
const BATCH_SIZE = 100;
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
 * Perform a single batch upload via the Workers KV Bulk Write API.
 * Retries on 429 (exponential backoff) and 5xx (fixed retry).
 * All non-2xx responses stay inside the retry loop — only after
 * exhausting MAX_RETRIES does the batch count as failed.
 */
async function uploadBatch(namespaceId, batch, authToken, accountId, dryRun) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/bulk`;

  if (dryRun) {
    console.log(`  [DRY RUN] Would upload ${batch.length} keys:`);
    for (const { key, value } of batch) {
      console.log(`    ${key} (${value.length} bytes)`);
    }
    return batch.length;
  }

  const body = batch.map(({ key, value }) => ({
    key,
    value: typeof value === "string" ? value : JSON.stringify(value),
    base64: false,
  }));

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // --- 429 Too Many Requests: exponential backoff ---
      if (response.status === 429) {
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.warn(
          `  ⚠️  429 rate limited — retry ${attempt}/${MAX_RETRIES} in ${backoff}ms`
        );
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, backoff));
          continue;
        }
        // Last attempt still 429 — fall through to report failure
      }

      // --- 5xx Server Errors: fixed delay retry ---
      if (response.status >= 500) {
        console.warn(
          `  ⚠️  ${response.status} server error — retry ${attempt}/${MAX_RETRIES}`
        );
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, INITIAL_BACKOFF_MS));
          continue;
        }
        // Last attempt still 5xx — fall through to report failure
      }

      // --- Non-retryable errors (4xx other than 429, etc.) ---
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }

      // --- Success ---
      const result = await response.json();
      if (!result.success) {
        throw new Error(`API reported failure: ${JSON.stringify(result.errors)}`);
      }

      return batch.length;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.warn(
          `  ⚠️  Error on attempt ${attempt}: ${err.message} — retrying in ${backoff}ms`
        );
        await new Promise((r) => setTimeout(r, backoff));
        continue;
      }
      throw err;
    }
  }

  return 0;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log("📦 Uploading data files to Cloudflare Workers KV...");
  console.log(`   Source: ${DATA_ROOT}`);
  console.log(`   Batch size: ${BATCH_SIZE}`);
  if (dryRun) {
    console.log("   Mode: DRY RUN (no data will be sent)");
  }
  console.log("");

  const authToken = getAuthToken();
  const accountId = getAccountId();

  // Read KV namespace ID from wrangler.jsonc
  const wranglerPath = path.join(process.cwd(), "wrangler.jsonc");
  let kvNamespaceId = "";

  if (fs.existsSync(wranglerPath)) {
    const wranglerContent = fs.readFileSync(wranglerPath, "utf-8");
    const jsonContent = wranglerContent
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");
    const wrangler = JSON.parse(jsonContent);

    if (wrangler.kv_namespaces && wrangler.kv_namespaces.length > 0) {
      kvNamespaceId = wrangler.kv_namespaces[0].id;
    }
  }

  if (!kvNamespaceId) {
    console.error("❌ Could not find KV namespace ID in wrangler.jsonc");
    process.exit(1);
  }

  console.log(`   KV Namespace: ${kvNamespaceId}`);
  console.log("");

  // Collect all files
  const files = collectFiles(DATA_ROOT);
  const totalFiles = files.length;
  console.log(`   Found ${totalFiles} JSON files to upload`);
  console.log("");

  // Build batches of { key, value }
  let batchIndex = 0;
  let batchUploaded = 0;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    batchIndex++;
    const slice = files.slice(i, i + BATCH_SIZE);
    const batch = slice.map(({ relativePath, absolutePath }) => {
      const key = relativePath.replace(/\.json$/, "");
      const value = fs.readFileSync(absolutePath, "utf-8");
      return { key, value };
    });

    const prefix = `Batch ${batchIndex}`;
    try {
      const count = await uploadBatch(
        kvNamespaceId,
        batch,
        authToken,
        accountId,
        dryRun
      );
      batchUploaded += count;
      uploaded += count;
      process.stdout.write(
        `\r  Progress: ${Math.min(i + BATCH_SIZE, totalFiles)}/${totalFiles} files (${batchUploaded} keys uploaded)`
      );
    } catch (err) {
      failed += batch.length;
      for (const item of batch) {
        failedKeys.push(item.key);
      }
      console.error(`\n  ❌ ${prefix} FAILED: ${err.message}`);
    }
  }

  console.log("");
  console.log("");
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
