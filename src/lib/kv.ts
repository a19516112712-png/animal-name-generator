import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Access the ANIMAL_DATA KV namespace from the Cloudflare worker context.
 * Must be called from within a server component or server function.
 */
async function getKV(): Promise<KVNamespace | null> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    return (ctx.env as Record<string, unknown>).ANIMAL_DATA as KVNamespace | null;
  } catch {
    return null;
  }
}

/**
 * Attempt to parse a raw KV value as JSON.
 * Handles the case where the value was double-encoded during upload
 * (JSON.stringify called on an already-stringified JSON string).
 * Returns the parsed value or null on failure.
 */
function safeJsonParse(raw: string): unknown {
  try {
    const first = JSON.parse(raw);
    // If the first parse returned a string, the data was double-encoded.
    // Parse again to unwrap the outer string layer.
    if (typeof first === "string") {
      return JSON.parse(first);
    }
    return first;
  } catch {
    return null;
  }
}

/**
 * Fetch a JSON value from KV by key.
 * Returns null if the key doesn't exist or parsing fails.
 */
export async function kvGet<T = unknown>(key: string): Promise<T | null> {
  const kv = await getKV();
  if (!kv) return null;
  const value = await kv.get(key, "text");
  if (!value) return null;
  const parsed = safeJsonParse(value);
  if (parsed === null) return null;
  return parsed as T;
}

/**
 * Fetch a JSON array from KV by key.
 * Returns empty array if the key doesn't exist or parsing fails.
 */
export async function kvGetArray<T = unknown>(key: string): Promise<T[]> {
  const result = await kvGet<T[]>(key);
  if (!Array.isArray(result)) {
    console.error(`[kvGetArray] Expected array for key "${key}", got ${typeof result}:`, result);
    return [];
  }
  return result;
}

/**
 * Check if a key exists in KV.
 */
export async function kvHas(key: string): Promise<boolean> {
  const kv = await getKV();
  if (!kv) return false;
  const result = await kv.list({ prefix: key, limit: 1 });
  return result.keys.length > 0;
}
