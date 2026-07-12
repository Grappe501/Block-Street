import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  getCountyDashboard,
  getEngagementTrends,
  getFederationParticipationAnalytics,
  getOrganizationDashboard,
  getParticipationHealthSummary,
  listCivicAudit,
  listParticipationEvents,
  listParticipationScores,
  listUserParticipationScores,
} from "@/lib/civic/engine";
import { loadMilestoneCatalog, loadParticipationCatalog, loadParticipationWeights } from "@/lib/civic/data";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? "inst-block-street";
  const countyId = "county-pulaski";
  return NextResponse.json({
    health: getParticipationHealthSummary(),
    scores: listParticipationScores(institutionId),
    user_scores: listUserParticipationScores(institutionId),
    trends: getEngagementTrends(institutionId),
    events: listParticipationEvents(institutionId).slice(0, 20),
    organization_dashboard: getOrganizationDashboard(institutionId),
    county_dashboard: getCountyDashboard(countyId),
    federation_analytics: getFederationParticipationAnalytics(),
    catalog: loadParticipationCatalog(),
    weights: loadParticipationWeights(),
    milestone_catalog: loadMilestoneCatalog(),
    institutions,
    institution_id: institutionId,
    community_id: "comm-pulaski-central",
    county_id: countyId,
    audit: listCivicAudit(institutionId).slice(0, 30),
  });
});
