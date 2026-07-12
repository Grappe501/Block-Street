import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import {
  getCountyDashboard,
  getFederationParticipationAnalytics,
  getOrganizationDashboard,
  getUserDashboard,
} from "@/lib/civic/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const scope = request.nextUrl.searchParams.get("scope") ?? "user";
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    const userId = request.nextUrl.searchParams.get("user_id");
    const countyId = request.nextUrl.searchParams.get("county_id") ?? "county-pulaski";

    if (scope === "federation") {
      return apiSuccess({ federation: getFederationParticipationAnalytics() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (scope === "county") {
      return apiSuccess({ county: getCountyDashboard(countyId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (scope === "organization" && institutionId) {
      return apiSuccess({ organization: getOrganizationDashboard(institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (scope === "user" && userId && institutionId) {
      return apiSuccess({ user: getUserDashboard(userId, institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    throw new ApiError("INVALID_REQUEST", "Invalid dashboard scope or missing parameters", 400);
  },
  { permission: "civic.view", endpoint: "/api/v1/civic/dashboard" }
);
