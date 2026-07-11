import { NextResponse } from "next/server";
import { getRecommendations } from "@/lib/relationships/engine";

export async function GET() {
  return NextResponse.json(getRecommendations());
}
