import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getMigrationHealth, getAttentionQueue, listAuditEvents, listProjects } from "@/lib/migration/engine";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? null;
  return NextResponse.json({
    health: getMigrationHealth(institutionId ?? undefined),
    attention: getAttentionQueue(institutionId ?? undefined),
    projects: listProjects(institutionId ?? undefined),
    institutions,
    institution_id: institutionId,
    audit: listAuditEvents().slice(0, 15),
  });
});
