import { NextResponse } from "next/server";
import { getAlerts } from "@/lib/analytics/engine";

export async function GET() {
  return NextResponse.json({ alerts: getAlerts() });
}
