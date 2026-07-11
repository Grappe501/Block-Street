import { NextResponse } from "next/server";
import { getNetworkAnalysis } from "@/lib/relationships/engine";

export async function GET() {
  return NextResponse.json({ network: getNetworkAnalysis() });
}
