import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { resolveException } from "@/lib/migration/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const exceptionId = request.nextUrl.pathname.split("/")[3] ?? "";
    const body = (await request.json()) as { resolution: string };
    try {
      const exception = resolveException(exceptionId, body.resolution, ctx.actor_id ?? "system");
      return apiSuccess({ exception }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Resolve failed", 400);
    }
  },
  { permission: "migration.manage", endpoint: "/api/v1/migration-exceptions/{exceptionId}/resolve" }
);
