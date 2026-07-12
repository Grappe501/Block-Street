import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getScaffoldProgress } from "@/lib/civic-action/scaffold/ledger";
import { getIniW1Overview, runIniW1Certification } from "@/lib/civic-action/builds/11.1";
import { getIniW2Overview } from "@/lib/civic-action/builds/11.1/w2";
import { getIniW3Overview } from "@/lib/civic-action/builds/11.1/w3";

export const GET = withApiGateway(
  async (ctx, request) => {
    const build = request.nextUrl.searchParams.get("build");
    const wave = request.nextUrl.searchParams.get("wave");

    if (build === "11.1" && wave === "w1") {
      return apiSuccess(getIniW1Overview(), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }

    if (build === "11.1" && wave === "w2") {
      return apiSuccess(getIniW2Overview(), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }

    if (build === "11.1" && wave === "w3") {
      return apiSuccess(getIniW3Overview(), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }

    return apiSuccess(
      {
        scaffold: getScaffoldProgress(),
        ini_w1: runIniW1Certification(),
      },
      {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      }
    );
  },
  { permission: "civic_action.view", endpoint: "/api/v1/civic-action/scaffold" }
);
