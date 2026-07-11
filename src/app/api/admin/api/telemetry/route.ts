import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { loadTelemetry } from "@/lib/api/data";
import { readApiAudit } from "@/lib/api/gateway";

export const GET = withAdmin(() => {
  return NextResponse.json({ telemetry: loadTelemetry(), recent_audit: readApiAudit(20) });
});
