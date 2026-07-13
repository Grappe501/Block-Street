import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withEvolutionApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withEvolutionApi(ctx, request, (apiCtx) => ({
      proposals: operationsApplicationService.listOpsEvolutionProposals(apiCtx.institution_id),
      dashboard: operationsApplicationService.getOpsEvolutionDashboard(apiCtx.institution_id),
    })),
  { permission: "evolution.view", endpoint: "/api/v1/evolution" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withEvolutionApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        proposal: string;
        reason: string;
        supporting_evidence?: string[];
        affected_systems: string[];
        implementation_plan: string;
      };
      return operationsApplicationService.createOpsEvolutionProposal({
        institution_id: apiCtx.institution_id,
        proposal: body.proposal,
        reason: body.reason,
        supporting_evidence: body.supporting_evidence ?? [],
        affected_systems: body.affected_systems,
        implementation_plan: body.implementation_plan,
        proposed_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "evolution.manage", endpoint: "/api/v1/evolution" }
);
