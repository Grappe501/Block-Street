/**
 * CAE-11.12-W7 — Approved improvement implementation (Wave 3 command dispatch only)
 */
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeCommandEnvelope } from "../services/commands";
import { getImprovementProposal, transitionProposalStatus } from "./improvement-governance";

export type ImplementationResult = {
  success: boolean;
  proposal_id: string;
  command_dispatched: string | null;
  domain_result_message: string;
  canonical_mutation_via_w3: boolean;
  direct_store_mutation: false;
};

export function implementApprovedImprovement(
  proposalId: string,
  actorHumanId: string,
  permissions: string[]
): ImplementationResult {
  const proposal = getImprovementProposal(proposalId);
  if (!proposal) {
    return {
      success: false,
      proposal_id: proposalId,
      command_dispatched: null,
      domain_result_message: "Proposal not found",
      canonical_mutation_via_w3: false,
      direct_store_mutation: false,
    };
  }

  if (proposal.status !== "approved_for_adoption" && proposal.status !== "implementation_active") {
    return {
      success: false,
      proposal_id: proposalId,
      command_dispatched: null,
      domain_result_message: `Proposal status ${proposal.status} does not allow implementation`,
      canonical_mutation_via_w3: false,
      direct_store_mutation: false,
    };
  }

  const commandType = proposal.domain_command_optional ?? "CreateKnowledgeArtifact";
  const envelope: KnowledgeCommandEnvelope = {
    command_id: `cmd-impl-${proposalId}`,
    command_type: commandType as KnowledgeCommandEnvelope["command_type"],
    actor_human_id: actorHumanId,
    institution_id: proposal.institution_id,
    active_membership_id: "mem-001",
    initiative_id_optional: null,
    entity_id_optional: null,
    expected_version_optional: null,
    requested_at: new Date().toISOString(),
    request_id: `req-impl-${proposalId}`,
    correlation_id: `corr-impl-${proposalId}`,
    idempotency_key: `impl-${proposalId}`,
    reason_optional: proposal.change_rationale,
    request_source: "human",
    payload: {
      display_name: proposal.proposed_change.slice(0, 120),
      reason: proposal.change_rationale,
      improvement_proposal_id: proposalId,
    },
  };

  transitionProposalStatus(proposalId, "implementation_active");
  const result = knowledgeApplicationService.executeCommand(envelope, permissions);
  if (result.success) {
    transitionProposalStatus(proposalId, "outcome_review");
  }

  return {
    success: result.success,
    proposal_id: proposalId,
    command_dispatched: commandType,
    domain_result_message: result.success
      ? "Domain command executed via Wave 3 engine"
      : result.validation_errors[0]?.message ?? "Command failed",
    canonical_mutation_via_w3: result.success,
    direct_store_mutation: false,
  };
}
