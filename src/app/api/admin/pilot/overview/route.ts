import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getPilotHealth, listAuditEvents, listPilotPrograms } from "@/lib/pilot/engine";
import { loadWorkflowCatalog } from "@/lib/pilot/data";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? "inst-block-street";
  return NextResponse.json({
    health: getPilotHealth(institutionId),
    pilots: listPilotPrograms(institutionId),
    workflow_catalog: loadWorkflowCatalog(),
    institutions,
    institution_id: institutionId,
    audit: listAuditEvents(institutionId).slice(0, 20),
  });
});
