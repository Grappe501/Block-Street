import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withWorkforceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withWorkforceApi(ctx, request, (apiCtx) => {
      const humanId = request.nextUrl.searchParams.get("human_id") ?? undefined;
      return { assignments: operationsApplicationService.listWorkforceAssignments(apiCtx.institution_id, humanId) };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/workforce/assignments" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withWorkforceApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        mission_id: string;
        human_id: string;
        assigned_role: string;
        assignment_reason: string;
        task_id?: string;
        required_competencies?: string[];
        required_certifications?: string[];
      };
      return operationsApplicationService.createAssignment({
        institution_id: apiCtx.institution_id,
        mission_id: body.mission_id,
        human_id: body.human_id,
        assigned_role: body.assigned_role as "primary_owner",
        assigned_by: apiCtx.actor_human_id,
        assignment_reason: body.assignment_reason,
        task_id: body.task_id,
        required_competencies: body.required_competencies,
        required_certifications: body.required_certifications,
      });
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/workforce/assignments" }
);
