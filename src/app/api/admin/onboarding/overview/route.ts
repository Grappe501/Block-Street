import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  getOnboardingHealth,
  listAuditEvents,
  listInstitutionInvitations,
  listInstitutionJourneys,
  listJourneyTemplates,
} from "@/lib/onboarding/engine";
import { loadInstitutions } from "@/lib/provisioning/data";

export const GET = withAdmin(() => {
  const institutions = loadInstitutions();
  const institutionId = institutions[institutions.length - 1]?.id ?? null;
  return NextResponse.json({
    health: getOnboardingHealth(institutionId ?? undefined),
    templates: listJourneyTemplates(),
    invitations: institutionId ? listInstitutionInvitations(institutionId) : [],
    journeys: institutionId ? listInstitutionJourneys(institutionId) : [],
    institutions,
    institution_id: institutionId,
    audit: listAuditEvents(institutionId ?? undefined).slice(0, 15),
  });
});
