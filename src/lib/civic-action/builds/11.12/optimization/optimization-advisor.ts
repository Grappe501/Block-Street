/**
 * CAE-11.12-W7 — Optimization advisor (blocks self-implementation)
 */
import { OPTIMIZATION_PROHIBITED_ACTIONS } from "./contracts";
import { generateContinuousImprovements } from "./continuous-improvement";
import { buildStewardWorkQueue } from "./stewardship-operations";
import { measureKnowledgeMaturity } from "./maturity";
import { runImprovementSimulation } from "./simulation-engine";

export type OptimizationAdvisorResponse = {
  answer: string;
  related_optimizations?: string[];
  evidence?: string[];
  confidence?: string;
  advisory_only: true;
  blocked?: boolean;
  block_reason?: string;
  canonical_mutation_allowed: false;
};

const BLOCK_PATTERNS = [/publish/i, /auto.?implement/i, /verify competency/i, /award certification/i, /rewrite/i, /erase/i];

export function queryOptimizationAdvisor(institutionId: string, question: string): OptimizationAdvisorResponse {
  for (const pattern of BLOCK_PATTERNS) {
    if (pattern.test(question)) {
      return {
        answer: `I cannot perform that action. Improvements require Human approval and Wave 3 commands. Prohibited: ${OPTIMIZATION_PROHIBITED_ACTIONS.slice(0, 5).join(", ")}...`,
        advisory_only: true,
        blocked: true,
        block_reason: "prohibited_self_implementation",
        canonical_mutation_allowed: false,
      };
    }
  }

  const q = question.toLowerCase();
  if (q.includes("maturity") || q.includes("learning health")) {
    const m = measureKnowledgeMaturity(institutionId);
    return {
      answer: `Institutional knowledge maturity: ${m.level} (score ${m.score}). No individual Human rankings.`,
      confidence: "high",
      advisory_only: true,
      canonical_mutation_allowed: false,
    };
  }

  if (q.includes("steward") || q.includes("queue")) {
    const queue = buildStewardWorkQueue(institutionId);
    return {
      answer: `Steward queue: ${queue.length} work items across reviews, evidence, and gaps.`,
      evidence: queue.map((w) => w.title),
      advisory_only: true,
      canonical_mutation_allowed: false,
    };
  }

  if (q.includes("simulate") || q.includes("what if")) {
    const sim = runImprovementSimulation(institutionId, {
      scenario_type: q.includes("certification") ? "certification_transition" : "course_revision",
      parameters: {},
    });
    return {
      answer: sim.outcomes.join(" "),
      evidence: sim.assumptions,
      confidence: "medium",
      advisory_only: true,
      canonical_mutation_allowed: false,
    };
  }

  const opts = generateContinuousImprovements(institutionId);
  return {
    answer: opts.length
      ? `Top improvement: ${opts[0]!.title} — ${opts[0]!.why}`
      : "No pending improvements at current thresholds.",
    related_optimizations: opts.slice(0, 3).map((o) => o.optimization_id),
    confidence: opts[0]?.confidence ?? "low",
    advisory_only: true,
    canonical_mutation_allowed: false,
  };
}
