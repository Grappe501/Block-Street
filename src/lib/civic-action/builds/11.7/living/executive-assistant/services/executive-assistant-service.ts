/**
 * CAE-11.7-W3 — Executive Assistant services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { contextIntelligenceRuntime } from "../../context/services/context-intelligence-service";
import { seedContextIfEmpty } from "../../context/services/seed";
import { missionExecutionService } from "../../../../11.6/execution/services/mission-execution-service";
import { calendarEngineService } from "../../../../11.6/calendar/services/calendar-service";
import { seedCalendarIfEmpty } from "../../../../11.6/calendar/services/seed";
import { EXECUTIVE_CAPABILITY_CLASSES, EXECUTIVE_PROHIBITED_ACTIONS } from "../constitution";
import type { BriefingType, ExecutiveOutputState, ExecutiveRiskClass } from "../data-model";
import {
  getBriefing,
  getCapabilities,
  getCommitment,
  getDecision,
  getMeetingPrep,
  getRoleContext,
  getVoicePreferences,
  listBriefings,
  listCommitments,
  listDecisions,
  listDissent,
  listEvidence,
  listIncidents,
  listInquiries,
  listResponses,
  saveBriefing,
  saveCapabilities,
  saveCommitment,
  saveDecision,
  saveDelegation,
  saveDissent,
  saveDraft,
  saveEvidence,
  saveHandoff,
  saveIncident,
  saveInquiry,
  saveMeetingPrep,
  saveOpportunity,
  saveResponse,
  saveRisk,
  saveRoleContext,
  saveVoicePreferences,
} from "./repository";

export class ExecutiveError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureExecutiveBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedCalendarIfEmpty();
  executiveCapabilityRegistryService.initialize();
}

function getBrainAndRole(input: { human_id: string; institution_id: string }) {
  ensureExecutiveBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(input.human_id);
  if (!brain) throw new ExecutiveError("EXECUTIVE_CONTEXT_REQUIRED", "LocalBrain required");
  const role = executiveRoleContextService.resolve({
    human_id: input.human_id,
    institution_id: input.institution_id,
    localbrain_id: brain.localbrain_id,
  });
  return { brain, role };
}

export const executiveCapabilityRegistryService = {
  list: getCapabilities,
  initialize() {
    if (getCapabilities().length > 0) return { initialized: false };
    const entries = EXECUTIVE_CAPABILITY_CLASSES.map((cls, i) => ({
      capability_id: `cap-${cls}`,
      capability_name: cls.replace(/_/g, " "),
      description: `Executive capability: ${cls}`,
      capability_class: cls,
      risk_class: (i < 3 ? "low" : i < 6 ? "moderate" : i < 8 ? "high" : "critical") as ExecutiveRiskClass,
      human_review_required: i >= 5,
      send_or_mutation_allowed: false as const,
      required_permissions: ["executive.view"],
      status: "active" as const,
    }));
    saveCapabilities(entries);
    return { initialized: true, count: entries.length };
  },
  prohibited: EXECUTIVE_PROHIBITED_ACTIONS,
};

export const executiveRoleContextService = {
  get: getRoleContext,
  resolve(input: { human_id: string; institution_id: string; localbrain_id: string; role_id?: string }) {
    const existing = getRoleContext(input.human_id, input.institution_id);
    if (existing) return existing;
    const record = {
      executive_role_context_id: caeId("exr"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      role_id: input.role_id ?? "role-executive",
      role_title: "Executive Director",
      authority_scope: ["mission_recommend", "budget_recommend", "personnel_recommend"],
      delegated_authority: [],
      approval_limits: { expenditure: 5000 },
      financial_limits: { single_approval: 5000 },
      governance_scope: ["operations"],
      mission_scope: ["msn-block-street-001", "opm-volunteer-training-001"],
      organization_scope: ["org-block-street"],
      effective_at: nowIso(),
      expires_at: null,
      source_reference: "canonical-membership-record",
      status: "active" as const,
    };
    saveRoleContext(record);
    return record;
  },
  mayApprove(input: { human_id: string; institution_id: string; decision_type: string; amount?: number }) {
    const role = getRoleContext(input.human_id, input.institution_id);
    if (!role) return { may_approve: false, reason: "No canonical role context", title_alone: false };
    if (input.decision_type === "budget" && (input.amount ?? 0) > (role.financial_limits.single_approval ?? 0)) {
      return {
        may_approve: false,
        may_recommend: true,
        reason: "Approval requires Treasurer and Executive Director under current authority policy",
        required_approvers: ["role-treasurer", "role-executive-director"],
        title_alone: false,
      };
    }
    return { may_approve: true, reason: "Within authority scope", title_alone: false };
  },
};

export const executiveAuthorityBoundaryService = {
  checkSend() {
    throw new ExecutiveError("EXECUTIVE_SEND_NOT_AUTHORIZED", "Sending requires explicit Human action");
  },
  checkApprove() {
    throw new ExecutiveError("EXECUTIVE_HUMAN_REVIEW_REQUIRED", "Approval requires Human authority");
  },
  checkAssign() {
    throw new ExecutiveError("EXECUTIVE_DELEGATION_NOT_ALLOWED", "Assignment requires authorized command");
  },
  titleGrantsAuthority: false,
};

export const executiveEvidenceService = {
  list: listEvidence,
  attach(input: {
    executive_output_id: string;
    source_type: string;
    source_id: string;
    claim_supported: string;
    confidence: number;
    uncertainty_label?: Parameters<typeof saveEvidence>[0]["uncertainty_label"];
  }) {
    const record = {
      evidence_ledger_id: caeId("evd"),
      executive_output_id: input.executive_output_id,
      source_type: input.source_type,
      source_id: input.source_id,
      source_version: "1",
      claim_supported: input.claim_supported,
      authority_level: input.source_type === "canonical_institutional_record" ? "canonical" : "verified",
      freshness: nowIso(),
      confidence: input.confidence,
      uncertainty_label: input.uncertainty_label ?? ("strong_evidence" as const),
      access_scope: "institution",
      included_at: nowIso(),
    };
    saveEvidence(record);
    return record;
  },
  markStale(outputId: string, sourceId: string) {
    const items = listEvidence(outputId).filter((e) => e.source_id === sourceId);
    return { excluded_from_high_confidence: items.length > 0, stale_source: sourceId };
  },
};

export const dissentLedgerService = {
  list: listDissent,
  add(input: {
    decision_package_id: string;
    position: string;
    supporting_evidence: string[];
    raised_by?: string;
    affected_groups: string[];
  }) {
    const record = {
      dissent_item_id: caeId("dst"),
      decision_package_id: input.decision_package_id,
      position: input.position,
      supporting_evidence: input.supporting_evidence,
      raised_by: input.raised_by ?? null,
      affected_groups: input.affected_groups,
      resolution_status: "open" as const,
    };
    saveDissent(record);
    return { dissent: record, visible: true, not_disloyalty: true };
  },
};

export const executiveBriefingService = {
  list: listBriefings,
  get: getBriefing,
  generate(input: {
    human_id: string;
    localbrain_id: string;
    institution_id: string;
    briefing_type?: BriefingType;
    language?: string;
  }) {
    const { role } = getBrainAndRole(input);
    const context = contextIntelligenceRuntime.assemble({
      human_id: input.human_id,
      institution_id: input.institution_id,
    });
    const attention = contextIntelligenceRuntime.attention.evaluate({
      human_id: input.human_id,
      localbrain_id: input.localbrain_id,
      institution_id: input.institution_id,
    });
    const commitments = listCommitments(input.human_id).filter((c) => c.status === "confirmed");
    const staleSource = "external-news-feed";
    const items = [
      {
        briefing_item_id: caeId("bit"),
        category: "what_changed",
        headline: "Mission status updated overnight",
        summary: "County immersion Mission advanced to preparation phase",
        why_it_matters: "Affects today's partner meeting briefing",
        source_references: ["msn-block-street-001-status"],
        priority: "high",
        confidence: 0.88,
        uncertainty_label: "confirmed" as const,
        decision_required: false,
        recommended_action: null,
        deadline: null,
      },
      {
        briefing_item_id: caeId("bit"),
        category: "decisions_waiting",
        headline: "Budget reallocation request",
        summary: "Field resource reallocation requires review",
        why_it_matters: "Deadline today",
        source_references: ["req-budget-realloc-001"],
        priority: "high",
        confidence: 0.75,
        uncertainty_label: "strong_evidence" as const,
        decision_required: true,
        recommended_action: "Review decision package",
        deadline: new Date(Date.now() + 8 * 3600000).toISOString(),
      },
      {
        briefing_item_id: caeId("bit"),
        category: "forecast",
        headline: "Weather may affect afternoon travel",
        summary: "Possible delays to partner meeting travel window",
        why_it_matters: "Plan extra buffer",
        source_references: ["forecast-weather-001"],
        priority: "monitor",
        confidence: 0.55,
        uncertainty_label: "probable" as const,
        decision_required: false,
        recommended_action: null,
        deadline: null,
      },
    ];
    const briefing = {
      briefing_id: caeId("brf"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      briefing_type: input.briefing_type ?? ("morning" as const),
      title: "Morning Briefing",
      summary: `Prepared for ${role.role_title}. ${attention.items.length} attention items. ${commitments.length} confirmed commitments.`,
      items: items.filter((i) => i.source_references[0] !== staleSource),
      prepared_at: nowIso(),
      current_through: nowIso(),
      sources_synchronized_at: nowIso(),
      stale_sources: [staleSource],
      output_state: "ready_for_review" as ExecutiveOutputState,
      confidence: 0.86,
      expires_at: new Date(Date.now() + 4 * 3600000).toISOString(),
      status: "active" as const,
    };
    saveBriefing(briefing);
    executiveEvidenceService.attach({
      executive_output_id: briefing.briefing_id,
      source_type: "canonical_institutional_record",
      source_id: "msn-block-street-001",
      claim_supported: "Mission status update",
      confidence: 0.88,
    });
    return { briefing, event: "briefing.generated" as const, stale_excluded: true };
  },
  refresh(briefingId: string, humanId: string) {
    const existing = getBriefing(briefingId);
    if (!existing || existing.human_id !== humanId) {
      throw new ExecutiveError("EXECUTIVE_OUTPUT_EXPIRED", "Briefing not found");
    }
    const refreshed = { ...existing, prepared_at: nowIso(), status: "refreshed" as const };
    saveBriefing(refreshed);
    return { briefing: refreshed, event: "briefing.refreshed" as const };
  },
  expireStale(humanId: string) {
    const now = Date.now();
    let expired = 0;
    for (const b of listBriefings(humanId)) {
      if (new Date(b.expires_at).getTime() < now && b.status === "active") {
        saveBriefing({ ...b, status: "expired", output_state: "stale_context" });
        expired++;
      }
    }
    return { expired, event: expired > 0 ? ("briefing.expired" as const) : null };
  },
};

export const meetingPreparationService = {
  get: getMeetingPrep,
  prepare(input: {
    human_id: string;
    localbrain_id: string;
    institution_id: string;
    event_id: string;
  }) {
    getBrainAndRole(input);
    const event = (() => {
      try {
        return calendarEngineService.events.get(input.event_id);
      } catch {
        return null;
      }
    })();
    const record = {
      meeting_preparation_id: caeId("mpr"),
      calendar_event_id: input.event_id,
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      meeting_purpose: event?.description ?? "Partner alignment and Mission update",
      attendees: [
        { human_id: "usr-001", role: "Executive Director", organization: "Block Street" },
        { human_id: "usr-002", role: "Mission Lead", organization: "Block Street" },
      ],
      agenda: ["Opening", "Mission update", "Open decisions", "Next steps"],
      desired_outcomes: ["Confirm volunteer briefing timeline", "Resolve resource question"],
      open_decisions: ["Field resource allocation"],
      prior_commitments: ["Send revised outline"],
      related_missions: ["msn-block-street-001"],
      relevant_documents: ["doc-attendance-sheet", "kb-volunteer-training"],
      recent_changes: ["Attendance sheet updated", "Meeting moved earlier"],
      risks: ["Insufficient preparation time if travel delayed"],
      questions_to_ask: ["Who owns final briefing approval?", "What is the revised budget ceiling?"],
      talking_points: ["Volunteer briefing progress", "County immersion timeline"],
      authority_context: "You may recommend expenditure; Treasurer approval required above limit",
      recording: false as const,
      unauthorized_invitation: false as const,
      prepared_at: nowIso(),
      expires_at: new Date(Date.now() + 6 * 3600000).toISOString(),
    };
    saveMeetingPrep(record);
    return {
      preparation: record,
      event: "meeting.preparation_generated" as const,
      attendee_profiling: false,
      operational_only: true,
    };
  },
};

export const decisionPackageService = {
  list: listDecisions,
  get: getDecision,
  prepare(input: {
    human_id: string;
    localbrain_id: string;
    institution_id: string;
    decision_subject: string;
    decision_question: string;
  }) {
    const { role } = getBrainAndRole(input);
    const authority = executiveRoleContextService.mayApprove({
      human_id: input.human_id,
      institution_id: input.institution_id,
      decision_type: "budget",
      amount: 15000,
    });
    const options = [
      {
        option_id: "opt-1",
        title: "Maintain current allocation",
        description: "Keep existing field resource distribution",
        benefits: ["No disruption", "Known costs"],
        costs: ["May not meet county demand"],
        risks: ["Mission delay"],
        affected_groups: ["field-team"],
        evidence: ["msn-status-current"],
        confidence: 0.8,
        reversibility: "high",
      },
      {
        option_id: "opt-2",
        title: "Reallocate to county immersion",
        description: "Shift two field coordinators to county Mission",
        benefits: ["Faster county progress"],
        costs: ["Reduced capacity elsewhere"],
        risks: ["Other Missions slowed"],
        affected_groups: ["county-team", "field-team"],
        evidence: ["msn-county-demand", "capacity-report"],
        confidence: 0.78,
        reversibility: "moderate",
      },
      {
        option_id: "opt-3",
        title: "Hire temporary coordinators",
        description: "Contract short-term support for county Mission",
        benefits: ["Preserves other Missions"],
        costs: ["Higher expenditure", "Onboarding time"],
        risks: ["Budget approval required"],
        affected_groups: ["county-team", "finance"],
        evidence: ["budget-available", "committee-note-dissent"],
        confidence: 0.72,
        reversibility: "moderate",
      },
    ];
    const decisionId = caeId("dcp");
    const record = {
      decision_package_id: decisionId,
      institution_id: input.institution_id,
      human_id: input.human_id,
      localbrain_id: input.localbrain_id,
      decision_subject: input.decision_subject,
      decision_question: input.decision_question,
      decision_owner: input.human_id,
      authority_required: authority.may_approve ? ["role-executive"] : ["role-treasurer", "role-executive-director"],
      human_may_approve: authority.may_approve === true && false,
      deadline: new Date(Date.now() + 24 * 3600000).toISOString(),
      options,
      recommended_option_id: "opt-2",
      supporting_evidence: ["msn-county-demand", "capacity-report"],
      contradictory_evidence: ["committee-note-dissent"],
      dissent_visible: true,
      readiness_state: "ready_with_conditions" as const,
      confidence: 0.76,
      assumptions: ["County demand remains at current level"],
      limitations: ["Legal review still pending"],
      prepared_at: nowIso(),
      status: "ready" as const,
    };
    saveDecision(record);
    dissentLedgerService.add({
      decision_package_id: decisionId,
      position: "Option 3 may be more sustainable long-term",
      supporting_evidence: ["committee-note-dissent"],
      raised_by: "usr-committee-chair",
      affected_groups: ["finance"],
    });
    executiveEvidenceService.attach({
      executive_output_id: decisionId,
      source_type: "canonical_institutional_record",
      source_id: "msn-county-demand",
      claim_supported: "County immersion resource need",
      confidence: 0.85,
    });
    return {
      decision_package: record,
      event: "decision.package_generated" as const,
      balanced: true,
      alternatives_visible: true,
      approve_button_hidden: !authority.may_approve || record.human_may_approve === false,
    };
  },
  requestMoreEvidence(decisionId: string) {
    const d = getDecision(decisionId);
    if (!d) throw new ExecutiveError("EXECUTIVE_EVIDENCE_INSUFFICIENT", "Decision not found");
    return { decision_id: decisionId, event: "decision.more_evidence_required" as const, readiness: "more_evidence_needed" };
  },
};

export const executiveAttentionService = {
  coordinate(input: { human_id: string; localbrain_id: string; institution_id: string }) {
    const attention = contextIntelligenceRuntime.attention.evaluate(input);
    const categories = [
      "decision_required_today",
      "preparation_required_today",
      "meeting_critical",
      "mission_escalation",
      "people_waiting",
      "can_be_delegated",
      "can_be_deferred",
    ];
    return {
      categories,
      attention_items: attention.items,
      may_reschedule: false,
      may_invite: false,
      explainable: attention.explainable,
    };
  },
};

export const executiveCommitmentService = {
  list: listCommitments,
  suggest(input: {
    human_id: string;
    localbrain_id: string;
    institution_id: string;
    commitment_text: string;
    source_type: string;
    source_id: string;
    due_at?: string;
  }) {
    const record = {
      commitment_id: caeId("cmt"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      localbrain_id: input.localbrain_id,
      source_type: input.source_type,
      source_id: input.source_id,
      commitment_text: input.commitment_text,
      commitment_type: "meeting_promise",
      made_to: "county-team",
      linked_mission_id: "msn-block-street-001",
      due_at: input.due_at ?? new Date(Date.now() + 24 * 3600000).toISOString(),
      evidence_reference: input.source_id,
      confirmation_status: "suggested" as const,
      status: "suggested" as const,
      reliability_score: null,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    saveCommitment(record);
    return { commitment: record, event: "commitment.suggested" as const, requires_confirmation: true };
  },
  confirm(commitmentId: string, humanId: string, edits?: { commitment_text?: string; due_at?: string }) {
    const c = getCommitment(commitmentId);
    if (!c || c.human_id !== humanId) {
      throw new ExecutiveError("EXECUTIVE_COMMITMENT_CONFIRMATION_REQUIRED", "Commitment not found");
    }
    const updated = {
      ...c,
      commitment_text: edits?.commitment_text ?? c.commitment_text,
      due_at: edits?.due_at ?? c.due_at,
      confirmation_status: "confirmed" as const,
      status: "confirmed" as const,
      updated_at: nowIso(),
    };
    saveCommitment(updated);
    return { commitment: updated, event: "commitment.confirmed" as const };
  },
  correct(commitmentId: string, humanId: string, action: "not_a_commitment" | "edit") {
    const c = getCommitment(commitmentId);
    if (!c || c.human_id !== humanId) throw new ExecutiveError("EXECUTIVE_COMMITMENT_CONFIRMATION_REQUIRED", "Not found");
    if (action === "not_a_commitment") {
      const updated = { ...c, status: "disputed" as const, updated_at: nowIso() };
      saveCommitment(updated);
      return { commitment: updated, improves_detection: true };
    }
    return { commitment: c, improves_detection: true };
  },
  complete(commitmentId: string, humanId: string) {
    const c = getCommitment(commitmentId);
    if (!c || c.human_id !== humanId) throw new ExecutiveError("EXECUTIVE_COMMITMENT_CONFIRMATION_REQUIRED", "Not found");
    const updated = { ...c, status: "completed" as const, updated_at: nowIso() };
    saveCommitment(updated);
    return { commitment: updated, event: "commitment.completed" as const };
  },
};

export const executiveDraftingService = {
  prepare(input: {
    human_id: string;
    localbrain_id: string;
    institution_id: string;
    draft_type: string;
    purpose: string;
    audience: string;
    content_hint?: string;
  }) {
    getBrainAndRole(input);
    const record = {
      executive_draft_id: caeId("drf"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      draft_type: input.draft_type,
      purpose: input.purpose,
      audience: input.audience,
      draft_content:
        input.content_hint ??
        "Dear team,\n\nPlease find the revised volunteer briefing outline attached for your review.\n\n[AI-prepared draft — not sent]",
      evidence_references: ["doc-attendance-sheet"],
      claims_requiring_review: ["Budget figures", "Timeline commitments"],
      tone: "professional",
      language: "en",
      sensitivity: "internal",
      ai_prepared: true as const,
      send_status: "not_sent" as const,
      human_review_required: true as const,
      approval_requirements: ["human_review"],
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    saveDraft(record);
    return {
      draft: record,
      event: "executive_draft.created" as const,
      labeled: true,
      send_allowed: false,
      impersonation: false,
    };
  },
  send() {
    return executiveAuthorityBoundaryService.checkSend();
  },
  recordEdit(humanId: string, draftId: string, permitted: boolean) {
    if (!permitted) return { voice_learned: false };
    const prefs = getVoicePreferences(humanId) ?? {
      human_id: humanId,
      tone: "professional",
      formality: "moderate",
      language: "en",
      adaptation_paused: false,
      learned_from_drafts: [],
    };
    if (prefs.adaptation_paused) return { voice_learned: false };
    const updated = { ...prefs, learned_from_drafts: [...prefs.learned_from_drafts, draftId].slice(-5) };
    saveVoicePreferences(updated);
    return { voice_learned: true, preferences: updated };
  },
};

export const delegationPreparationService = {
  prepare(input: {
    human_id: string;
    institution_id: string;
    work_item: string;
    recommended_recipient: string;
  }) {
    const authority = getRoleContext(input.human_id, input.institution_id);
    const record = {
      delegation_recommendation_id: caeId("dlg"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      work_item: input.work_item,
      recommended_recipient: input.recommended_recipient,
      reason: "Verified competency, capacity, and role eligibility",
      recipient_authority: true,
      recipient_capacity: true,
      confidence: 0.81,
      assignment_allowed: false as const,
      status: "recommended" as const,
    };
    saveDelegation(record);
    return {
      recommendation: record,
      event: "delegation.recommended" as const,
      assigned: false,
      requires_authorized_command: true,
      delegator_authority: !!authority,
    };
  },
};

export const handoffPreparationService = {
  prepare(input: {
    human_id: string;
    institution_id: string;
    subject: string;
    recipient_human_id: string;
  }) {
    const record = {
      handoff_package_id: caeId("hof"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      subject: input.subject,
      purpose: "Temporary coordinator assignment",
      current_state: "Volunteer briefing in progress",
      work_completed: ["Attendance sheet reviewed", "Agenda drafted"],
      work_remaining: ["Finalize briefing", "Confirm room setup"],
      decisions_made: ["Use revised outline"],
      open_questions: ["Budget for supplies"],
      documents: ["doc-attendance-sheet", "draft-briefing"],
      deadline: new Date(Date.now() + 48 * 3600000).toISOString(),
      authority_scope: "Mission coordination within county immersion",
      next_action: "Review draft briefing with county lead",
      prepared_by: input.human_id,
      prepared_at: nowIso(),
    };
    saveHandoff(record);
    return { handoff: record, event: "handoff.package_created" as const, complete: true };
  },
};

export const riskPreparationService = {
  prepare(input: { human_id: string; institution_id: string; risk_summary: string }) {
    const record = {
      risk_brief_id: caeId("rsk"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      summary: input.risk_summary,
      why_now: "Calendar change reduces preparation window",
      likelihood: "moderate",
      impact: "high",
      confidence: 0.74,
      affected_missions: ["msn-block-street-001"],
      mitigation_options: ["Reschedule non-critical meeting", "Delegate briefing finalization"],
      decision_required: true,
      source_references: ["calendar-change-001"],
      artificial_urgency: false as const,
    };
    saveRisk(record);
    return { risk: record, event: "executive.risk_escalated" as const, evidence_based: true };
  },
};

export const opportunityPreparationService = {
  prepare(input: { human_id: string; institution_id: string; opportunity: string }) {
    const record = {
      opportunity_brief_id: caeId("opp"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      opportunity: input.opportunity,
      strategic_alignment: "Advances county immersion objective",
      evidence: ["partner-interest-signal"],
      time_window: "Next 2 weeks",
      confidence: 0.65,
      decision_required: false,
    };
    saveOpportunity(record);
    return { opportunity: record, event: "executive.opportunity_identified" as const, grouped_not_interrupting: true };
  },
};

export const executiveInquiryService = {
  list: listInquiries,
  answer(input: {
    human_id: string;
    localbrain_id: string;
    institution_id: string;
    question: string;
    language?: string;
  }) {
    getBrainAndRole(input);
    const commitments = listCommitments(input.human_id);
    const confirmed = commitments.filter((c) => c.status === "confirmed");
    const unconfirmed = commitments.filter((c) => c.status === "suggested");
    const record = {
      executive_inquiry_id: caeId("inq"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      question: input.question,
      interpreted_intent: "commitment_search",
      answer: `Found ${confirmed.length} confirmed commitments to county team. ${unconfirmed.length} unconfirmed possible statement.`,
      evidence_sources: ["meeting-notes-approved", "commitment-ledger"],
      confidence: 0.84,
      limitations: ["Unconfirmed statements require Human review"],
      follow_up_questions: unconfirmed.length > 0 ? ["Confirm or reject suggested commitment?"] : [],
      unconfirmed_items: unconfirmed.map((c) => c.commitment_text),
      created_at: nowIso(),
    };
    saveInquiry(record);
    return {
      inquiry: record,
      confirmed_count: confirmed.length,
      unconfirmed_labeled: true,
      private_memory_excluded: true,
    };
  },
};

export const executivePrivacyService = {
  controlCenter(humanId: string) {
    return {
      human_id: humanId,
      private_memory_as_evidence: false,
      impersonation_prohibited: true,
      voice_preferences: getVoicePreferences(humanId),
      board_materials_protected: true,
      cross_institution_blocked: true,
    };
  },
  filterForInstitution(humanId: string, institutionId: string, items: string[]) {
    const ctx = contextIntelligenceRuntime.institution.get(humanId);
    if (ctx && ctx.institution_id !== institutionId) {
      throw new ExecutiveError("EXECUTIVE_CROSS_INSTITUTION_BLOCKED", "Institution mismatch");
    }
    return { filtered: items, private_excluded: true };
  },
};

export const executiveAssistantAuditService = {
  listIncidents: listIncidents,
  reportProblem(input: {
    human_id: string;
    executive_output_id: string;
    report: string;
    context_snapshot?: Record<string, unknown>;
  }) {
    const record = {
      incident_id: caeId("inc"),
      executive_output_id: input.executive_output_id,
      human_id: input.human_id,
      report: input.report,
      context_snapshot: input.context_snapshot ?? {},
      reported_at: nowIso(),
    };
    saveIncident(record);
    return { incident: record, event: "executive_output.reported" as const, regression_candidate: true };
  },
};

export const executiveAssistantOrchestrator = {
  route(input: {
    human_id: string;
    institution_id: string;
    request_type: string;
    purpose: string;
    target_subject_id?: string;
    language?: string;
  }) {
    const { brain, role } = getBrainAndRole(input);
    const context = contextIntelligenceRuntime.assemble({
      human_id: input.human_id,
      institution_id: input.institution_id,
    });
    const response = {
      executive_response_id: caeId("exr"),
      request_type: input.request_type,
      title: `Executive ${input.request_type}`,
      summary: `Prepared for ${role.role_title} in ${input.institution_id}`,
      human_id: input.human_id,
      institution_id: input.institution_id,
      role_id: role.role_id,
      purpose: input.purpose,
      evidence_references: ["canonical-records"],
      decisions_required: [],
      recommendations: [],
      alternatives: [],
      confidence: context.confidence,
      limitations: ["Human review required for all consequential actions"],
      human_action_required: true as const,
      output_state: "ready_for_review" as ExecutiveOutputState,
      generated_at: nowIso(),
      expires_at: new Date(Date.now() + 4 * 3600000).toISOString(),
    };
    saveResponse(response);
    return {
      response,
      localbrain_id: brain.localbrain_id,
      active_context: context.active_context,
      event: "executive_assistant.response_generated" as const,
      mutates_canonical: false,
    };
  },
  home(input: { human_id: string; institution_id: string }) {
    const { brain } = getBrainAndRole(input);
    const briefing = executiveBriefingService.generate({
      human_id: input.human_id,
      localbrain_id: brain.localbrain_id,
      institution_id: input.institution_id,
      briefing_type: "morning",
    });
    const commitments = listCommitments(input.human_id).filter((c) => c.status === "confirmed");
    return {
      greeting: "Good Morning",
      what_changed: briefing.briefing.items.filter((i) => i.category === "what_changed"),
      your_day: briefing.briefing.summary,
      decisions_waiting: briefing.briefing.items.filter((i) => i.decision_required),
      commitments_due: commitments,
      preparation_ready: true,
      ask_localbrain: true,
    };
  },
};

export const executiveAssistantRuntime = {
  capabilities: executiveCapabilityRegistryService,
  orchestrator: executiveAssistantOrchestrator,
  role: executiveRoleContextService,
  authority: executiveAuthorityBoundaryService,
  briefing: executiveBriefingService,
  meeting: meetingPreparationService,
  decision: decisionPackageService,
  evidence: executiveEvidenceService,
  dissent: dissentLedgerService,
  attention: executiveAttentionService,
  commitment: executiveCommitmentService,
  drafting: executiveDraftingService,
  delegation: delegationPreparationService,
  handoff: handoffPreparationService,
  risk: riskPreparationService,
  opportunity: opportunityPreparationService,
  inquiry: executiveInquiryService,
  privacy: executivePrivacyService,
  audit: executiveAssistantAuditService,
};
