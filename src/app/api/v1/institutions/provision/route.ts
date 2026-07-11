import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { runProvisioning } from "@/lib/provisioning/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as { request_id: string };
    try {
      const institution = runProvisioning(body.request_id, ctx.actor_id ?? "system");
      return apiSuccess({ institution }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Provisioning failed", 400);
    }
  },
  { permission: "institutions.provision", endpoint: "/api/v1/institutions/provision" }
);
