import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        agent_id: string;
        name: string;
        source: "internal" | "partner" | "commercial" | "open_source" | "regulated";
        approved_by_human: boolean;
      };
      return livingIntelligenceApplicationService.installAgent({
        institution_id: apiCtx.institution_id,
        agent_id: body.agent_id,
        name: body.name,
        source: body.source,
        approved_by_human: body.approved_by_human,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/agents/install" }
);
