import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getExecutiveOutcomeDashboard, listOutcomeRecords } from "@/lib/civic-outcomes/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    if (!institutionId) throw new Error("institution_id is required");
    return apiSuccess(
      {
        outcomes: listOutcomeRecords({ institution_id: institutionId }),
        executive: getExecutiveOutcomeDashboard(institutionId),
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "civic_outcomes.view", endpoint: "/api/v1/civic-outcomes/analytics" }
);
