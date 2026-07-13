import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        domain: string;
        query: string;
        source_ids: string[];
        schedule?: string;
      };
      return livingIntelligenceApplicationService.startResearchMonitor({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        domain: body.domain as Parameters<typeof livingIntelligenceApplicationService.startResearchMonitor>[0]["domain"],
        query: body.query,
        source_ids: body.source_ids,
        schedule: body.schedule,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/research/monitor" }
);
