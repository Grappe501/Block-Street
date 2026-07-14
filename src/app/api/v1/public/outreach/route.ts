import { NextResponse } from "next/server";
import { hydrateAuthStore } from "@/lib/auth/data";
import { getOutreachVisibility } from "@/lib/directory/search";

export async function GET() {
  await hydrateAuthStore();
  return NextResponse.json(getOutreachVisibility());
}
