import { readFileSync, writeFileSync, appendFileSync, existsSync } from "fs";
import { join } from "path";
import type { ContentItem, ContentType, ContentVersion, MediaAsset, PublicationManifest } from "./types";

export const CMS_DATA = join(process.cwd(), "data", "cms");

const cache = new Map<string, unknown>();

function readJson<T>(file: string, key: string): T[] {
  const ck = `${file}:${key}`;
  if (cache.has(ck)) return cache.get(ck) as T[];
  const raw = JSON.parse(readFileSync(join(CMS_DATA, file), "utf8"));
  const items = raw[key] as T[];
  cache.set(ck, items);
  return items;
}

function writeJson<T>(file: string, key: string, items: T[]) {
  writeFileSync(join(CMS_DATA, file), JSON.stringify({ [key]: items }, null, 2));
  cache.clear();
}

export function loadContentItems(): ContentItem[] {
  return readJson<ContentItem>("content_items.json", "items");
}

export function persistContentItems(items: ContentItem[]) {
  writeJson("content_items.json", "items", items);
}

export function loadContentVersions(): ContentVersion[] {
  return readJson<ContentVersion>("content_versions.json", "versions");
}

export function persistContentVersions(versions: ContentVersion[]) {
  writeJson("content_versions.json", "versions", versions);
}

export function loadContentTypes(): ContentType[] {
  return readJson<ContentType>("content_types.json", "content_types");
}

export function loadMediaAssets(): MediaAsset[] {
  return readJson<MediaAsset>("media_assets.json", "assets");
}

export function persistMediaAssets(assets: MediaAsset[]) {
  writeJson("media_assets.json", "assets", assets);
}

export function loadPublicationManifests(): PublicationManifest[] {
  return readJson<PublicationManifest>("publication_manifests.json", "manifests");
}

export function persistPublicationManifests(manifests: PublicationManifest[]) {
  writeJson("publication_manifests.json", "manifests", manifests);
}

export function loadCmsFeatureFlags() {
  const raw = JSON.parse(readFileSync(join(CMS_DATA, "feature_flags.json"), "utf8"));
  return raw.feature_flags as Record<string, boolean>;
}

export function loadEditorialAssignments() {
  const raw = JSON.parse(readFileSync(join(CMS_DATA, "editorial_assignments.json"), "utf8"));
  return raw.assignments as { user_id: string; roles: string[] }[];
}

export function loadTaxonomy() {
  return JSON.parse(readFileSync(join(CMS_DATA, "taxonomy_terms.json"), "utf8")) as {
    terms: Record<string, unknown>[];
    tags: { id: string; name: string }[];
  };
}

export function appendCmsAudit(event: Record<string, unknown>) {
  appendFileSync(
    join(CMS_DATA, "audit_events.jsonl"),
    JSON.stringify({ ...event, timestamp: new Date().toISOString() }) + "\n"
  );
}

export function readCmsAudit(limit = 50) {
  const path = join(CMS_DATA, "audit_events.jsonl");
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l))
    .slice(-limit)
    .reverse();
}
