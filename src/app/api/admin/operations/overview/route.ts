import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getOperationsHealthSummary, listAuditEvents, listLaunchPlans } from "@/lib/operations/engine";
import { loadPlaybooks } from "@/lib/operations/data";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? "inst-block-street";
  return NextResponse.json({
    health_summary: getOperationsHealthSummary(),
    launch_plans: listLaunchPlans(institutionId),
    playbooks: loadPlaybooks(),
    institutions,
    institution_id: institutionId,
    audit: listAuditEvents(institutionId).slice(0, 20),
  });
});
