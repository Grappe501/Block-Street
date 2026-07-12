import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { deployRelease, rollbackRelease } from "@/lib/operations/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      action?: string;
      release_id?: string;
      institution_id: string;
      version?: string;
      release_type?: string;
      features?: string[];
      reason?: string;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      if (body.action === "rollback" && body.release_id) {
        return apiSuccess({ release: rollbackRelease(body.release_id, body.reason ?? "Regression detected", actorId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      const release = deployRelease({
        institution_id: body.institution_id,
        version: body.version ?? "1.0.0-ops",
        release_type: body.release_type ?? "minor",
        features: body.features ?? ["operational dashboards", "adoption analytics"],
        actor_id: actorId,
      });
      return apiSuccess({ release }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Release action failed", 400);
    }
  },
  { permission: "operations.launch", endpoint: "/api/v1/operations/releases" }
);
