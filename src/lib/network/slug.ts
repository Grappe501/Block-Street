import { loadNetworkProfiles } from "./data";

/** URL-safe slug from a display name. */
export function slugifyName(name: string): string {
  const base = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || "member";
}

/** Allocate a unique share slug among existing network profiles. */
export function allocateUniqueSlug(displayName: string, preferred?: string): string {
  const existing = new Set(loadNetworkProfiles().map((p) => p.share_slug));
  const root = slugifyName(preferred || displayName);
  if (!existing.has(root)) return root;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${root}-${i}`;
    if (!existing.has(candidate)) return candidate;
  }
  return `${root}-${Date.now().toString(36)}`;
}
