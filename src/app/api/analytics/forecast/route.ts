import { NextResponse } from "next/server";
import { getForecasts } from "@/lib/analytics/engine";

export async function GET() {
  return NextResponse.json({ forecasts: getForecasts() });
}
