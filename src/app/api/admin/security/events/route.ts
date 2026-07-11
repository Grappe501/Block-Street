import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { listSecurityEvents } from "@/lib/security/engine";

export const GET = withAdmin(() => {
  return NextResponse.json({ events: listSecurityEvents() });
});
