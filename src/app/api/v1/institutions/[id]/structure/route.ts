import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getInstitutionStructure } from "@/lib/organization/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.pathname.split("/")[4] ?? "";
    return apiSuccess(
      getInstitutionStructure(institutionId),
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "organization.view", endpoint: "/api/v1/institutions/{id}/structure" }
);
