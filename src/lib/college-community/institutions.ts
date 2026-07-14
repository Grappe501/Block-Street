import { getInstitutionBySlug, getInstitutions, type Institution } from "@/lib/data";

export function listColleges(): Institution[] {
  return getInstitutions()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCollege(slug: string): Institution | null {
  return getInstitutionBySlug(slug) ?? null;
}
