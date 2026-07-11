import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getOrganizationHealth, listTemplates, listAuditEvents } from "@/lib/organization/engine";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? null;
  return NextResponse.json({
    health: getOrganizationHealth(institutionId ?? undefined),
    templates: listTemplates(),
    institutions,
    institution_id: institutionId,
    audit: listAuditEvents(institutionId ?? undefined).slice(0, 15),
  });
});
