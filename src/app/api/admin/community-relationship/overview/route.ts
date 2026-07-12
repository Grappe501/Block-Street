import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  detectIsolation,
  getCollaborationAnalytics,
  getExecutiveDashboard,
  getGraph,
  getMentorshipGraph,
  getRelationshipHealthSummary,
  identifyConnectors,
  listEvents,
  listNodes,
  listRelationshipAudit,
} from "@/lib/community-relationship/engine";
import { loadRelationshipTypes } from "@/lib/community-relationship/data";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? "inst-block-street";
  return NextResponse.json({
    health: getRelationshipHealthSummary(),
    executive: getExecutiveDashboard(institutionId),
    graph: getGraph({ institution_id: institutionId }),
    mentorship: getMentorshipGraph(institutionId),
    collaboration: getCollaborationAnalytics(institutionId),
    connectors: identifyConnectors(institutionId),
    isolation: detectIsolation(institutionId),
    events: listEvents({ institution_id: institutionId, limit: 20 }),
    nodes: listNodes({ institution_id: institutionId }),
    relationship_types: loadRelationshipTypes(),
    institutions,
    institution_id: institutionId,
    audit: listRelationshipAudit(institutionId).slice(0, 30),
  });
});
