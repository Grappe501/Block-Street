import { NextResponse } from "next/server";
import { getResearchLabOverview, runAcceptanceDemo } from "@/lib/research-policy-lab/engine";

export async function GET() {
  return NextResponse.json({
    overview: getResearchLabOverview(),
    requirement: "RPL-001",
    acceptance: "AC-200",
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    institution_id?: string;
    sponsor_email?: string;
  };
  if (body.action === "acceptance_demo") {
    const result = runAcceptanceDemo(
      body.institution_id || "inst-block-street",
      body.sponsor_email || "grappe4arkansas@gmail.com"
    );
    return NextResponse.json({ ok: true, ...result });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
