import { NextRequest, NextResponse } from "next/server";
import { getCounty } from "@/lib/analytics/engine";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const county = getCounty(slug);
  if (!county) {
    return NextResponse.json({ error: "County not found" }, { status: 404 });
  }
  return NextResponse.json({ county });
}
