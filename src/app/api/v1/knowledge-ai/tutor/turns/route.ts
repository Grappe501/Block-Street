import { withApiGateway } from "@/lib/api/http";
import { runKnowledgeTutorTurn } from "@/lib/civic-action/builds/11.12/api/tutor-service";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as {
          learner_question: string;
          course_id_optional?: string;
          lesson_id_optional?: string;
          protected_assessment_active?: boolean;
        };
        return runKnowledgeTutorTurn(apiCtx, body);
      },
      { requireAuth: true }
    ),
  { permission: "training.view", endpoint: "/api/v1/knowledge-ai/tutor/turns" }
);
