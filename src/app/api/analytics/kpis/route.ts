import { NextResponse } from "next/server";
import { listKpis } from "@/lib/analytics/engine";

export async function GET() {
  return NextResponse.json({ kpis: listKpis() });
}
