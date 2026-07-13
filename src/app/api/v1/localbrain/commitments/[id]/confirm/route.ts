import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const commitmentId = request.nextUrl.pathname.split("/")[5] ?? "";
      const body = (await request.json()) as { due_at?: string; commitment_text?: string };
      return livingIntelligenceApplicationService.confirmExecutiveCommitment(
        commitmentId,
        apiCtx.human_id,
        body
      );
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/commitments/{id}/confirm" }
);
