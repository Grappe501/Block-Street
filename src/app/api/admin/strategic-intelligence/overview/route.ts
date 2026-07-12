import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  getExecutiveStrategicDashboard,
  getStrategicDashboard,
  listStrategicAudit,
  listStrategicInsights,
} from "@/lib/strategic-intelligence/engine";
import { loadDecisions, loadLearningRecords, loadRecommendations, loadWarnings } from "@/lib/strategic-intelligence/data";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? "inst-block-street";
  return NextResponse.json({
    dashboard: getStrategicDashboard(institutionId),
    executive: getExecutiveStrategicDashboard(institutionId),
    insights: listStrategicInsights(institutionId),
    warnings: loadWarnings().filter((w) => w.institution_id === institutionId),
    recommendations: loadRecommendations().filter((r) => r.institution_id === institutionId),
    decisions: loadDecisions().filter((d) => d.institution_id === institutionId),
    learning: loadLearningRecords().filter((l) => l.institution_id === institutionId),
    institutions,
    institution_id: institutionId,
    audit: listStrategicAudit(institutionId).slice(0, 30),
  });
});
