import fs from "fs";
import path from "path";

const DATA_ROOT = path.join(process.cwd(), "src/data");
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

let uploaded = 0;
let skipped = 0;
let failed = 0;

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

async function uploadKey(kvNamespaceId, key, value, authToken, accountId) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvNamespaceId}/values/${encodeURIComponent(key)}`;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }
      
      return true;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, RETRY_DELAY * attempt));
        continue;
      }
      throw err;
    }
  }
  return false;
}

async function uploadFile(filePath, relativePath, kvNamespaceId, authToken, accountId) {
  const key = relativePath.replace(/\.json$/, "");
  const content = fs.readFileSync(filePath, "utf-8");
  
  try {
    await uploadKey(kvNamespaceId, key, content, authToken, accountId);
    uploaded++;
    process.stdout.write(`\r  Uploaded ${uploaded}/${uploaded + skipped + failed} | ${key}`);
    return true;
  } catch (err) {
    failed++;
    console.error(`\n  FAILED: ${key} - ${err.message}`);
    return false;
  }
}

async function uploadDirectory(dirPath, baseDir, kvNamespaceId, authToken, accountId) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.join(baseDir, entry.name);
    
    if (entry.isDirectory()) {
      await uploadDirectory(fullPath, relativePath, kvNamespaceId, authToken, accountId);
    } else if (entry.name.endsWith(".json")) {
      await uploadFile(fullPath, relativePath, kvNamespaceId, authToken, accountId);
    }
  }
}

async function main() {
  console.log("📦 Uploading data files to Cloudflare Workers KV...");
  console.log(`   Source: ${DATA_ROOT}`);
  
  const authToken = getAuthToken();
  const accountId = getAccountId();
  
  // Read KV namespace ID from wrangler.jsonc
  const wranglerPath = path.join(process.cwd(), "wrangler.jsonc");
  let kvNamespaceId = "";
  
  if (fs.existsSync(wranglerPath)) {
    const wranglerContent = fs.readFileSync(wranglerPath, "utf-8");
    // Parse JSONC (remove comments)
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
  
  try {
    await uploadDirectory(DATA_ROOT, "", kvNamespaceId, authToken, accountId);
    console.log(`\n\n✅ Done! Uploaded: ${uploaded}, Failed: ${failed}`);
    
    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error(`\n\n❌ Upload failed: ${err.message}`);
    process.exit(1);
  }
}

main();
