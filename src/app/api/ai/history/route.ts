import { NextResponse } from "next/server";
import { getAuditHistory, getMetrics } from "@/lib/ai/engine";

export async function GET() {
  return NextResponse.json({ history: getAuditHistory(), metrics: getMetrics() });
}
