import { NextResponse } from "next/server";
import { getCounties } from "@/lib/data";

/** Public launch helper — county list for choose-place (no auth). */
export async function GET() {
  const counties = getCounties().map((c) => ({
    slug: c.slug,
    name: c.name,
  }));
  return NextResponse.json({ counties });
}
