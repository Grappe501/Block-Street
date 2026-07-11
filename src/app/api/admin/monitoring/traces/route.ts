import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getTraces } from "@/lib/monitoring/engine";

export const GET = withAdmin((_ctx, request: NextRequest) => {
  const correlationId = request.nextUrl.searchParams.get("correlation_id") ?? undefined;
  return NextResponse.json({ traces: getTraces(correlationId) });
});
