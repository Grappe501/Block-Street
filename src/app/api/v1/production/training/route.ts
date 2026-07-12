import { withApiGateway } from "@/lib/api/http";
import { institutionalProductionService } from "@/lib/civic-action/builds/11.1/production";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(ctx, request, () => ({
      modules: institutionalProductionService.getTraining(),
      support_documentation: institutionalProductionService.getSupportDocs(),
      verification_schedules: institutionalProductionService.getVerificationSchedules(),
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/production/training" }
);
