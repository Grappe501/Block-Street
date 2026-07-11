import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { loadRecentAudit } from "@/lib/deployment/data";

export const GET = withAdmin(() => {
  return NextResponse.json({ audit: loadRecentAudit(50) });
});
