import { NextResponse } from "next/server";
import { getProviderStatus } from "@/lib/auth/providers";

export async function GET() {
  return NextResponse.json({ providers: getProviderStatus() });
}
