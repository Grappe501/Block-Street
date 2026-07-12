import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { listTemplates, publishTemplate } from "@/lib/federation/engine";
import type { TemplateType } from "@/lib/federation/types";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess({ templates: listTemplates(institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "federation.view", endpoint: "/api/v1/federation/templates" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      source_institution_id: string;
      name: string;
      description: string;
      template_type: TemplateType;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      const template = publishTemplate({ ...body, actor_id: actorId });
      return apiSuccess({ template }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Template publish failed", 400);
    }
  },
  { permission: "federation.publish", endpoint: "/api/v1/federation/templates" }
);
