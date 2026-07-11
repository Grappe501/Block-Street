import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { moveUnit } from "@/lib/organization/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const unitId = request.nextUrl.pathname.split("/")[3] ?? "";
    const body = (await request.json()) as { new_parent_id: string | null };
    try {
      const unit = moveUnit(unitId, body.new_parent_id, ctx.actor_id ?? "system");
      return apiSuccess({ unit }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Move failed", 400);
    }
  },
  { permission: "organization.manage", endpoint: "/api/v1/organizational-units/{id}/move" }
);
