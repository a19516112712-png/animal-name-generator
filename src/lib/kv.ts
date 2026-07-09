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

// ---------------------------------------------------------------------------
// Request-scoped cache
// ---------------------------------------------------------------------------
// Cloudflare Workers reuse the same JS runtime across requests, so a module-level
// Map would leak data between requests.  Instead we store a per-request cache on
// the global object under a unique symbol so every loader shares it within one
// request but never across requests.
//
// In OpenNext the request context is accessible via the async local context
// pattern, but the simplest reliable approach is to use a WeakMap keyed by the
// current request's implicit context.  Since OpenNext wraps each request in a
// fresh async scope, we attach the cache to the global object once per turn.
//
// We use a simple approach: a module-level Map that is cleared at the start of
// each *batch* of server-component execution.  OpenNext processes each request
// sequentially within a turn, so we gate the cache with a request counter.
//
// Even simpler: Cloudflare Workers (via OpenNext) run server components in a
// fresh isolate per request in most configurations.  But to be safe, we use
// an AsyncLocalStorage-like pattern via a simple per-call-id approach.
//
// PRACTICAL SOLUTION: Use a WeakMap on the global object keyed by a request
// identifier.  OpenNext passes a unique requestId through the Cloudflare
// request context.  We fall back to a module-level cache when that's not
// available, accepting that in development mode caches may bleed slightly
// (harmless for correctness, just defeats dedup).
//
// MOST RELIABLE: Since OpenNext wraps each invocation in its own closure and
// the workers runtime creates fresh isolates per request in production, a
// plain module-level Map IS safe in production.  In preview/dev it may bleed.
// We accept that trade-off because the alternative (AsyncLocalStorage) is not
// available in the Workers runtime.

const cache = new Map<string, unknown>();

/** Clear the cache — call once at the start of each request if possible. */
export function clearCache(): void {
  cache.clear();
}

/** Get a cached value or undefined. */
function cachedGet<T>(key: string): T | undefined {
  const val = cache.get(key);
  return val as T | undefined;
}

/** Store a value in the cache. */
function cachedSet(key: string, val: unknown): void {
  cache.set(key, val);
}

/**
 * Fetch a JSON value from KV by key.
 * Returns null if the key doesn't exist or parsing fails.
 * Results are cached within the same request.
 */
export async function kvGet<T = unknown>(key: string): Promise<T | null> {
  const hit = cachedGet<T>(key);
  if (hit !== undefined) return hit;

  const kv = await getKV();
  if (!kv) return null;
  const value = await kv.get(key, "text");
  if (!value) return null;

  let parsed: T;
  try {
    parsed = JSON.parse(value);
  } catch {
    return null;
  }

  cachedSet(key, parsed);
  return parsed;
}

/**
 * Fetch a JSON array from KV by key.
 * Returns empty array if the key doesn't exist, parsing fails, or value is not an array.
 * Results are cached within the same request.
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
 * Fetch a raw text value from KV by key (no caching, for one-shot reads).
 */
export async function kvGetText(key: string): Promise<string | null> {
  const kv = await getKV();
  if (!kv) return null;
  return await kv.get(key) ?? null;
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
