/**
 * CAE-11.12-W7 — Improvement governance (candidates, proposals, lifecycle)
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type {
  ImprovementCandidate,
  ImprovementLifecycleState,
  ImprovementPilot,
  ImprovementProposal,
  ImprovementSourceType,
  ImprovementCandidateType,
} from "./contracts";

const CANDIDATES_KEY = "knowledge_improvement_candidates";
const PROPOSALS_KEY = "knowledge_improvement_proposals";
const PILOTS_KEY = "knowledge_improvement_pilots";

export function createImprovementCandidate(input: {
  institution_id: string;
  candidate_type: ImprovementCandidateType;
  source_type: ImprovementSourceType;
  source_id: string;
  title: string;
  problem_statement: string;
  evidence_references: ImprovementCandidate["evidence_references"];
  affected_entity_types?: string[];
  affected_entity_ids?: string[];
  estimated_impact?: ImprovementCandidate["estimated_impact"];
  urgency?: ImprovementCandidate["urgency"];
  confidence?: ImprovementCandidate["confidence"];
  identified_by_human_id?: string;
  identified_by_service?: string;
}): ImprovementCandidate {
  const candidate: ImprovementCandidate = {
    improvement_candidate_id: caeId("icd"),
    institution_id: input.institution_id,
    candidate_type: input.candidate_type,
    source_type: input.source_type,
    source_id: input.source_id,
    title: input.title,
    problem_statement: input.problem_statement,
    evidence_references: input.evidence_references,
    affected_entity_types: input.affected_entity_types ?? [],
    affected_entity_ids: input.affected_entity_ids ?? [],
    estimated_impact: input.estimated_impact ?? "medium",
    urgency: input.urgency ?? "medium",
    confidence: input.confidence ?? "medium",
    identified_by_human_id_optional: input.identified_by_human_id ?? null,
    identified_by_service_optional: input.identified_by_service ?? null,
    triage_status: "pending",
    created_at: nowIso(),
    advisory_only: true,
  };
  const rows = readStoreSlice<ImprovementCandidate>(CANDIDATES_KEY);
  rows.push(candidate);
  writeStoreSlice(CANDIDATES_KEY, rows);
  return candidate;
}

export function triageImprovementCandidate(
  candidateId: string,
  outcome: ImprovementCandidate["triage_status"]
): ImprovementCandidate | null {
  const rows = readStoreSlice<ImprovementCandidate>(CANDIDATES_KEY);
  const idx = rows.findIndex((c) => c.improvement_candidate_id === candidateId);
  if (idx < 0) return null;
  rows[idx] = { ...rows[idx], triage_status: outcome };
  writeStoreSlice(CANDIDATES_KEY, rows);
  return rows[idx];
}

export function createImprovementProposal(input: {
  candidate_id: string;
  institution_id: string;
  proposal_type: ImprovementCandidateType;
  proposed_change: string;
  change_rationale: string;
  expected_benefit: string;
  possible_harms?: string[];
  pilot_required?: boolean;
  measurement_plan: string;
  rollback_plan: string;
  steward_human_id: string;
  approval_authority: string;
  domain_command_optional?: string;
}): ImprovementProposal {
  const proposal: ImprovementProposal = {
    improvement_proposal_id: caeId("ipr"),
    candidate_id: input.candidate_id,
    institution_id: input.institution_id,
    proposal_type: input.proposal_type,
    proposed_change: input.proposed_change,
    change_rationale: input.change_rationale,
    expected_benefit: input.expected_benefit,
    possible_harms: input.possible_harms ?? [],
    affected_humans: [],
    affected_operations: [],
    pilot_required: input.pilot_required ?? false,
    measurement_plan: input.measurement_plan,
    rollback_plan: input.rollback_plan,
    steward_human_id: input.steward_human_id,
    approval_authority: input.approval_authority,
    status: "proposed",
    current_version: 1,
    domain_command_optional: input.domain_command_optional ?? null,
    created_at: nowIso(),
    advisory_only: true,
  };
  const rows = readStoreSlice<ImprovementProposal>(PROPOSALS_KEY);
  rows.push(proposal);
  writeStoreSlice(PROPOSALS_KEY, rows);
  return proposal;
}

export function transitionProposalStatus(
  proposalId: string,
  status: ImprovementLifecycleState
): ImprovementProposal | null {
  const rows = readStoreSlice<ImprovementProposal>(PROPOSALS_KEY);
  const idx = rows.findIndex((p) => p.improvement_proposal_id === proposalId);
  if (idx < 0) return null;
  rows[idx] = { ...rows[idx], status };
  writeStoreSlice(PROPOSALS_KEY, rows);
  return rows[idx];
}

export function listImprovementCandidates(institutionId: string) {
  return readStoreSlice<ImprovementCandidate>(CANDIDATES_KEY).filter(
    (c) => c.institution_id === institutionId
  );
}

export function listImprovementProposals(institutionId: string) {
  return readStoreSlice<ImprovementProposal>(PROPOSALS_KEY).filter(
    (p) => p.institution_id === institutionId
  );
}

export function getImprovementProposal(proposalId: string) {
  return readStoreSlice<ImprovementProposal>(PROPOSALS_KEY).find(
    (p) => p.improvement_proposal_id === proposalId
  ) ?? null;
}

export function createImprovementPilot(input: {
  improvement_proposal_id: string;
  institution_id: string;
  pilot_type: string;
  scope: string;
  success_metrics: string[];
  harm_metrics: string[];
  stop_conditions: string[];
}): ImprovementPilot {
  const pilot: ImprovementPilot = {
    pilot_id: caeId("ipl"),
    improvement_proposal_id: input.improvement_proposal_id,
    institution_id: input.institution_id,
    pilot_type: input.pilot_type,
    scope: input.scope,
    success_metrics: input.success_metrics,
    harm_metrics: input.harm_metrics,
    stop_conditions: input.stop_conditions,
    status: "draft",
    production_isolated: true,
    started_at: null,
    ended_at: null,
    advisory_only: true,
  };
  const rows = readStoreSlice<ImprovementPilot>(PILOTS_KEY);
  rows.push(pilot);
  writeStoreSlice(PILOTS_KEY, rows);
  return pilot;
}

export function startImprovementPilot(pilotId: string): ImprovementPilot | null {
  const rows = readStoreSlice<ImprovementPilot>(PILOTS_KEY);
  const idx = rows.findIndex((p) => p.pilot_id === pilotId);
  if (idx < 0) return null;
  rows[idx] = { ...rows[idx], status: "active", started_at: nowIso() };
  writeStoreSlice(PILOTS_KEY, rows);
  transitionProposalStatus(rows[idx].improvement_proposal_id, "pilot_active");
  return rows[idx];
}

export function stopImprovementPilot(pilotId: string, reason: "stopped" | "failed"): ImprovementPilot | null {
  const rows = readStoreSlice<ImprovementPilot>(PILOTS_KEY);
  const idx = rows.findIndex((p) => p.pilot_id === pilotId);
  if (idx < 0) return null;
  rows[idx] = {
    ...rows[idx],
    status: reason === "failed" ? "failed" : "stopped",
    ended_at: nowIso(),
  };
  writeStoreSlice(PILOTS_KEY, rows);
  transitionProposalStatus(
    rows[idx].improvement_proposal_id,
    reason === "failed" ? "pilot_failed" : "pilot_evaluation"
  );
  return rows[idx];
}

export function listImprovementPilots(institutionId: string) {
  return readStoreSlice<ImprovementPilot>(PILOTS_KEY).filter((p) => p.institution_id === institutionId);
}
