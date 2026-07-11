import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { loadReorganizations } from "@/lib/organization/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[3] ?? "";
    const plan = loadReorganizations().find((p) => p.id === id);
    if (!plan) throw new ApiError("RESOURCE_NOT_FOUND", "Reorganization not found.", 404);
    return apiSuccess({ plan }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "organization.view", endpoint: "/api/v1/reorganizations/{id}" }
);
