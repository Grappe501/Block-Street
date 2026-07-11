import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getTrainingHealth, listAuditEvents, listLearningPaths } from "@/lib/training/engine";
import { loadCertificationDefinitions } from "@/lib/training/data";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? "inst-block-street";
  return NextResponse.json({
    health: getTrainingHealth(institutionId),
    learning_paths: listLearningPaths(institutionId),
    certifications: loadCertificationDefinitions(),
    institutions,
    institution_id: institutionId,
    audit: listAuditEvents(institutionId).slice(0, 15),
  });
});
