import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) =>
      livingIntelligenceApplicationService.listDecisionOutcomes(apiCtx.institution_id)
    ),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/partnership/outcomes" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        decision_id: string;
        decision_subject: string;
        expected_outcome: string;
        actual_outcome: string;
        variance?: string;
        lessons_learned?: string[];
        unexpected_consequences?: string[];
        evidence_quality?: number;
        recommendation_improvements?: string[];
      };
      return livingIntelligenceApplicationService.recordDecisionOutcome({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        ...body,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/partnership/outcome" }
);
