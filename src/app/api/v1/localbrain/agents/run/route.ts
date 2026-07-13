import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        query: string;
        agent_ids?: string[];
        execution_mode?: "parallel" | "sequential";
        simulate_conflict?: boolean;
      };
      return livingIntelligenceApplicationService.runAgentOrchestration({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        query: body.query,
        agent_ids: body.agent_ids,
        execution_mode: body.execution_mode,
        simulate_conflict: body.simulate_conflict,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/agents/run" }
);
