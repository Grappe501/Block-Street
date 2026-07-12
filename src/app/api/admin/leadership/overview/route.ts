import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  getExecutiveDashboard,
  getLeadershipHealthSummary,
  listCohorts,
  listEvidence,
  listLeadershipAudit,
  listLeadershipProfiles,
  listSuccessionPlans,
} from "@/lib/leadership/engine";
import { loadCompetencyCatalog } from "@/lib/leadership/data";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? "inst-block-street";
  return NextResponse.json({
    health: getLeadershipHealthSummary(),
    executive: getExecutiveDashboard(institutionId),
    profiles: listLeadershipProfiles(institutionId),
    evidence: listEvidence(undefined, institutionId).slice(0, 20),
    cohorts: listCohorts(institutionId),
    succession_plans: listSuccessionPlans(institutionId),
    competency_catalog: loadCompetencyCatalog(),
    institutions,
    institution_id: institutionId,
    audit: listLeadershipAudit(institutionId).slice(0, 30),
  });
});
