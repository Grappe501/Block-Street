import { NextResponse } from "next/server";
import { getConnectors } from "@/lib/relationships/engine";

export async function GET() {
  const connectors = getConnectors();
  return NextResponse.json({ count: connectors.length, connectors });
}
