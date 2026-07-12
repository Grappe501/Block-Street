/**
 * CAE-11.2-W4 — Workstream board + mission workspace assemblers
 */
import { objectiveApplicationService } from "../application-service";
import { humanLabel } from "./experience-context";
import { missionStatusLabel } from "./status-labels";
import { t } from "./locale";
import type { MissionWorkspaceView, WorkstreamColumnView } from "./view-models";
import type { ObjectiveExperienceContext } from "./experience-context";

const BOARD_COLUMNS = [
  { column: "planning", label: "Planning", states: ["draft", "planned"] },
  { column: "ready", label: "Ready", states: ["ready", "approved"] },
  { column: "active", label: "Active", states: ["active", "on_track"] },
  { column: "blocked", label: "Blocked", states: ["needs_attention", "at_risk", "blocked", "paused"] },
  { column: "review", label: "Needs Review", states: ["proposed"] },
  { column: "completed", label: "Completed", states: ["completed"] },
];

export function assembleWorkstreamBoard(
  initiativeId: string,
  objectiveId: string,
  ctx: ObjectiveExperienceContext
): { columns: WorkstreamColumnView[]; empty_state: { title: string; body: string; action_label: string } | null } {
  const bundle = objectiveApplicationService.getObjectiveBundle(objectiveId);
  if (!bundle) return { columns: [], empty_state: null };

  const columns: WorkstreamColumnView[] = BOARD_COLUMNS.map((col) => ({
    column: col.column,
    label: col.label,
    cards: bundle.workstreams
      .filter((w) => col.states.includes(w.lifecycle_state))
      .map((w) => {
        const missions = bundle.missions.filter((m) => m.workstream_id === w.canonical_id);
        return {
          workstream_id: w.canonical_id,
          title: w.display_name,
          purpose: w.purpose,
          owner_label: humanLabel(w.operational_owner_human_id),
          mission_count: missions.length,
          blocker_summary: missions.some((m) => m.lifecycle_state === "paused") ? "Paused missions" : null,
          progress_label: `${missions.filter((m) => m.lifecycle_state === "completed").length}/${missions.length} missions complete`,
        };
      }),
  }));

  const empty =
    bundle.workstreams.length === 0
      ? {
          title: t(ctx.locale, "workstream.empty.title"),
          body: t(ctx.locale, "workstream.empty.body"),
          action_label: t(ctx.locale, "workstream.empty.action"),
        }
      : null;

  return { columns, empty_state: empty };
}

export function assembleMissionWorkspace(
  initiativeId: string,
  objectiveId: string,
  missionId: string,
  ctx: ObjectiveExperienceContext
): MissionWorkspaceView | null {
  const bundle = objectiveApplicationService.getObjectiveBundle(objectiveId);
  if (!bundle) return null;
  const mission = bundle.missions.find((m) => m.canonical_id === missionId);
  if (!mission) return null;
  const workstream = bundle.workstreams.find((w) => w.canonical_id === mission.workstream_id);
  const tasks = bundle.tasks.filter((t) => t.mission_id === missionId);

  return {
    mission_id: missionId,
    display_name: mission.display_name,
    workstream_name: workstream?.display_name ?? "Workstream",
    objective_name: bundle.objective.display_name,
    operational_lead_label: humanLabel(mission.operational_lead_human_id),
    status_label: missionStatusLabel(mission.lifecycle_state),
    due_date: mission.finish_date,
    sections: [
      { key: "overview", label: "Overview", summary: mission.summary || mission.purpose },
      { key: "tasks", label: "Tasks", summary: `${tasks.length} tasks` },
      { key: "evidence", label: "Evidence", summary: "Upload proof of progress" },
      { key: "people", label: "People", summary: humanLabel(mission.operational_lead_human_id) },
      { key: "timeline", label: "Timeline", summary: mission.start_date ?? "Not scheduled" },
      { key: "history", label: "History", summary: "Lifecycle and changes" },
    ],
    tasks: tasks.map((task) => ({
      id: task.canonical_id,
      description: task.description,
      status_label: missionStatusLabel(task.lifecycle_state),
      owner_label: humanLabel(task.current_responsible_human_id ?? task.operational_owner_human_id),
    })),
  };
}
