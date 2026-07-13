/**
 * CAE-11.7-W7 — Simulation engine (non-mutating)
 */
import { caeId } from "../../../utils";
import { communicationApplicationService } from "../application-service";
import type { SimulationRequest, SimulationResult } from "./contracts";

function countConversations(institutionId: string, initiativeId?: string, state?: string) {
  let conversations = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId);
  if (initiativeId) conversations = conversations.filter((c) => c.initiative_id === initiativeId);
  if (state) conversations = conversations.filter((c) => c.lifecycle_state === state);
  return conversations.length;
}

const SCENARIO_HANDLERS: Record<
  string,
  (params: Record<string, unknown>, institutionId: string, initiativeId?: string) => SimulationResult
> = {
  communication_plan: (params, institutionId, initiativeId) => {
    const channels = Number(params.channels ?? 3);
    const active = countConversations(institutionId, initiativeId, "active");
    return buildResult(
      "communication_plan",
      [
        `Proposed ${channels}-channel plan affects ${active} active conversation(s).`,
        "Consolidated messaging may reduce volunteer confusion.",
      ],
      ["Over-consolidation may hide mission-specific context.", "Translation workload may increase."],
      active >= 3 ? "likely" : "emerging"
    );
  },
  meeting_structure: (params, institutionId, initiativeId) => {
    const duration = Number(params.duration_minutes ?? 45);
    const meetings = communicationApplicationService
      .listMeetingsByInitiative(initiativeId ?? "")
      .filter((m) => m.institution_id === institutionId).length;
    return buildResult(
      "meeting_structure",
      [
        `Shifting to ${duration}-minute meeting blocks affects ${meetings || "upcoming"} meeting cadence.`,
        "Shorter meetings may improve agenda completion rates.",
      ],
      ["Deep deliberation topics may need separate sessions."],
      "observed"
    );
  },
  reduce_threads: (params, institutionId, initiativeId) => {
    const reduction = Number(params.threads_merged ?? 2);
    const active = countConversations(institutionId, initiativeId, "active");
    return buildResult(
      "reduce_threads",
      [
        `Merging ${reduction} thread(s) could simplify ${active} active conversation(s).`,
        "Participants may find context faster.",
      ],
      ["Thread merge loses granular audit trail unless documented."],
      "emerging"
    );
  },
  bilingual_rollout: (_params, institutionId) => {
    const total = countConversations(institutionId);
    return buildResult(
      "bilingual_rollout",
      [
        `Bilingual templates would touch ~${total} conversation scope(s).`,
        "Volunteer reach may expand to Spanish-first participants.",
      ],
      ["Translation quality requires human steward review."],
      "likely"
    );
  },
};

function buildResult(
  scenarioType: string,
  outcomes: string[],
  risks: string[],
  confidence: SimulationResult["confidence"]
): SimulationResult {
  return {
    simulation_id: caeId("csim"),
    scenario_type: scenarioType,
    outcomes,
    risks,
    confidence,
    advisory_only: true,
    note: "Simulation only — no Communication or governance state was modified.",
  };
}

export function runSimulation(
  institutionId: string,
  request: SimulationRequest,
  initiativeId?: string
): SimulationResult {
  const handler = SCENARIO_HANDLERS[request.scenario_type];
  if (!handler) {
    return {
      simulation_id: caeId("csim"),
      scenario_type: request.scenario_type,
      outcomes: [`Unknown scenario type: ${request.scenario_type}`],
      risks: [],
      confidence: "observed",
      advisory_only: true,
      note: `Supported: ${Object.keys(SCENARIO_HANDLERS).join(", ")}`,
    };
  }
  return handler(request.parameters, institutionId, initiativeId ?? request.conversation_id_optional);
}
