import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import {
  getOnboardingHealth,
  listAuditEvents,
  listInstitutionInvitations,
  listInstitutionJourneys,
  listJourneyTemplates,
} from "@/lib/onboarding/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.pathname.split("/")[4] ?? "";
    return apiSuccess(
      {
        health: getOnboardingHealth(institutionId),
        templates: listJourneyTemplates(),
        invitations: listInstitutionInvitations(institutionId),
        journeys: listInstitutionJourneys(institutionId),
        audit: listAuditEvents(institutionId).slice(0, 15),
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "onboarding.view", endpoint: "/api/v1/institutions/{institutionId}/onboarding" }
);
