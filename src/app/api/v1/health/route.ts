import { NextResponse } from "next/server";
import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getApiOverview } from "@/lib/api/gateway";
import { loadApiVersions } from "@/lib/api/data";

export const GET = withApiGateway(
  (ctx) => {
    const version = loadApiVersions().find((v) => v.status === "active");
    return apiSuccess(
      { status: "operational", version: version?.version ?? "v1", overview: getApiOverview() },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { public: true, endpoint: "/api/v1/health" }
);
