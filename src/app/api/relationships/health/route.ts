import { NextResponse } from "next/server";
import { getAlerts, getHealthDashboard } from "@/lib/relationships/engine";

export async function GET() {
  return NextResponse.json({ dashboard: getHealthDashboard(), alerts: getAlerts() });
}
