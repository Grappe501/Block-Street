/**
 * CAE-11.7-W7 — Pattern recognition for optimization
 */
import { detectCommunicationPatterns } from "../intelligence/pattern-engine";
import { detectCollaborationFlowPatterns } from "../intelligence/collaboration-intelligence";
import { extractLessons } from "./lesson-engine";

export type OptimizationPattern = {
  pattern_id: string;
  pattern_type: string;
  description: string;
  evidence: string;
  confidence: string;
};

export function detectOptimizationPatterns(
  institutionId: string,
  initiativeId?: string
): OptimizationPattern[] {
  const patterns = detectCommunicationPatterns(institutionId, initiativeId);
  const flows = detectCollaborationFlowPatterns(institutionId, initiativeId);
  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);

  const results: OptimizationPattern[] = patterns.map((p) => ({
    pattern_id: p.pattern_id,
    pattern_type: p.pattern_type,
    description: p.description,
    evidence: p.evidence,
    confidence: p.confidence,
  }));

  for (const flow of flows) {
    results.push({
      pattern_id: flow.pattern_id,
      pattern_type: "collaboration_flow",
      description: flow.description,
      evidence: flow.evidence,
      confidence: "medium",
    });
  }

  if (lessons.length >= 3) {
    results.push({
      pattern_id: "pat-lesson-accumulation",
      pattern_type: "institutional_learning",
      description: `${lessons.length} structured lessons available for template and playbook evolution.`,
      evidence: lessons.slice(0, 2).map((l) => l.observation.slice(0, 60)).join("; "),
      confidence: "strong_pattern",
    });
  }

  return results;
}
