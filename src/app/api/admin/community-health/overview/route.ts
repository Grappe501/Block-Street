import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  detectCommunityRisks,
  getExecutiveCommunityDashboard,
  getGeographicHealthMap,
  listCommunityHealthAudit,
  listCommunityHealthProfiles,
  mapCommunityOpportunities,
} from "@/lib/community-health/engine";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? "inst-block-street";
  const countyId = "pulaski";
  const communityId = "community-pulaski-central";
  return NextResponse.json({
    profiles: listCommunityHealthProfiles(countyId),
    executive: getExecutiveCommunityDashboard(countyId),
    geographic: getGeographicHealthMap(countyId),
    risks: detectCommunityRisks(communityId, institutionId),
    opportunities: mapCommunityOpportunities(communityId, institutionId),
    institutions,
    institution_id: institutionId,
    county_id: countyId,
    community_id: communityId,
    audit: listCommunityHealthAudit(countyId).slice(0, 30),
  });
});
