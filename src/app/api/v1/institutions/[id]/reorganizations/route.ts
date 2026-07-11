import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { createReorganization, previewReorganization, executeReorganization } from "@/lib/organization/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as { name: string; reason: string; affected_units?: string[] };
    try {
      const plan = createReorganization(institutionId, body.name, body.reason, body.affected_units ?? [], ctx.actor_id ?? "system");
      return apiSuccess({ plan }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Failed", 400);
    }
  },
  { permission: "organization.manage", endpoint: "/api/v1/institutions/{id}/reorganizations" }
);
