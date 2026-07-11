import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getInstitutionProvisioning } from "@/lib/provisioning/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    const data = getInstitutionProvisioning(id);
    if (!data) throw new ApiError("RESOURCE_NOT_FOUND", "Institution not found.", 404);
    return apiSuccess(data, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "institutions.view", endpoint: "/api/v1/institutions/{id}/provisioning" }
);
