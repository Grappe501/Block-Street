/**
 * CAE-11.1-W5 — Downstream objective contract (Build 11.2)
 */
export type InitiativeObjectiveGuard = {
  initiative_id: string;
  institution_id: string;
  status: string;
  objectives_required: boolean;
  objective_updates_allowed: boolean;
  active_charter_version: number | null;
  operational_owner_human_id: string | null;
};

export const INITIATIVE_OBJECTIVE_CONTRACT_VERSION = "11.2-handoff-1";
