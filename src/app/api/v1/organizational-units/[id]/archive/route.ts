import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { archiveUnit } from "@/lib/organization/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const unitId = request.nextUrl.pathname.split("/")[3] ?? "";
    try {
      const unit = archiveUnit(unitId, ctx.actor_id ?? "system");
      return apiSuccess({ unit }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Archive failed", 400);
    }
  },
  { permission: "organization.manage", endpoint: "/api/v1/organizational-units/{id}/archive" }
);
