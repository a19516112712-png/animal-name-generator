import fs from "fs";
import path from "path";

const DATA_ROOT = path.join(process.cwd(), "src/data");
const BATCH_SIZE = 100;
const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 2000;

let totalUploaded = 0;
let totalSkipped = 0;
let totalFailed = 0;

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
 */
async function uploadBatch(namespaceId, batch, authToken, accountId) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/bulk`;

  const body = batch.map(({ key, value }) => ({
    key,
    value,
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

      if (!response.ok) {
        const text = await response.text();
        const status = response.status;

        // 429: rate limit — exponential backoff
        if (status === 429 && attempt < MAX_RETRIES) {
          const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
          console.log(`  [429] Rate limited, retrying in ${backoff}ms...`);
          await new Promise((r) => setTimeout(r, backoff));
          continue;
        }

        throw new Error(`${status}: ${text}`);
      }

      return batch.length;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, INITIAL_BACKOFF_MS * attempt));
        continue;
      }
      throw err;
    }
  }
  return 0;
}

async function main() {
  console.log("📦 Uploading data files to Cloudflare Workers KV (bulk API)...");
  console.log(`   Source: ${DATA_ROOT}`);

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
  console.log(`   Found ${files.length} JSON files`);

  // Build batches: each entry is { key: relativePath (no .json), value: raw file content }
  const batches = [];
  for (const file of files) {
    const content = fs.readFileSync(file.absolutePath, "utf-8");
    const key = file.relativePath.replace(/\.json$/, "");
    batches.push({ key, value: content });

    if (batches.length === BATCH_SIZE) {
      const count = await uploadBatch(kvNamespaceId, batches, authToken, accountId);
      totalUploaded += count;
      batches.length = 0;
      console.log(`  Batch complete: ${totalUploaded} / ${files.length} uploaded`);
    }
  }

  // Upload remaining
  if (batches.length > 0) {
    const count = await uploadBatch(kvNamespaceId, batches, authToken, accountId);
    totalUploaded += count;
  }

  console.log(`\n✅ Done! Uploaded: ${totalUploaded}, Total files: ${files.length}`);

  if (totalUploaded < files.length) {
    console.error(`⚠️  ${files.length - totalUploaded} files may have failed`);
    process.exit(1);
  }
}

main();
