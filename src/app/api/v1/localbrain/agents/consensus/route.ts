import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        task_id: string;
        positions: { agent_id: string; position: string; confidence: number }[];
        force_state?: string;
      };
      return livingIntelligenceApplicationService.determineAgentConsensus({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        task_id: body.task_id,
        positions: body.positions,
        force_state: body.force_state as Parameters<
          typeof livingIntelligenceApplicationService.determineAgentConsensus
        >[0]["force_state"],
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/agents/consensus" }
);
