import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { validateOrganizationConfiguration } from "@/lib/organization/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.pathname.split("/")[4] ?? "";
    try {
      const validation = validateOrganizationConfiguration(institutionId, ctx.actor_id ?? "system");
      return apiSuccess({ validation }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Validation failed", 400);
    }
  },
  { permission: "organization.manage", endpoint: "/api/v1/institutions/{id}/configuration/validate" }
);
