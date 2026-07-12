import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { listWave1Audit } from "@/lib/identity-trust/wave1/lineage";

export const GET = withAdmin((_, request) => {
  const limit = Number(request?.nextUrl.searchParams.get("limit") ?? "100");
  return NextResponse.json({ audit: listWave1Audit(limit) });
});
