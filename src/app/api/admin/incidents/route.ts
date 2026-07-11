import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { loadIncidents } from "@/lib/admin/data";
import { withAdmin } from "@/lib/admin/http";
import { adminAudit, assertAdminPermission } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "incidents.manage");
  return NextResponse.json({ incidents: loadIncidents() });
});

export const POST = withAdmin(async (ctx, request) => {
  assertAdminPermission(ctx, "incidents.manage");
  const body = await request.json();
  const incident = {
    id: `inc-${randomBytes(4).toString("hex")}`,
    ...body,
    status: "open",
    created_at: new Date().toISOString(),
    owner: ctx.user_id,
  };
  adminAudit(ctx, "incident_opened", "incident", incident.id, "success", { risk_level: "high" });
  return NextResponse.json({ ok: true, incident });
});
