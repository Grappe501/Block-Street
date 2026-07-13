import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) =>
      livingIntelligenceApplicationService.listLearningCourses(apiCtx.institution_id)
    ),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/learning/courses" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        title: string;
        curriculum_type: string;
        learning_objective: string;
        competencies: string[];
        governance_owner: string;
      };
      return livingIntelligenceApplicationService.createLearningCourse({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        title: body.title,
        curriculum_type: body.curriculum_type as Parameters<
          typeof livingIntelligenceApplicationService.createLearningCourse
        >[0]["curriculum_type"],
        learning_objective: body.learning_objective,
        competencies: body.competencies,
        governance_owner: body.governance_owner,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/learning/courses" }
);
