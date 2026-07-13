import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import { withKnowledgeOptimizationApi } from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        candidate_type?: string;
        source_type?: string;
        source_id?: string;
        title?: string;
        problem_statement?: string;
        evidence_references?: { signal_id: string; source: string; summary: string }[];
      };
      const candidate = knowledgeOptimizationService.createCandidate({
        institution_id: apiCtx.institution_id,
        candidate_type: (body.candidate_type as "knowledge_revision") ?? "knowledge_revision",
        source_type: (body.source_type as "human_suggestion") ?? "human_suggestion",
        source_id: body.source_id ?? "api",
        title: body.title ?? "Improvement candidate",
        problem_statement: body.problem_statement ?? "",
        evidence_references: body.evidence_references ?? [],
        identified_by_human_id: apiCtx.actor_human_id,
      });
      return { candidate, advisory_only: true, canonical_mutation_allowed: false };
    }),
  { permission: "civic_action.edit", endpoint: "/api/v1/improvements/candidates" }
);
