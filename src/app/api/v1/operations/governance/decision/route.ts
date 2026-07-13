import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withOrganizationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withOrganizationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        organization_unit_id: string;
        meeting_reference: string;
        proposal: string;
        vote_type: string;
        decision: string;
        authority_id: string;
        effective_date: string;
      };
      return operationsApplicationService.recordGovernanceDecision({
        institution_id: apiCtx.institution_id,
        organization_unit_id: body.organization_unit_id,
        meeting_reference: body.meeting_reference,
        proposal: body.proposal,
        vote_type: body.vote_type as "simple_majority",
        decision: body.decision,
        authority_id: body.authority_id,
        effective_date: body.effective_date,
        recorded_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "organization.manage", endpoint: "/api/v1/operations/governance/decision" }
);
