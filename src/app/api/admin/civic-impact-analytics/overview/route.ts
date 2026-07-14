import { NextResponse } from "next/server";
import { getCivicImpactOverview, runAcceptanceCycle } from "@/lib/civic-impact-analytics/engine";

export async function GET() {
  return NextResponse.json({
    overview: getCivicImpactOverview(),
    requirement: "CIA-001",
    acceptance: "AC-201",
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    institution_id?: string;
    county_id?: string;
  };
  if (body.action === "acceptance_cycle") {
    const result = runAcceptanceCycle(body.institution_id || "inst-block-street", body.county_id);
    return NextResponse.json({ ok: true, ...result });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
