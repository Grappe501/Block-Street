import { detectDependencyCycles } from "./dependencies";
import { getTaskById, listDependencies, listTasks } from "./store";
import { validateTaskTransitions } from "./status";

export function validateTaskStore(): string[] {
  const errors: string[] = [];
  errors.push(...validateTaskTransitions());
  const ids = new Set<string>();
  for (const t of listTasks()) {
    if (ids.has(t.taskId)) errors.push(`duplicate task ${t.taskId}`);
    ids.add(t.taskId);
    if (t.softBeta && t.durableAuthority) errors.push(`invalid authority ${t.taskId}`);
  }
  const eventIds = new Set(listTasks().map((t) => t.eventId));
  for (const eid of eventIds) {
    if (detectDependencyCycles(eid).length > 0) errors.push(`cycle in ${eid}`);
  }
  for (const d of listDependencies()) {
    if (!getTaskById(d.fromTaskId) || !getTaskById(d.toTaskId)) errors.push(`orphan dependency ${d.dependencyId}`);
  }
  return errors;
}
