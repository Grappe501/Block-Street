import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { previewReorganization } from "@/lib/organization/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[3] ?? "";
    try {
      return apiSuccess({ preview: previewReorganization(id) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Preview failed", 400);
    }
  },
  { permission: "organization.view", endpoint: "/api/v1/reorganizations/{id}/preview" }
);
