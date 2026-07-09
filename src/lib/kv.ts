import * as fs from "fs";
import * as path from "path";

const DATA_ROOT = path.join(process.cwd(), "src", "data");

// @ts-ignore - KVNamespace not available in Vercel/next build
type KV = { get(key: string, type?: "text"): Promise<string | null> };

/**
 * Access the ANIMAL_DATA KV namespace from the Cloudflare worker context.
 * Returns null on Vercel / local builds.
 */
async function getKV(): Promise<KV | null> {
  try {
    // @ts-ignore - @opennextjs/cloudflare only available in Workers runtime
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    return (ctx.env as Record<string, unknown>).ANIMAL_DATA as KV | null;
  } catch {
    return null;
  }
}

/**
 * Read a JSON value from local filesystem fallback.
 */
function readLocalJSON<T = unknown>(key: string): T | null {
  const filePath = path.join(DATA_ROOT, key + ".json");
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const cache = new Map<string, unknown>();

export function clearCache(): void {
  cache.clear();
}

function cachedGet<T>(key: string): T | undefined {
  const val = cache.get(key);
  if (val === null) return undefined; // Don't cache null — force retry
  return val as T | undefined;
}

function cachedSet(key: string, val: unknown): void {
  cache.set(key, val);
}

export async function kvGet<T = unknown>(key: string): Promise<T | null> {
  const hit = cachedGet<T>(key);
  if (hit !== undefined) return hit;

  // Try KV first
  const kv = await getKV();
  if (kv) {
    const value = await kv.get(key, "text");
    if (value) {
      try {
        const parsed = JSON.parse(value) as T;
        cachedSet(key, parsed);
        return parsed;
      } catch {
        return null;
      }
    }
  }

  // KV unavailable or key not found → fallback to local filesystem
  const local = readLocalJSON<T>(key);
  if (local !== null) cachedSet(key, local);
  return local;
}

export async function kvGetArray<T = unknown>(key: string): Promise<T[]> {
  const result = await kvGet<T[]>(key);
  if (!Array.isArray(result)) {
    console.error(`[kvGetArray] Expected array for key "${key}", got ${typeof result}:`, result);
    return [];
  }
  return result;
}

export async function kvGetText(key: string): Promise<string | null> {
  const kv = await getKV();
  if (kv) {
    const val = await kv.get(key);
    if (val) return val;
  }
  // fs fallback for text reads
  const filePath = path.join(DATA_ROOT, key + ".json");
  if (!fs.existsSync(filePath)) return null;
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

export async function kvHas(key: string): Promise<boolean> {
  const kv = await getKV();
  if (kv) {
    const result = await kv.get(key);
    if (result !== null) return true;
  }
  return fs.existsSync(path.join(DATA_ROOT, key + ".json"));
}
