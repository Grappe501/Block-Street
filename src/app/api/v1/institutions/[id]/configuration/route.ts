import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getConfiguration, listTemplates, previewTemplate, applyConfigurationTemplate, submitConfigurationDraft, approveConfigurationDraft, activateConfiguration } from "@/lib/organization/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.pathname.split("/")[4] ?? "";
    return apiSuccess(
      { configuration: getConfiguration(institutionId), templates: listTemplates() },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "organization.view", endpoint: "/api/v1/institutions/{id}/configuration" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as { action: string; template_id?: string; draft_id?: string; effective_at?: string; campus_units?: Array<{ name: string; parent_region_key: string; owner: string }> };
    try {
      if (body.action === "preview" && body.template_id) {
        return apiSuccess(previewTemplate(institutionId, body.template_id), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (body.action === "apply_template" && body.template_id) {
        const result = applyConfigurationTemplate({
          institution_id: institutionId,
          template_id: body.template_id,
          actor_id: ctx.actor_id ?? "system",
          campus_units: body.campus_units,
        });
        return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
      }
      if (body.action === "submit" && body.draft_id) {
        return apiSuccess(submitConfigurationDraft(body.draft_id, ctx.actor_id ?? "system"), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (body.action === "approve" && body.draft_id) {
        return apiSuccess({ draft: approveConfigurationDraft(body.draft_id, ctx.actor_id ?? "system", body.effective_at) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (body.action === "activate" && body.draft_id) {
        return apiSuccess({ version: activateConfiguration(body.draft_id, ctx.actor_id ?? "system") }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      throw new Error("Unknown configuration action.");
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Configuration action failed", 400);
    }
  },
  { permission: "organization.manage", endpoint: "/api/v1/institutions/{id}/configuration" }
);
