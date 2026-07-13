import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        decision_id: string;
        outcome_summary: string;
        reflection: string;
        lessons?: string[];
        best_practices_updated?: string[];
        training_improvements?: string[];
        future_recommendations?: string[];
      };
      return livingIntelligenceApplicationService.recordInstitutionalReflection({
        institution_id: apiCtx.institution_id,
        ...body,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/partnership/reflection" }
);
