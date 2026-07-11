import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { pauseProvisioning } from "@/lib/provisioning/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json().catch(() => ({}))) as { reason?: string };
    try {
      const institution = pauseProvisioning(id, ctx.actor_id ?? "system", body.reason ?? "Paused");
      return apiSuccess({ institution }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Pause failed", 400);
    }
  },
  { permission: "institutions.provision", endpoint: "/api/v1/institutions/{id}/provisioning/pause" }
);
