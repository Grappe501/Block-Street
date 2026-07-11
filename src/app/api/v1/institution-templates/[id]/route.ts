import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getTemplate } from "@/lib/provisioning/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[3] ?? "";
    const template = getTemplate(id);
    if (!template) throw new ApiError("RESOURCE_NOT_FOUND", "Template not found.", 404);
    return apiSuccess({ template }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "institutions.view", endpoint: "/api/v1/institution-templates/{id}" }
);
