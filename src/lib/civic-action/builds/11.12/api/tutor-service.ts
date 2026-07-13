/**
 * CAE-11.12-W5 — AI Tutor API (read-only, permission-aware, assessment-safe)
 */
import { searchKnowledge } from "../integrations/search-projection";
import { AI_TUTOR_PROHIBITED_INTENTS, type KnowledgeApiContext } from "../api/contracts";

export type TutorRequest = {
  learner_question: string;
  course_id_optional?: string | null;
  lesson_id_optional?: string | null;
  competency_id_optional?: string | null;
  protected_assessment_active?: boolean;
};

export type TutorResponse = {
  answer: string;
  summary: string;
  source_references: { entity_id: string; entity_type: string; title: string }[];
  confidence: "low" | "medium" | "high";
  limitations: string[];
  suggested_next_step: string | null;
  cannot_answer_reason_optional: string | null;
  mutation_allowed: false;
};

function detectProhibitedIntent(question: string, protectedAssessment?: boolean): string | null {
  const q = question.toLowerCase();
  if (protectedAssessment) return "exam_answer";
  if (q.includes("answer to question") || q.includes("exam answer") || q.includes("test answer")) {
    return "exam_answer";
  }
  if (q.includes("certify me") || q.includes("award certification")) return "certification_issue";
  if (q.includes("private info about")) return "private_human_data";
  return null;
}

export function runKnowledgeTutorTurn(apiCtx: KnowledgeApiContext, input: TutorRequest): TutorResponse {
  const prohibited = detectProhibitedIntent(input.learner_question, input.protected_assessment_active);
  if (prohibited && AI_TUTOR_PROHIBITED_INTENTS.includes(prohibited as (typeof AI_TUTOR_PROHIBITED_INTENTS)[number])) {
    return {
      answer: "I cannot help with that request under institutional policy.",
      summary: "Request blocked by AI tutor safety boundary.",
      source_references: [],
      confidence: "high",
      limitations: ["Protected assessment answers are never provided."],
      suggested_next_step: "Ask for concept-level help or speak with an instructor.",
      cannot_answer_reason_optional: prohibited,
      mutation_allowed: false,
    };
  }

  const hits = searchKnowledge({
    institution_id: apiCtx.institution_id,
    query: input.learner_question,
    actor_permissions: apiCtx.effective_permissions,
  });

  if (hits.length === 0) {
    return {
      answer: "I do not have authorized sources to answer that question.",
      summary: "No permission-filtered knowledge matched.",
      source_references: [],
      confidence: "low",
      limitations: ["No authorized current knowledge found."],
      suggested_next_step: "Contact a knowledge steward or review assigned learning.",
      cannot_answer_reason_optional: "no_authorized_sources",
      mutation_allowed: false,
    };
  }

  const top = hits[0];
  return {
    answer: `Based on authorized institutional knowledge (${top.title}): ${top.summary}`,
    summary: top.summary,
    source_references: hits.slice(0, 3).map((h) => ({
      entity_id: h.entity_id,
      entity_type: h.entity_type,
      title: h.title,
    })),
    confidence: hits.length > 1 ? "medium" : "low",
    limitations: ["Advisory only — does not issue competency or certification."],
    suggested_next_step: top.is_current ? "Review the cited source in the Knowledge Library." : null,
    cannot_answer_reason_optional: null,
    mutation_allowed: false,
  };
}
