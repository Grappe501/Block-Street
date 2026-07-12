import { withApiGateway } from "@/lib/api/http";
import { createImportPreviewJob } from "@/lib/civic-action/builds/11.1/integrations/import-export";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as {
          source_type?: string;
          source_reference?: string;
          rows?: Record<string, unknown>[];
        };
        return createImportPreviewJob({
          institution_id: apiCtx.institution_id,
          source_type: body.source_type ?? "legacy_spreadsheet",
          source_reference: body.source_reference ?? "upload",
          requested_by: apiCtx.actor_human_id,
          rows: body.rows ?? [],
        });
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/initiatives/import" }
);
