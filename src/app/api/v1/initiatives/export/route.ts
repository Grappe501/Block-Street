import { withApiGateway } from "@/lib/api/http";
import { createExportManifest } from "@/lib/civic-action/builds/11.1/integrations/import-export";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as {
          purpose?: string;
          initiative_ids?: string[];
          fields?: string[];
          data_classification?: string;
          format?: "json" | "csv" | "pdf" | "markdown";
          expires_at?: string;
        };
        const expires = body.expires_at ?? new Date(Date.now() + 7 * 86400000).toISOString();
        return createExportManifest({
          purpose: body.purpose ?? "portfolio_export",
          requesting_human_id: apiCtx.actor_human_id,
          institution_id: apiCtx.institution_id,
          initiative_ids: body.initiative_ids ?? [],
          fields: body.fields ?? ["summary"],
          data_classification: body.data_classification ?? "internal",
          format: body.format ?? "json",
          expires_at: expires,
        });
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/initiatives/export" }
);
