import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  getExecutiveOutcomeDashboard,
  getOutcomeDashboard,
  listOutcomeAudit,
  listOutcomeRecords,
} from "@/lib/civic-outcomes/engine";
import { loadIndicatorCatalog, loadTheoryOfChange } from "@/lib/civic-outcomes/data";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? "inst-block-street";
  return NextResponse.json({
    dashboard: getOutcomeDashboard(institutionId),
    executive: getExecutiveOutcomeDashboard(institutionId),
    outcomes: listOutcomeRecords({ institution_id: institutionId }),
    theory_of_change: loadTheoryOfChange(),
    indicator_catalog: loadIndicatorCatalog(),
    institutions,
    institution_id: institutionId,
    audit: listOutcomeAudit(institutionId).slice(0, 30),
  });
});
