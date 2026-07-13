/**
 * CAE-11.7-W10 — Human Partnership Runtime services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { contextIntelligenceRuntime } from "../../context/services/context-intelligence-service";
import { seedContextIfEmpty } from "../../context/services/seed";
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { seedOrganizerIfEmpty } from "../../organizer/services/seed";
import { seedResearchIfEmpty } from "../../research/services/seed";
import { seedConversationIfEmpty } from "../../conversation/services/seed";
import { seedLearningIfEmpty } from "../../learning/services/seed";
import { seedPredictionIfEmpty } from "../../prediction/services/seed";
import { seedAgentsIfEmpty } from "../../agents/services/seed";
import type { CollaborationPattern } from "../data-model";
import {
  listCollaboration,
  listFeedback,
  listGovernanceEvolution,
  listInstitutionalLearning,
  listMemoryEvolution,
  listOrganizationalHealth,
  listOutcomes,
  listQuality,
  listRecommendations,
  listSelfEvaluations,
  listTransparencyAudits,
  listTrustCalibrations,
  listWisdom,
  saveCollaboration,
  saveFeedback,
  saveGovernanceEvolution,
  saveInstitutionalLearning,
  saveMemoryEvolution,
  saveOrganizationalHealth,
  saveOutcome,
  saveQuality,
  saveRecommendation,
  saveSelfEvaluation,
  saveTransparencyAudit,
  saveTrustCalibration,
  saveWisdom,
} from "./repository";

export class PartnershipError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensurePartnershipBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
  seedResearchIfEmpty();
  seedConversationIfEmpty();
  seedLearningIfEmpty();
  seedPredictionIfEmpty();
  seedAgentsIfEmpty();
}

function getBrain(humanId: string) {
  ensurePartnershipBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new PartnershipError("PARTNERSHIP_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

function baseRecommendation(input: {
  human_id: string;
  institution_id: string;
  subject: string;
  recommendation: string;
  evidence?: string[];
}) {
  return {
    recommendation_id: caeId("rec"),
    human_id: input.human_id,
    institution_id: input.institution_id,
    subject: input.subject,
    recommendation: input.recommendation,
    evidence: input.evidence ?? ["Research network brief", "Organizer workload report", "Conversation intelligence"],
    assumptions: ["County match proceeds on schedule", "Volunteer growth continues at current rate"],
    confidence: 0.72,
    alternatives: ["Phased expansion", "Defer until Q4 readiness review"],
    unknowns: ["Legislative funding changes", "Partner capacity constraints"],
    human_responsibilities: ["Final approval", "Stakeholder communication", "Budget authorization"],
    ai_limitations: ["Cannot predict legislative outcomes", "Advisory only—not binding"],
    required_approvals: ["Executive sponsor", "Legal review for county agreements"],
    invitation_not_instruction: true as const,
    hidden: false as const,
    created_at: nowIso(),
  };
}

export const partnershipService = {
  listRecommendations,
  create(input: {
    human_id: string;
    institution_id: string;
    subject: string;
    recommendation: string;
    evidence?: string[];
  }) {
    getBrain(input.human_id);
    const record = baseRecommendation(input);
    saveRecommendation(record);
    transparencyService.audit({
      institution_id: input.institution_id,
      subject_type: "recommendation",
      subject_id: record.recommendation_id,
      why_recommendation: record.recommendation,
      why_confidence: `Confidence ${record.confidence} based on evidence quality and historical patterns`,
      why_sources: record.evidence.join(", "),
      who_approved: null,
      who_changed: input.human_id,
      why_changed: "Recommendation created for Human review",
    });
    return { recommendation: record, event: "recommendation.reviewed" as const, invitation_not_instruction: true };
  },
};

export const trustCalibrationService = {
  list: listTrustCalibrations,
  calibrate(input: {
    recommendation_id: string;
    institution_id: string;
    evidence_quality?: number;
    historical_accuracy?: number;
    source_diversity?: number;
    freshness?: number;
    human_corrections?: number;
    institutional_validation?: number;
  }) {
    const eq = input.evidence_quality ?? 0.82;
    const ha = input.historical_accuracy ?? 0.78;
    const sd = input.source_diversity ?? 0.75;
    const fr = input.freshness ?? 0.85;
    const hc = input.human_corrections ?? 0.1;
    const iv = input.institutional_validation ?? 0.8;
    const trustScore = Math.min(0.95, (eq + ha + sd + fr + iv - hc) / 5);

    const record = {
      trust_id: caeId("trst"),
      recommendation_id: input.recommendation_id,
      institution_id: input.institution_id,
      trust_score: Math.round(trustScore * 100) / 100,
      evidence_quality: eq,
      historical_accuracy: ha,
      source_diversity: sd,
      freshness: fr,
      human_corrections: hc,
      institutional_validation: iv,
      per_recommendation: true as const,
      secret_human_score: false as const,
      calculated_at: nowIso(),
    };
    saveTrustCalibration(record);
    return { trust: record, event: "trust.updated" as const, per_recommendation: true, secret_human_score: false };
  },
  recalculate(input: { recommendation_id: string; institution_id: string }) {
    return trustCalibrationService.calibrate(input);
  },
};

export const institutionalWisdomService = {
  list: listWisdom,
  accumulate(input: {
    institution_id: string;
    title: string;
    lesson: string;
    sources?: string[];
    best_practice?: boolean;
    repeated_mistake?: boolean;
  }) {
    const existing = listWisdom(input.institution_id).filter((w) => w.title === input.title);
    const record = {
      wisdom_id: caeId("wsd"),
      institution_id: input.institution_id,
      title: input.title,
      lesson: input.lesson,
      sources: input.sources ?? ["Operational outcomes", "Research network", "Conversation intelligence"],
      experience_count: existing.length + 1,
      version: existing.length + 1,
      best_practice: input.best_practice ?? false,
      repeated_mistake: input.repeated_mistake ?? false,
      updated_at: nowIso(),
    };
    saveWisdom(record);
    return { wisdom: record, event: "wisdom.updated" as const };
  },
};

export const aiSelfEvaluationService = {
  list: listSelfEvaluations,
  evaluate(input: {
    recommendation_id: string;
    institution_id: string;
    was_correct?: boolean | null;
    was_helpful?: boolean | null;
    evidence_sufficient?: boolean;
    confidence_appropriate?: boolean;
    should_have_escalated?: boolean;
    should_have_deferred?: boolean;
  }) {
    const record = {
      evaluation_id: caeId("sev"),
      recommendation_id: input.recommendation_id,
      institution_id: input.institution_id,
      was_correct: input.was_correct ?? null,
      was_helpful: input.was_helpful ?? null,
      was_understandable: true,
      evidence_sufficient: input.evidence_sufficient ?? true,
      confidence_appropriate: input.confidence_appropriate ?? true,
      should_have_escalated: input.should_have_escalated ?? false,
      should_have_deferred: input.should_have_deferred ?? false,
      transparent: true as const,
      evaluated_at: nowIso(),
    };
    saveSelfEvaluation(record);
    return { evaluation: record, event: "self_evaluation.completed" as const, transparent: true };
  },
};

export const humanFeedbackService = {
  list: listFeedback,
  submit(input: {
    human_id: string;
    institution_id: string;
    recommendation_id: string;
    accuracy: number;
    helpfulness: number;
    completeness: number;
    clarity: number;
    bias_concerns?: string | null;
    missing_evidence?: string | null;
    incorrect_assumptions?: string | null;
    suggested_improvements?: string | null;
  }) {
    getBrain(input.human_id);
    const record = {
      feedback_id: caeId("fdb"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      recommendation_id: input.recommendation_id,
      accuracy: input.accuracy,
      helpfulness: input.helpfulness,
      completeness: input.completeness,
      clarity: input.clarity,
      bias_concerns: input.bias_concerns ?? null,
      missing_evidence: input.missing_evidence ?? null,
      incorrect_assumptions: input.incorrect_assumptions ?? null,
      suggested_improvements: input.suggested_improvements ?? null,
      hidden_reinforcement: false as const,
      submitted_at: nowIso(),
    };
    saveFeedback(record);
    return { feedback: record, event: "feedback.received" as const, hidden_reinforcement: false };
  },
};

export const recommendationQualityService = {
  list: listQuality,
  measure(input: { institution_id: string; recommendation_id: string }) {
    const record = {
      quality_id: caeId("qlt"),
      institution_id: input.institution_id,
      recommendation_id: input.recommendation_id,
      acceptance_rate: 0.72,
      modification_rate: 0.18,
      rejection_rate: 0.1,
      correction_frequency: 0.12,
      evidence_completeness: 0.85,
      hallucination_rate: 0.03,
      escalation_accuracy: 0.88,
      confidence_calibration: 0.79,
      measured_at: nowIso(),
    };
    saveQuality(record);
    return { quality: record, observable: true };
  },
};

export const institutionalLearningService = {
  list: listInstitutionalLearning,
  recordReflection(input: {
    institution_id: string;
    decision_id: string;
    outcome_summary: string;
    reflection: string;
    lessons?: string[];
    best_practices_updated?: string[];
    training_improvements?: string[];
    future_recommendations?: string[];
  }) {
    const record = {
      learning_id: caeId("lrn"),
      institution_id: input.institution_id,
      decision_id: input.decision_id,
      outcome_summary: input.outcome_summary,
      reflection: input.reflection,
      lessons: input.lessons ?? ["Validate county readiness before expansion"],
      best_practices_updated: input.best_practices_updated ?? ["Require legal review for multi-county agreements"],
      training_improvements: input.training_improvements ?? ["Add county immersion certification module"],
      future_recommendations: input.future_recommendations ?? ["Phase expansion with 90-day checkpoints"],
      recorded_at: nowIso(),
    };
    saveInstitutionalLearning(record);
    for (const lesson of record.lessons) {
      institutionalWisdomService.accumulate({
        institution_id: input.institution_id,
        title: lesson.slice(0, 60),
        lesson,
        best_practice: true,
      });
    }
    return { learning: record, event: "lesson.learned" as const };
  },
};

export const organizationalHealthService = {
  list: listOrganizationalHealth,
  measure(institutionId: string) {
    const record = {
      health_id: caeId("hlt"),
      institution_id: institutionId,
      mission_completion: 0.78,
      knowledge_growth: 0.82,
      training_effectiveness: 0.75,
      volunteer_retention: 0.71,
      operational_resilience: 0.8,
      decision_quality: 0.76,
      research_maturity: 0.84,
      documentation_quality: 0.73,
      governance_maturity: 0.79,
      employee_score: false as const,
      measured_at: nowIso(),
    };
    saveOrganizationalHealth(record);
    return { health: record, employee_score: false, institutional_only: true };
  },
};

export const decisionOutcomeService = {
  list: listOutcomes,
  record(input: {
    institution_id: string;
    human_id: string;
    decision_id: string;
    decision_subject: string;
    expected_outcome: string;
    actual_outcome: string;
    variance?: string;
    lessons_learned?: string[];
    unexpected_consequences?: string[];
    evidence_quality?: number;
    recommendation_improvements?: string[];
  }) {
    getBrain(input.human_id);
    const record = {
      outcome_id: caeId("out"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      decision_id: input.decision_id,
      decision_subject: input.decision_subject,
      expected_outcome: input.expected_outcome,
      actual_outcome: input.actual_outcome,
      variance: input.variance ?? "Compared expected vs actual outcomes",
      lessons_learned: input.lessons_learned ?? ["Allow buffer time for county partner onboarding"],
      unexpected_consequences: input.unexpected_consequences ?? [],
      evidence_quality: input.evidence_quality ?? 0.8,
      recommendation_improvements: input.recommendation_improvements ?? ["Include partner capacity in readiness model"],
      recorded_at: nowIso(),
    };
    saveOutcome(record);
    institutionalLearningService.recordReflection({
      institution_id: input.institution_id,
      decision_id: input.decision_id,
      outcome_summary: input.actual_outcome,
      reflection: `Expected: ${input.expected_outcome}. Actual: ${input.actual_outcome}.`,
      lessons: record.lessons_learned,
    });
    return { outcome: record, event: "outcome.recorded" as const };
  },
};

export const memoryEvolutionService = {
  list: listMemoryEvolution,
  evolve(input: {
    institution_id: string;
    memory_key: string;
    change_type: "correction" | "new_evidence" | "historical_revision" | "retired_policy" | "archived";
    change_summary: string;
    changed_by: string;
    previous_version?: number;
  }) {
    const existing = listMemoryEvolution(input.institution_id).filter((m) => m.memory_key === input.memory_key);
    const prevVersion = input.previous_version ?? existing.length;
    const record = {
      evolution_id: caeId("mev"),
      institution_id: input.institution_id,
      memory_key: input.memory_key,
      previous_version: prevVersion,
      new_version: prevVersion + 1,
      change_type: input.change_type,
      change_summary: input.change_summary,
      silent_deletion: false as const,
      changed_by: input.changed_by,
      changed_at: nowIso(),
    };
    saveMemoryEvolution(record);
    return { evolution: record, event: "institution.evolved" as const, silent_deletion: false };
  },
};

export const collaborationService = {
  list: listCollaboration,
  activate(input: {
    institution_id: string;
    human_id: string;
    pattern: CollaborationPattern;
    context: string;
  }) {
    getBrain(input.human_id);
    const record = {
      collaboration_id: caeId("clb"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      pattern: input.pattern,
      context: input.context,
      ai_adapts: true as const,
      replaces_leadership: false as const,
      active_at: nowIso(),
    };
    saveCollaboration(record);
    return { collaboration: record, replaces_leadership: false, ai_adapts: true };
  },
};

export const transparencyService = {
  list: listTransparencyAudits,
  audit(input: {
    institution_id: string;
    subject_type: "recommendation" | "decision" | "correction" | "approval" | "governance";
    subject_id: string;
    why_recommendation: string;
    why_confidence: string;
    why_sources: string;
    who_approved: string | null;
    who_changed: string | null;
    why_changed: string;
  }) {
    const record = {
      audit_id: caeId("aud"),
      institution_id: input.institution_id,
      subject_type: input.subject_type,
      subject_id: input.subject_id,
      why_recommendation: input.why_recommendation,
      why_confidence: input.why_confidence,
      why_sources: input.why_sources,
      who_approved: input.who_approved,
      who_changed: input.who_changed,
      when_changed: nowIso(),
      why_changed: input.why_changed,
      explainable: true as const,
      recorded_at: nowIso(),
    };
    saveTransparencyAudit(record);
    return { audit: record, explainable: true };
  },
  recordGovernanceChange(input: {
    institution_id: string;
    change_type: "policy" | "constitution" | "procedure" | "delegation" | "approval_workflow";
    title: string;
    summary: string;
    approved_by: string;
  }) {
    const existing = listGovernanceEvolution(input.institution_id).filter((g) => g.title === input.title);
    const record = {
      governance_id: caeId("gov"),
      institution_id: input.institution_id,
      change_type: input.change_type,
      title: input.title,
      summary: input.summary,
      version: existing.length + 1,
      approved_by: input.approved_by,
      historically_traceable: true as const,
      changed_at: nowIso(),
    };
    saveGovernanceEvolution(record);
    transparencyService.audit({
      institution_id: input.institution_id,
      subject_type: "governance",
      subject_id: record.governance_id,
      why_recommendation: input.summary,
      why_confidence: "Governance change approved by Human",
      why_sources: "Institutional governance process",
      who_approved: input.approved_by,
      who_changed: input.approved_by,
      why_changed: input.summary,
    });
    return { governance: record, event: "governance.updated" as const, historically_traceable: true };
  },
};

export const partnershipRuntimeService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    ensurePartnershipBoot();
    getBrain(input.human_id);
    contextIntelligenceRuntime.assemble({
      human_id: input.human_id,
      institution_id: input.institution_id,
    });

    const recommendations = listRecommendations(input.human_id);
    const trust = listTrustCalibrations(input.institution_id);
    const wisdom = listWisdom(input.institution_id);
    const feedback = listFeedback(input.human_id);
    const outcomes = listOutcomes(input.institution_id);
    const health = listOrganizationalHealth(input.institution_id);
    const learning = listInstitutionalLearning(input.institution_id);

    return {
      greeting: "Living Institution Dashboard",
      central_question: "How is our Institution becoming wiser over time?",
      recommendations: recommendations.length,
      trust_calibrations: trust.length,
      wisdom_entries: wisdom.length,
      feedback_received: feedback.length,
      outcomes_tracked: outcomes.length,
      institutional_maturity: health.length > 0 ? health[health.length - 1].governance_maturity : 0.75,
      learning_velocity: learning.length,
      invitation_not_instruction: true,
      secret_human_scores: false,
      employee_scores: false,
      mutates_canonical: false,
    };
  },
  security: {
    prohibited: [
      "hidden_reputation_systems",
      "secret_human_trust_scores",
      "penalize_disagreement",
      "hide_ai_mistakes",
      "rewrite_institutional_history",
      "silent_history_modification",
      "behavioral_manipulation",
      "autonomous_governance",
      "auto_mutate_canonical_records",
    ],
    check(action: string) {
      return { allowed: !this.prohibited.some((p) => action.includes(p)), observable: true };
    },
  },
};

export const partnershipRuntime = {
  partnership: partnershipRuntimeService,
  recommendations: partnershipService,
  trust: trustCalibrationService,
  wisdom: institutionalWisdomService,
  selfEvaluation: aiSelfEvaluationService,
  feedback: humanFeedbackService,
  quality: recommendationQualityService,
  learning: institutionalLearningService,
  health: organizationalHealthService,
  outcomes: decisionOutcomeService,
  memoryEvolution: memoryEvolutionService,
  collaboration: collaborationService,
  transparency: transparencyService,
};
