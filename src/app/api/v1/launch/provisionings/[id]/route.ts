import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getProvisioning } from "@/lib/launch/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    const record = getProvisioning(id);
    if (!record) throw new ApiError("RESOURCE_NOT_FOUND", "Provisioning record not found.", 404);
    return apiSuccess({ provisioning: record }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "launch.view", endpoint: "/api/v1/launch/provisionings/{id}" }
);
