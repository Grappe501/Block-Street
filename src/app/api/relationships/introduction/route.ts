import { NextRequest, NextResponse } from "next/server";
import { suggestIntroduction } from "@/lib/relationships/engine";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { fromLabel, toLabel, reason, evidence } = body as {
    fromLabel: string;
    toLabel: string;
    reason: string;
    evidence?: string[];
  };
  if (!fromLabel || !toLabel || !reason) {
    return NextResponse.json({ error: "fromLabel, toLabel, reason required" }, { status: 400 });
  }
  const introduction = suggestIntroduction({ fromLabel, toLabel, reason, evidence });
  return NextResponse.json({ ok: true, introduction });
}
