import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import {
  improvementIdFromPath,
  withKnowledgeOptimizationApi,
} from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, (apiCtx) => ({
      pilots: knowledgeOptimizationService.listPilots(apiCtx.institution_id),
      advisory_only: true,
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/improvements/pilots" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        improvement_proposal_id?: string;
        pilot_type?: string;
        scope?: string;
        success_metrics?: string[];
        harm_metrics?: string[];
        stop_conditions?: string[];
      };
      const pilot = knowledgeOptimizationService.createPilot({
        improvement_proposal_id: body.improvement_proposal_id ?? "",
        institution_id: apiCtx.institution_id,
        pilot_type: body.pilot_type ?? "course_pilot",
        scope: body.scope ?? "limited",
        success_metrics: body.success_metrics ?? ["understanding"],
        harm_metrics: body.harm_metrics ?? ["accessibility"],
        stop_conditions: body.stop_conditions ?? ["safety risk"],
      });
      return { pilot, advisory_only: true, production_isolated: true };
    }),
  { permission: "civic_action.edit", endpoint: "/api/v1/improvements/pilots" }
);
