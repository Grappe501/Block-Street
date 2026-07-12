import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  getFederationHealthSummary,
  listFederationAudit,
  listFederationMembers,
  listReplicatedInstitutions,
  listSharedResources,
  listTemplates,
} from "@/lib/federation/engine";
import { loadTemplateCatalog } from "@/lib/federation/data";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? "inst-block-street";
  return NextResponse.json({
    health: getFederationHealthSummary(),
    templates: listTemplates(),
    template_catalog: loadTemplateCatalog(),
    replicated_institutions: listReplicatedInstitutions(),
    federation_members: listFederationMembers(),
    shared_resources: listSharedResources(),
    institutions,
    institution_id: institutionId,
    audit: listFederationAudit(institutionId).slice(0, 20),
  });
});
