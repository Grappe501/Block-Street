import { withApiGateway } from "@/lib/api/http";
import { queryCertificationEligibility } from "@/lib/civic-action/builds/11.12/api";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, (apiCtx) => {
      const certificationId = request.nextUrl.searchParams.get("certification_id");
      if (!certificationId) {
        return { error: "certification_id required" };
      }
      return queryCertificationEligibility(apiCtx, certificationId);
    }),
  { permission: "training.view", endpoint: "/api/v1/certifications/eligibility" }
);
