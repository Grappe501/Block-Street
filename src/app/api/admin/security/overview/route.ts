import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getSecurityOverview, getSecurityPosture } from "@/lib/security/engine";

export const GET = withAdmin(() => {
  return NextResponse.json({ overview: getSecurityOverview(), posture: getSecurityPosture() });
});
