import { NextRequest, NextResponse } from "next/server";
import {
  getHighSchoolsByCounty,
  getInstitutionsByCounty,
  getPrivateCharterSchoolsByCounty,
} from "@/lib/data";

export async function GET(request: NextRequest) {
  const county = request.nextUrl.searchParams.get("county");
  if (!county) return NextResponse.json({ error: "county required" }, { status: 400 });

  const post = getInstitutionsByCounty(county).map((s) => ({
    slug: s.slug,
    name: s.name,
    kind: "school" as const,
  }));
  const hs = getHighSchoolsByCounty(county).map((s) => ({
    slug: s.slug,
    name: s.name,
    kind: "high-school" as const,
  }));
  const priv = getPrivateCharterSchoolsByCounty(county).map((s) => ({
    slug: s.slug,
    name: s.name,
    kind: "private-school" as const,
  }));

  return NextResponse.json({ schools: [...post, ...hs, ...priv] });
}
