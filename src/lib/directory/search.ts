import {
  getCounties,
  getHighSchools,
  getInstitutions,
  getPrivateCharterSchools,
  getRegistryStats,
} from "@/lib/data";
import { loadHomePlaces } from "@/lib/auth/data";

export type DirectoryHit = {
  kind: "county" | "school" | "high-school" | "private-school";
  slug: string;
  name: string;
  county?: string;
  href: string;
};

export function searchDirectory(query: string, limit = 40): DirectoryHit[] {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 2) return [];

  const hits: DirectoryHit[] = [];

  for (const c of getCounties()) {
    if (c.name.toLowerCase().includes(q) || c.slug.includes(q)) {
      hits.push({ kind: "county", slug: c.slug, name: c.name, href: `/county/${c.slug}` });
    }
  }
  for (const s of getInstitutions()) {
    if (s.name.toLowerCase().includes(q) || s.shortName.toLowerCase().includes(q) || s.slug.includes(q)) {
      hits.push({
        kind: "school",
        slug: s.slug,
        name: s.name,
        county: s.county,
        href: `/schools/${s.slug}`,
      });
    }
  }
  for (const s of getHighSchools()) {
    if (s.name.toLowerCase().includes(q) || s.shortName.toLowerCase().includes(q) || s.slug.includes(q)) {
      hits.push({
        kind: "high-school",
        slug: s.slug,
        name: s.name,
        county: s.county,
        href: `/high-schools/${s.slug}`,
      });
    }
  }
  for (const s of getPrivateCharterSchools()) {
    if (s.name.toLowerCase().includes(q) || s.shortName.toLowerCase().includes(q) || s.slug.includes(q)) {
      hits.push({
        kind: "private-school",
        slug: s.slug,
        name: s.name,
        county: s.county,
        href: `/private-schools/${s.slug}`,
      });
    }
  }

  return hits.slice(0, limit);
}

export function getOutreachVisibility() {
  const places = loadHomePlaces();
  const stats = getRegistryStats();
  const countySlugs = new Set(places.filter((p) => p.kind === "county").map((p) => p.slug));
  for (const p of places) {
    if (p.county_slug) countySlugs.add(p.county_slug);
  }
  const schoolKeys = new Set(
    places.filter((p) => p.kind !== "county").map((p) => `${p.kind}:${p.slug}`)
  );

  const totalCounties = getCounties().length;
  const representedCounties = countySlugs.size;
  const participantsWithHome = places.length;

  return {
    participants_with_home: participantsWithHome,
    represented_counties: representedCounties,
    counties_needing_outreach: Math.max(0, totalCounties - representedCounties),
    school_homes_committed: schoolKeys.size,
    registry: stats,
  };
}
