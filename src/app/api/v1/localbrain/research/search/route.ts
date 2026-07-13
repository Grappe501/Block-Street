import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        query: string;
        domain: string;
        source_id: string;
        evidence_type?: string;
      };
      return livingIntelligenceApplicationService.searchResearch({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        query: body.query,
        domain: body.domain as Parameters<typeof livingIntelligenceApplicationService.searchResearch>[0]["domain"],
        source_id: body.source_id,
        evidence_type: body.evidence_type as "canonical" | "verified" | "news" | "inference" | undefined,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/research/search" }
);
