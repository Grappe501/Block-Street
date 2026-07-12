import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  getEngagementTrends,
  getParticipationHealthSummary,
  listCivicAudit,
  listParticipationEvents,
  listParticipationScores,
} from "@/lib/civic/engine";
import { loadParticipationCatalog } from "@/lib/civic/data";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? "inst-block-street";
  return NextResponse.json({
    health: getParticipationHealthSummary(),
    scores: listParticipationScores(institutionId),
    trends: getEngagementTrends(institutionId),
    events: listParticipationEvents(institutionId).slice(0, 20),
    catalog: loadParticipationCatalog(),
    institutions,
    institution_id: institutionId,
    community_id: "comm-pulaski-central",
    audit: listCivicAudit(institutionId).slice(0, 20),
  });
});
