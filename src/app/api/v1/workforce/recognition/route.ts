import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withWorkforceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withWorkforceApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        human_id: string;
        recognition_type: "mission_completion" | "volunteer_service" | "training" | "mentoring" | "innovation" | "collaboration" | "leadership" | "years_of_service";
        title: string;
        description: string;
        mission_id?: string;
      };
      return operationsApplicationService.recordRecognition({
        institution_id: apiCtx.institution_id,
        human_id: body.human_id,
        recognition_type: body.recognition_type,
        title: body.title,
        description: body.description,
        mission_id: body.mission_id,
        awarded_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/workforce/recognition" }
);
