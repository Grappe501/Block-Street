import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { listIncidents } from "@/lib/security/engine";

export const GET = withAdmin(() => {
  return NextResponse.json({ incidents: listIncidents() });
});
