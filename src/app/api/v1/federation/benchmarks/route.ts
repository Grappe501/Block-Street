import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getBenchmarkComparison, updateBenchmarks } from "@/lib/federation/engine";

export const GET = withApiGateway(
  async (ctx) => {
    return apiSuccess({ benchmarks: getBenchmarkComparison() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "federation.view", endpoint: "/api/v1/federation/benchmarks" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as { institution_id: string; metrics?: Record<string, number> };
    const snapshots = updateBenchmarks(body.institution_id, body.metrics ?? {});
    return apiSuccess({ benchmarks: snapshots.map(({ institution_id: _id, ...rest }) => rest) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "federation.manage", endpoint: "/api/v1/federation/benchmarks" }
);
