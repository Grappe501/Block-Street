import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { resumeProvisioning } from "@/lib/provisioning/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    try {
      const institution = resumeProvisioning(id, ctx.actor_id ?? "system");
      return apiSuccess({ institution }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Resume failed", 400);
    }
  },
  { permission: "institutions.provision", endpoint: "/api/v1/institutions/{id}/provisioning/resume" }
);
