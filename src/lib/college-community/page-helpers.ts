import { notFound } from "next/navigation";
import { getCollege, listColleges } from "@/lib/college-community/institutions";
import type { Institution } from "@/lib/data";

export function collegeStaticParams() {
  return listColleges().map((c) => ({ collegeSlug: c.slug }));
}

export function requireCollege(slug: string): Institution {
  const college = getCollege(slug);
  if (!college) notFound();
  return college;
}
