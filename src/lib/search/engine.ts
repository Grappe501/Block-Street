import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { SearchFilters, SearchObject, SearchResult, ScoreBreakdown } from "./types";

const DATA = join(process.cwd(), "data");

let cache: SearchObject[] | null = null;

function makeBase(obj: Partial<SearchObject> & Pick<SearchObject, "search_id" | "entity_type" | "entity_id" | "title">): SearchObject {
  const { permissions, ...rest } = obj;
  return {
    created_at: "2026-07-10T00:00:00Z",
    updated_at: "2026-07-10T00:00:00Z",
    status: "published",
    importance_score: 0.5,
    popularity_score: 0.5,
    relationship_score: 0,
    embedding_reference: null,
    ...rest,
    permissions: permissions ?? ["public"],
  };
}

function loadJsonl(): SearchObject[] {
  const path = join(DATA, "search", "search_objects.jsonl");
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as SearchObject);
}

function loadRegistryObjects(): SearchObject[] {
  const objects: SearchObject[] = [];
  const counties = JSON.parse(readFileSync(join(DATA, "registry", "counties.json"), "utf8")) as {
    slug: string;
    name: string;
  }[];
  for (const c of counties) {
    objects.push(
      makeBase({
        search_id: `sis-county-${c.slug}`,
        entity_type: "County",
        entity_id: c.slug,
        title: c.name,
        subtitle: "Arkansas County",
        summary: `${c.name} — statewide organizing geography`,
        full_text: `${c.name} Arkansas county organizing volunteer registration`,
        keywords: [c.name, c.slug, "county", "arkansas"],
        tags: ["geography", "county"],
        county: c.name,
      })
    );
  }

  const hs = JSON.parse(readFileSync(join(DATA, "registry", "high-schools.json"), "utf8")) as Array<{
    slug: string;
    name: string;
    shortName: string;
    city: string;
    county: string;
    lea: string;
    culture: string;
    enrollment: number;
    v1Priority: boolean;
    representationStatus: string;
  }>;
  for (const s of hs) {
    objects.push(
      makeBase({
        search_id: `sis-inst-${s.slug}`,
        entity_type: "Institution",
        entity_id: s.slug,
        title: s.name,
        subtitle: `${s.city} · ${s.county}`,
        summary: `${s.name} — ${s.enrollment} students · ${s.culture}`,
        full_text: `${s.name} ${s.shortName} ${s.city} ${s.county} high school ${s.lea} ${s.culture}`,
        keywords: [s.name, s.shortName, s.city, s.county, "high school"],
        tags: ["education", "institution", s.representationStatus],
        county: s.county,
        organization: s.lea,
        popularity_score: s.v1Priority ? 0.8 : 0.4,
        importance_score: s.v1Priority ? 0.9 : 0.5,
      })
    );
  }

  objects.push(
    makeBase({
      search_id: "sis-doc-sis-001",
      entity_type: "Document",
      entity_id: "SIS-001",
      title: "Statewide Intelligence Search — Build 7.1",
      subtitle: "PHASE-007.1",
      summary: "Unified knowledge retrieval engine for the Intelligence Layer",
      full_text: "statewide intelligence search SIS knowledge retrieval index OCR transcript semantic",
      keywords: ["search", "SIS", "intelligence", "index"],
      tags: ["documentation", "phase-7"],
      owner: "platform",
      importance_score: 0.95,
    }),
    makeBase({
      search_id: "sis-person-john-smith",
      entity_type: "Person",
      entity_id: "person-john-smith",
      title: "John Smith",
      subtitle: "Volunteer · Benton County",
      summary: "County leader · 12 events · active yesterday",
      full_text: "john smith volunteer benton county leader events",
      keywords: ["john", "smith", "volunteer", "benton", "jon", "johnny"],
      tags: ["volunteer", "leader"],
      county: "Benton County",
      relationship_score: 0.9,
      popularity_score: 0.7,
    }),
    makeBase({
      search_id: "sis-mission-recruit-benton",
      entity_type: "Mission",
      entity_id: "mission-recruit-benton",
      title: "Recruit 5 volunteers — Benton County",
      subtitle: "High impact · 35 minutes",
      summary: "County volunteer shortage in Benton County",
      full_text: "recruit volunteers benton county organizing mission",
      keywords: ["volunteer", "recruit", "benton"],
      tags: ["mission", "urgent"],
      county: "Benton County",
      importance_score: 0.85,
      status: "open",
    })
  );

  return objects;
}

export function loadSearchIndex(): SearchObject[] {
  if (cache) return cache;
  const jsonl = loadJsonl();
  const registry = loadRegistryObjects();
  const byId = new Map<string, SearchObject>();
  for (const o of [...registry, ...jsonl]) {
    byId.set(o.search_id, o);
  }
  cache = [...byId.values()];
  return cache;
}

export function getIndexStats() {
  const index = loadSearchIndex();
  const coverageByEntityType: Record<string, number> = {};
  for (const o of index) {
    coverageByEntityType[o.entity_type] = (coverageByEntityType[o.entity_type] || 0) + 1;
  }
  return {
    objectCount: index.length,
    coverageByEntityType,
    healthy: true,
    semanticLayerReady: false,
    embeddingServiceConnected: false,
  };
}

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function tokenize(q: string): string[] {
  return normalize(q).split(/\s+/).filter(Boolean);
}

