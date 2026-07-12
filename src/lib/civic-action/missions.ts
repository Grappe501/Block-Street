import { loadExecutionMissions, loadWorkstreams, persistExecutionMissions } from "./data";
import { recordInitiativeAudit } from "./audit";
import { caeId, nowIso } from "./utils";
import type { ExecutionMission, MissionStatus } from "./types";

export function listMissions(filters?: { initiative_id?: string; workstream_id?: string; status?: MissionStatus; assigned_human_id?: string }) {
  let missions = loadExecutionMissions();
  if (filters?.initiative_id) missions = missions.filter((m) => m.initiative_id === filters.initiative_id);
  if (filters?.workstream_id) missions = missions.filter((m) => m.workstream_id === filters.workstream_id);
  if (filters?.status) missions = missions.filter((m) => m.status === filters.status);
  if (filters?.assigned_human_id) missions = missions.filter((m) => m.assigned_human_id === filters.assigned_human_id);
  return missions;
}

export function getMission(id: string) {
  return loadExecutionMissions().find((m) => m.id === id) ?? null;
}

export function updateMissionStatus(id: string, status: MissionStatus, actorId: string, blockerReason?: string) {
  const missions = loadExecutionMissions();
  const idx = missions.findIndex((m) => m.id === id);
  if (idx < 0) throw new Error("Mission not found");
  missions[idx] = { ...missions[idx], status, blocker_reason: blockerReason ?? missions[idx].blocker_reason };
  persistExecutionMissions(missions);
  recordInitiativeAudit({
    initiative_id: missions[idx].initiative_id,
    institution_id: "inst-block-street",
    actor_human_id: actorId,
    event_type: "mission_status_changed",
    summary: `Mission ${id} → ${status}`,
  });
  return missions[idx];
}

export function escalateMission(id: string, actorId: string, reason: string) {
  const mission = updateMissionStatus(id, "blocked", actorId, reason);
  recordInitiativeAudit({
    initiative_id: mission.initiative_id,
    institution_id: "inst-block-street",
    actor_human_id: actorId,
    event_type: "mission_escalated",
    summary: `Mission ${id} escalated: ${reason}`,
  });
  return mission;
}

export function assignMission(id: string, humanId: string, actorId: string) {
  const missions = loadExecutionMissions();
  const idx = missions.findIndex((m) => m.id === id);
  if (idx < 0) throw new Error("Mission not found");
  missions[idx] = { ...missions[idx], assigned_human_id: humanId, status: "assigned" };
  persistExecutionMissions(missions);
  recordInitiativeAudit({
    initiative_id: missions[idx].initiative_id,
    institution_id: "inst-block-street",
    actor_human_id: actorId,
    event_type: "mission_assigned",
    summary: `Mission ${id} assigned to ${humanId}`,
  });
  return missions[idx];
}

export function getMyMissions(humanId: string) {
  return listMissions({ assigned_human_id: humanId }).filter((m) => !["completed", "cancelled", "rejected"].includes(m.status));
}

export function assertAccountableOwner(missionId: string) {
  const mission = getMission(missionId);
  if (!mission?.owner_human_id) throw new Error("Mission lacks accountable Human owner");
  if (mission.owner_human_id.startsWith("svc-")) throw new Error("Service identity cannot be accountable owner");
  return mission;
}

export function getWorkstreamMissions(workstreamId: string) {
  const ws = loadWorkstreams().find((w) => w.id === workstreamId);
  const missions = listMissions({ workstream_id: workstreamId });
  return { workstream: ws, missions };
}
