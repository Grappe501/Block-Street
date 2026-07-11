import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getUnit, updateUnit, archiveUnit, getAncestors, getDescendants } from "@/lib/organization/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const unitId = request.nextUrl.pathname.split("/")[3] ?? "";
    const unit = getUnit(unitId);
    if (!unit) throw new ApiError("RESOURCE_NOT_FOUND", "Unit not found.", 404);
    return apiSuccess({ unit, ancestors: getAncestors(unitId), descendants: getDescendants(unitId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "organization.view", endpoint: "/api/v1/organizational-units/{id}" }
);

export const PATCH = withApiGateway(
  async (ctx, request) => {
    const unitId = request.nextUrl.pathname.split("/")[3] ?? "";
    const body = (await request.json()) as Record<string, unknown>;
    try {
      const unit = updateUnit(unitId, body as never, ctx.actor_id ?? "system");
      return apiSuccess({ unit }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Update failed", 400);
    }
  },
  { permission: "organization.manage", endpoint: "/api/v1/organizational-units/{id}" }
);
