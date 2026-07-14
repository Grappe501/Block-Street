/**
 * Durable JSON persistence for Netlify (Blobs) + local filesystem fallback.
 * READ: memory → blob (if hydrated) → committed seed files
 * WRITE: memory + best-effort filesystem + durable blob (production)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";

const memory = new Map<string, string>();
const hydrateState = new Map<string, Promise<void>>();

export function isNetlifyRuntime(): boolean {
  return Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT || process.env.CONTEXT === "production" || process.env.CONTEXT === "deploy-preview");
}

async function getBlobStore(namespace: string) {
  const { getStore } = await import("@netlify/blobs");
  return getStore({ name: namespace, consistency: "strong" });
}

export async function hydrateNamespace(
  namespace: string,
  keys: string[],
  seedPathForKey: (key: string) => string
): Promise<void> {
  if (hydrateState.has(namespace)) return hydrateState.get(namespace)!;
  const p = (async () => {
    for (const key of keys) {
      const cacheKey = `${namespace}:${key}`;
      if (memory.has(cacheKey)) continue;
      let loaded: string | null = null;
      try {
        if (isNetlifyRuntime()) {
          const store = await getBlobStore(namespace);
          const fromBlob = await store.get(key, { type: "text" });
          if (fromBlob != null) loaded = fromBlob;
        }
      } catch {
        /* blob unavailable — fall through to seed */
      }
      if (loaded == null) {
        const seed = seedPathForKey(key);
        if (existsSync(seed)) loaded = readFileSync(seed, "utf8");
      }
      if (loaded != null) memory.set(cacheKey, loaded);
    }
  })();
  hydrateState.set(namespace, p);
  return p;
}

export function readDurableText(namespace: string, key: string, seedPath: string): string {
  const cacheKey = `${namespace}:${key}`;
  if (memory.has(cacheKey)) return memory.get(cacheKey)!;
  if (existsSync(seedPath)) {
    const text = readFileSync(seedPath, "utf8");
    memory.set(cacheKey, text);
    return text;
  }
  throw new Error(`Missing durable seed: ${namespace}/${key}`);
}

export function writeDurableText(namespace: string, key: string, text: string, seedPath: string): void {
  const cacheKey = `${namespace}:${key}`;
  memory.set(cacheKey, text);
  try {
    mkdirSync(dirname(seedPath), { recursive: true });
    writeFileSync(seedPath, text);
  } catch {
    /* Netlify FS may be read-only */
  }
  void (async () => {
    try {
      if (!isNetlifyRuntime()) return;
      const store = await getBlobStore(namespace);
      await store.set(key, text);
    } catch (err) {
      console.error("durable_blob_write_failed", namespace, key, err);
    }
  })();
}

export function clearDurableMemory(namespace?: string) {
  if (!namespace) {
    memory.clear();
    hydrateState.clear();
    return;
  }
  for (const k of [...memory.keys()]) {
    if (k.startsWith(`${namespace}:`)) memory.delete(k);
  }
  hydrateState.delete(namespace);
}
