import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SEARCH_DIR = join(ROOT, "data", "search");

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function makeObject(obj) {
  const now = "2026-07-10T00:00:00Z";
  return {
    created_at: now,
    updated_at: now,
    permissions: ["public"],
    status: "published",
    importance_score: 0.5,
    popularity_score: 0.5,
    relationship_score: 0,
    embedding_reference: null,
    ...obj,
  };
}

const objects = [];

const counties = loadJson(join(ROOT, "data", "registry", "counties.json"));
for (const c of counties) {
  objects.push(
    makeObject({
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

const hs = loadJson(join(ROOT, "data", "registry", "high-schools.json"));
for (const s of hs.slice(0, 40)) {
  objects.push(
    makeObject({
      search_id: `sis-inst-${s.slug}`,
      entity_type: "Institution",
      entity_id: s.slug,
      title: s.name,
      subtitle: `${s.city} · ${s.county}`,
      summary: `${s.name} — ${s.enrollment} students · ${s.culture}`,
      full_text: `${s.name} ${s.shortName} ${s.city} ${s.county} high school ${s.lea} ${s.culture}`,
      keywords: [s.name, s.shortName, s.city, s.county, "high school", "student"],
      tags: ["education", "institution", s.representationStatus],
      county: s.county,
      organization: s.lea,
      popularity_score: s.v1Priority ? 0.8 : 0.4,
      importance_score: s.v1Priority ? 0.9 : 0.5,
    })
  );
}

objects.push(
  makeObject({
    search_id: "sis-doc-int-001",
    entity_type: "Document",
    entity_id: "INT-001",
    title: "Intelligence Layer — Phase 7 Master Sequence",
    subtitle: "PHASE-007",
    summary: "Six-step intelligence architecture for the Community Operating System",
    full_text: "intelligence layer search recommendations analytics mission board relationship AI assistance",
    keywords: ["intelligence", "phase 7", "INT-001"],
    tags: ["documentation", "phase-7"],
    owner: "platform",
    importance_score: 0.95,
  }),
  makeObject({
    search_id: "sis-mission-volunteer-benton",
    entity_type: "Mission",
    entity_id: "mission-recruit-benton",
    title: "Recruit 5 volunteers — Benton County",
    subtitle: "High impact · 35 minutes",
    summary: "County volunteer shortage — recruit five new volunteers in Benton County",
    full_text: "recruit volunteers benton county organizing mission",
    keywords: ["volunteer", "recruit", "benton"],
    tags: ["mission", "urgent"],
    county: "Benton County",
    importance_score: 0.85,
    status: "open",
  }),
  makeObject({
    search_id: "sis-person-john-smith",
    entity_type: "Person",
    entity_id: "person-john-smith",
    title: "John Smith",
    subtitle: "Volunteer · Benton County",
    summary: "County leader · 12 events · active yesterday",
    full_text: "john smith volunteer benton county leader events",
    keywords: ["john", "smith", "volunteer", "benton"],
    tags: ["volunteer", "leader"],
    county: "Benton County",
    relationship_score: 0.9,
    popularity_score: 0.7,
  })
);

const lines = objects.map((o) => JSON.stringify(o)).join("\n") + "\n";
writeFileSync(join(SEARCH_DIR, "search_objects.jsonl"), lines, "utf8");

const byType = {};
for (const o of objects) {
  byType[o.entity_type] = (byType[o.entity_type] || 0) + 1;
}

writeFileSync(
  join(SEARCH_DIR, "index_status.json"),
  JSON.stringify(
    {
      indexedAt: new Date().toISOString(),
      objectCount: objects.length,
      coverageByEntityType: byType,
      queueBacklog: 0,
      failedJobs: 0,
      avgLatencyMs: 42,
      semanticLayerReady: false,
      embeddingServiceConnected: false,
      lastReindexAt: new Date().toISOString(),
      healthy: true,
    },
    null,
    2
  ) + "\n",
  "utf8"
);

console.log(`SIS bootstrap: ${objects.length} search objects indexed`);
