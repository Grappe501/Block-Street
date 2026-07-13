/**
 * CAE-11.7-W3 — Executive Assistant tests
 */
import { executiveAssistantRuntime } from "./services/executive-assistant-service";
import { seedExecutiveIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import { getExecutiveConstitution, LIX_EXECUTIVE_PRINCIPLE, REQUIRED_EXECUTIVE_SERVICES } from "./constitution";
import { checkLixW3Invariants } from "./invariants";
import { explainExecutiveAction } from "./traceability";
import { EXECUTIVE_EVENT_CATALOG } from "./events/catalog";

export type LixW3TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW3CertificationTests(): LixW3TestResult[] {
  seedExecutiveIfEmpty();
  const results: LixW3TestResult[] = [];
  const humanId = "usr-001";
  const localbrainId = "lbr-usr-001";
  const institutionId = "inst-block-street";
  const federationId = "fed-block-street-001";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getExecutiveConstitution();
  results.push({ name: "executive_principle", passed: constitution.governing_principle === LIX_EXECUTIVE_PRINCIPLE });

  results.push({
    name: "required_executive_services",
    passed: REQUIRED_EXECUTIVE_SERVICES.length === 19,
    detail: `${REQUIRED_EXECUTIVE_SERVICES.length} services`,
  });

  results.push({ name: "w3_invariants", passed: checkLixW3Invariants().every((i) => i.passed) });

  const registry = executiveAssistantRuntime.capabilities.initialize();
  results.push({
    name: "capability_registry",
    passed: registry.initialized === false || (registry.count ?? 0) >= 10,
    detail: `${registry.count ?? "existing"} capabilities`,
  });

  const orchestrated = executiveAssistantRuntime.orchestrator.route({
    human_id: humanId,
    institution_id: institutionId,
    request_type: "briefing",
    purpose: "morning orientation",
  });
  results.push({
    name: "orchestrator_context",
    passed: orchestrated.response.human_action_required && !!orchestrated.active_context,
    detail: orchestrated.response.output_state,
  });

  const role = executiveAssistantRuntime.role.resolve({
    human_id: humanId,
    institution_id: institutionId,
    localbrain_id: localbrainId,
  });
  const authorityHigh = executiveAssistantRuntime.role.mayApprove({
    human_id: humanId,
    institution_id: institutionId,
    decision_type: "budget",
    amount: 15000,
  });
  results.push({
    name: "authority_not_from_title",
    passed: role.source_reference === "canonical-membership-record" && authorityHigh.title_alone === false,
    detail: authorityHigh.may_approve ? "may approve" : "requires approvers",
  });

  const briefing = executiveAssistantRuntime.briefing.generate({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
    briefing_type: "morning",
  });
  results.push({
    name: "morning_briefing",
    passed: briefing.briefing.items.length >= 2 && briefing.stale_excluded,
    detail: `${briefing.briefing.items.length} items`,
  });

  results.push({
    name: "briefing_freshness",
    passed: !!briefing.briefing.prepared_at && briefing.briefing.stale_sources.length > 0,
    detail: briefing.briefing.output_state,
  });

  const meeting = executiveAssistantRuntime.meeting.prepare({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
    event_id: "evt-partner-meeting",
  });
  results.push({
    name: "meeting_preparation",
    passed:
      meeting.preparation.agenda.length > 0 &&
      meeting.attendee_profiling === false &&
      meeting.preparation.unauthorized_invitation === false,
    detail: meeting.preparation.meeting_purpose.slice(0, 30),
  });

  const decision = executiveAssistantRuntime.decision.prepare({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
    decision_subject: "Field resource reallocation",
    decision_question: "How should we allocate field coordinators?",
  });
  results.push({
    name: "decision_package_balance",
    passed:
      decision.decision_package.options.length >= 3 &&
      decision.balanced &&
      decision.decision_package.dissent_visible,
    detail: decision.decision_package.readiness_state,
  });

  results.push({
    name: "decision_approve_blocked",
    passed: decision.approve_button_hidden && decision.decision_package.human_may_approve === false,
    detail: "legal review pending",
  });

  const evidence = executiveAssistantRuntime.evidence.attach({
    executive_output_id: decision.decision_package.decision_package_id,
    source_type: "canonical_institutional_record",
    source_id: "msn-county-demand",
    claim_supported: "Resource need",
    confidence: 0.85,
  });
  results.push({
    name: "evidence_ledger",
    passed: evidence.uncertainty_label === "strong_evidence",
    detail: evidence.source_type,
  });

  const dissent = executiveAssistantRuntime.dissent.list(decision.decision_package.decision_package_id);
  results.push({
    name: "dissent_visible",
    passed: dissent.length > 0 && dissent[0].resolution_status === "open",
    detail: `${dissent.length} dissent items`,
  });

  const suggested = executiveAssistantRuntime.commitment.suggest({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
    commitment_text: "I will send the revised outline tomorrow",
    source_type: "meeting_notes",
    source_id: "notes-board-meeting",
  });
  results.push({
    name: "commitment_requires_confirmation",
    passed: suggested.requires_confirmation && suggested.commitment.status === "suggested",
    detail: suggested.commitment.confirmation_status,
  });

  const confirmed = executiveAssistantRuntime.commitment.confirm(suggested.commitment.commitment_id, humanId, {
    due_at: new Date(Date.now() + 36 * 3600000).toISOString(),
  });
  results.push({
    name: "commitment_confirmation",
    passed: confirmed.commitment.status === "confirmed",
    detail: confirmed.commitment.due_at?.slice(0, 10) ?? "none",
  });

  results.push({
    name: "no_reliability_score",
    passed: confirmed.commitment.reliability_score === null,
    detail: "no loyalty score",
  });

  const draft = executiveAssistantRuntime.drafting.prepare({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
    draft_type: "email",
    purpose: "Send revised outline",
    audience: "county-team",
  });
  results.push({
    name: "draft_labeling",
    passed: draft.draft.ai_prepared && draft.draft.send_status === "not_sent" && draft.labeled,
    detail: "AI-prepared not sent",
  });

  const sendBlocked = (() => {
    try {
      executiveAssistantRuntime.drafting.send();
      return false;
    } catch (e) {
      return (e as { code?: string }).code === "EXECUTIVE_SEND_NOT_AUTHORIZED";
    }
  })();
  results.push({ name: "send_prohibition", passed: sendBlocked, detail: "send blocked" });

  const approveBlocked = (() => {
    try {
      executiveAssistantRuntime.authority.checkApprove();
      return false;
    } catch (e) {
      return (e as { code?: string }).code === "EXECUTIVE_HUMAN_REVIEW_REQUIRED";
    }
  })();
  results.push({ name: "approve_prohibition", passed: approveBlocked, detail: "approve blocked" });

  const delegation = executiveAssistantRuntime.delegation.prepare({
    human_id: humanId,
    institution_id: institutionId,
    work_item: "County coordinator",
    recommended_recipient: "usr-003",
  });
  results.push({
    name: "delegation_not_assign",
    passed: delegation.assigned === false && delegation.requires_authorized_command,
    detail: delegation.recommendation.recommended_recipient,
  });

  const handoff = executiveAssistantRuntime.handoff.prepare({
    human_id: humanId,
    institution_id: institutionId,
    subject: "County coordinator handoff",
    recipient_human_id: "usr-003",
  });
  results.push({
    name: "handoff_completeness",
    passed: handoff.complete && handoff.handoff.work_remaining.length > 0,
    detail: handoff.handoff.next_action.slice(0, 30),
  });

  const risk = executiveAssistantRuntime.risk.prepare({
    human_id: humanId,
    institution_id: institutionId,
    risk_summary: "Preparation window shortened",
  });
  results.push({
    name: "risk_no_artificial_urgency",
    passed: risk.risk.artificial_urgency === false && risk.evidence_based,
    detail: risk.risk.likelihood,
  });

  const inquiry = executiveAssistantRuntime.inquiry.answer({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
    question: "What did I promise the county team last week?",
  });
  results.push({
    name: "executive_inquiry_grounding",
    passed: inquiry.unconfirmed_labeled && inquiry.private_memory_excluded,
    detail: `${inquiry.confirmed_count} confirmed`,
  });

  const voiceEdit = executiveAssistantRuntime.drafting.recordEdit(humanId, draft.draft.executive_draft_id, true);
  results.push({
    name: "voice_memory_controls",
    passed: voiceEdit.voice_learned === true,
    detail: "edit recorded with permission",
  });

  results.push({
    name: "impersonation_prohibition",
    passed: draft.impersonation === false && constitution.ai_may_not.includes("impersonate_the_human"),
    detail: "no impersonation",
  });

  const privacy = executiveAssistantRuntime.privacy.controlCenter(humanId);
  results.push({
    name: "privacy_private_memory",
    passed: privacy.private_memory_as_evidence === false && privacy.impersonation_prohibited,
    detail: "private protected",
  });

  const isolationBlocked = (() => {
    try {
      executiveAssistantRuntime.privacy.filterForInstitution(humanId, federationId, ["board-memo"]);
      return false;
    } catch (e) {
      return (e as { code?: string }).code === "EXECUTIVE_CROSS_INSTITUTION_BLOCKED";
    }
  })();
  results.push({ name: "cross_institution_isolation", passed: isolationBlocked, detail: "federation blocked" });

  const incident = executiveAssistantRuntime.audit.reportProblem({
    human_id: humanId,
    executive_output_id: briefing.briefing.briefing_id,
    report: "One item was misleading",
  });
  results.push({
    name: "output_incident_report",
    passed: incident.regression_candidate && incident.event === "executive_output.reported",
    detail: incident.incident.incident_id,
  });

  results.push({
    name: "canonical_mutation_prohibition",
    passed: orchestrated.mutates_canonical === false && delegation.recommendation.assignment_allowed === false,
    detail: "prepare only",
  });

  const trace = explainExecutiveAction({
    human_id: humanId,
    action_type: "executive_briefing",
    institution_id: institutionId,
    confidence: briefing.briefing.confidence,
  });
  results.push({
    name: "executive_traceability",
    passed: trace.includes(humanId) && trace.includes(LIX_EXECUTIVE_PRINCIPLE),
  });

  results.push({
    name: "executive_event_catalog",
    passed: EXECUTIVE_EVENT_CATALOG.length === 18,
    detail: `${EXECUTIVE_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allLixW3TestsPassed(): boolean {
  return runLixW3CertificationTests().every((t) => t.passed);
}
