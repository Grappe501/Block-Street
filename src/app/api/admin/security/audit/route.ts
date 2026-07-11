import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getSecurityAudit } from "@/lib/security/engine";

export const GET = withAdmin(() => {
  return NextResponse.json({ audit: getSecurityAudit() });
});
