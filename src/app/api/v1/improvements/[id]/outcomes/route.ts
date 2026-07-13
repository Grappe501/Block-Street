import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import {
  improvementIdFromPath,
  withKnowledgeOptimizationApi,
} from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, async (apiCtx) => {
      const id = improvementIdFromPath(request, "improvements");
      const body = (await request.json()) as {
        outcome_category?: string;
        expected_benefit?: string;
        observed_outcome?: string;
        unintended_effects?: string[];
      };
      const outcome = knowledgeOptimizationService.recordOutcome({
        improvement_proposal_id: id,
        institution_id: apiCtx.institution_id,
        outcome_category: (body.outcome_category as "improved") ?? "improved",
        expected_benefit: body.expected_benefit ?? "",
        observed_outcome: body.observed_outcome ?? "",
        unintended_effects: body.unintended_effects,
      });
      return { outcome, advisory_only: true };
    }),
  { permission: "civic_action.edit", endpoint: "/api/v1/improvements/[id]/outcomes" }
);