function fuzzyMatch(token: string, text: string): boolean {
  const t = normalize(text);
  const tok = normalize(token);
  if (t.includes(tok)) return true;
  if (tok.length >= 2 && t.split(/\s+/).some((w) => w.startsWith(tok) || (w.length >= 3 && tok.startsWith(w.slice(0, 3)))))
    return true;
  return false;
}

function keywordScore(tokens: string[], obj: SearchObject): number {
  const hay = normalize(
    [obj.title, obj.subtitle, obj.summary, obj.full_text, ...(obj.keywords || []), ...(obj.tags || [])]
      .filter(Boolean)
      .join(" ")
  );
  if (!tokens.length) return 0;
  let hits = 0;
  for (const tok of tokens) {
    if (hay.includes(tok)) hits += 1;
  }
  return hits / tokens.length;
}

function fuzzyScore(tokens: string[], obj: SearchObject): number {
  const fields = [obj.title, obj.subtitle, obj.summary, obj.full_text, ...(obj.keywords || [])].filter(
    (f): f is string => Boolean(f)
  );
  if (!tokens.length) return 0;
  let hits = 0;
  for (const tok of tokens) {
    if (fields.some((f) => fuzzyMatch(tok, f))) hits += 1;
  }
  return hits / tokens.length;
}

function freshnessScore(obj: SearchObject): number {
  if (!obj.updated_at) return 0.3;
  const age = Date.now() - new Date(obj.updated_at).getTime();
  const days = age / (1000 * 60 * 60 * 24);
  return Math.max(0, 1 - days / 365);
}

function rankObject(obj: SearchObject, tokens: string[], mode: string): SearchResult | null {
  const keyword = keywordScore(tokens, obj);
  const fuzzy = mode === "fuzzy" ? fuzzyScore(tokens, obj) : 0;
  const base = mode === "fuzzy" ? Math.max(keyword, fuzzy) : keyword;
  if (tokens.length && base === 0) return null;

  const importance = obj.importance_score ?? 0.5;
  const popularity = obj.popularity_score ?? 0.5;
  const relationship = obj.relationship_score ?? 0;
  const freshness = freshnessScore(obj);

  const breakdown: ScoreBreakdown = {
    keyword: Math.round(keyword * 100) / 100,
    fuzzy: Math.round(fuzzy * 100) / 100,
    freshness: Math.round(freshness * 100) / 100,
    importance: Math.round(importance * 100) / 100,
    popularity: Math.round(popularity * 100) / 100,
    relationship: Math.round(relationship * 100) / 100,
    total: 0,
  };

  breakdown.total =
    breakdown.keyword * 0.35 +
    breakdown.fuzzy * 0.15 +
    breakdown.freshness * 0.1 +
    breakdown.importance * 0.15 +
    breakdown.popularity * 0.1 +
    breakdown.relationship * 0.15;

  breakdown.total = Math.round(breakdown.total * 1000) / 1000;

  return {
    ...obj,
    score: breakdown.total,
    scoreBreakdown: breakdown,
    matchMode: fuzzy > keyword ? "fuzzy" : tokens.length ? "keyword" : "filter",
  };
}

function passesFilters(obj: SearchObject, filters: SearchFilters): boolean {
  if (filters.entity_type && obj.entity_type !== filters.entity_type) return false;
  if (filters.county && obj.county !== filters.county) return false;
  if (filters.status && obj.status !== filters.status) return false;
  if (filters.tags && !(obj.tags || []).includes(filters.tags)) return false;
  return true;
}

function passesPermissions(obj: SearchObject, viewerPermissions: string[]): boolean {
  if (!obj.permissions?.length) return true;
  return obj.permissions.some((p) => viewerPermissions.includes(p) || p === "public");
}

export function search(
  query: string,
  options: {
    mode?: string;
    filters?: SearchFilters;
    limit?: number;
    viewerPermissions?: string[];
  } = {}
): SearchResult[] {
  const mode = options.mode || "standard";
  const limit = options.limit ?? 25;
  const viewerPermissions = options.viewerPermissions ?? ["public", "contributor", "steward"];
  const tokens = tokenize(query);
  const searchMode = mode === "fuzzy" ? "fuzzy" : "standard";

  const results: SearchResult[] = [];
  for (const obj of loadSearchIndex()) {
    if (!passesPermissions(obj, viewerPermissions)) continue;
    if (options.filters && !passesFilters(obj, options.filters)) continue;
    const ranked = rankObject(obj, tokens, searchMode);
    if (ranked) results.push(ranked);
    else if (!tokens.length && options.filters) {
      results.push({
        ...obj,
        score: obj.importance_score ?? 0.5,
        scoreBreakdown: {
          keyword: 0,
          fuzzy: 0,
          freshness: freshnessScore(obj),
          importance: obj.importance_score ?? 0.5,
          popularity: obj.popularity_score ?? 0.5,
          relationship: obj.relationship_score ?? 0,
          total: obj.importance_score ?? 0.5,
        },
        matchMode: "filter",
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function suggest(query: string, limit = 8): string[] {
  const q = normalize(query);
  if (!q) return [];
  const suggestions = new Set<string>();
  for (const obj of loadSearchIndex()) {
    if (normalize(obj.title).includes(q)) suggestions.add(obj.title);
    if (obj.county && normalize(obj.county).includes(q)) suggestions.add(obj.county);
    for (const kw of obj.keywords || []) {
      if (normalize(kw).includes(q)) suggestions.add(kw);
    }
    if (suggestions.size >= limit) break;
  }
  return [...suggestions].slice(0, limit);
}
