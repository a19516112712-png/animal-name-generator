import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Access the ANIMAL_DATA R2 bucket from the Cloudflare worker context.
 * Must be called from within a server component or server function.
 */
async function getBucket(): Promise<R2Bucket | null> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    return (ctx.env as Record<string, unknown>).ANIMAL_DATA_BUCKET as R2Bucket | null;
  } catch {
    return null;
  }
}

/**
 * Fetch a JSON value from R2 by key.
 * Returns null if the key doesn't exist or parsing fails.
 */
export async function getJSON<T = unknown>(key: string): Promise<T | null> {
  const bucket = await getBucket();
  if (!bucket) return null;
  const object = await bucket.get(key);
  if (!object) return null;
  const text = await object.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/**
 * Fetch a JSON array from R2 by key.
 * Returns empty array if the key doesn't exist or parsing fails.
 */
export async function getJSONArray<T = unknown>(key: string): Promise<T[]> {
  const result = await getJSON<T[]>(key);
  return result || [];
}

/**
 * Check if a key exists in R2.
 */
export async function exists(key: string): Promise<boolean> {
  const bucket = await getBucket();
  if (!bucket) return false;
  const object = await bucket.head(key);
  return object !== null;
}
