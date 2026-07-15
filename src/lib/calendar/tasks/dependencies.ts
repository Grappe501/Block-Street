import type { CalendarEventTaskDependency } from "./types";
import { recordTaskAudit } from "./audit";
import { getTaskById, listDependencies, listTasks, saveDependency } from "./store";

export function addTaskDependency(input: {
  eventId: string;
  fromTaskId: string;
  toTaskId: string;
  dependencyType?: CalendarEventTaskDependency["dependencyType"];
  waiverAllowed?: boolean;
}): { dependency?: CalendarEventTaskDependency; blockedReasons: string[] } {
  const blockedReasons: string[] = [];
  if (input.fromTaskId === input.toTaskId) blockedReasons.push("Self-dependency not allowed");
  const from = getTaskById(input.fromTaskId);
  const to = getTaskById(input.toTaskId);
  if (!from || !to) blockedReasons.push("Task not found");
  if (from && to && from.eventId !== to.eventId) blockedReasons.push("Cross-event dependency not allowed");
  const cycle = wouldCreateCycle(input.eventId, input.fromTaskId, input.toTaskId);
  if (cycle) blockedReasons.push("Dependency would create a cycle");
  const dup = listDependencies({ eventId: input.eventId, toTaskId: input.toTaskId }).find(
    (d) => d.fromTaskId === input.fromTaskId,
  );
  if (dup) blockedReasons.push("Duplicate dependency");
  if (blockedReasons.length > 0) return { blockedReasons };

  const now = new Date().toISOString();
  const dep: CalendarEventTaskDependency = {
    dependencyId: `dep-${input.fromTaskId}-${input.toTaskId}`,
    eventId: input.eventId,
    fromTaskId: input.fromTaskId,
    toTaskId: input.toTaskId,
    dependencyType: input.dependencyType ?? "blocks_start",
    waiverAllowed: input.waiverAllowed ?? false,
    createdAt: now,
  };
  saveDependency(dep);
  recordTaskAudit({
    entityType: "dependency",
    entityId: dep.dependencyId,
    eventId: input.eventId,
    action: "dependency_added",
    reason: `${input.fromTaskId}→${input.toTaskId}`,
  });
  return { dependency: dep, blockedReasons: [] };
}

function wouldCreateCycle(eventId: string, fromTaskId: string, toTaskId: string): boolean {
  const deps = listDependencies({ eventId });
  const graph = new Map<string, string[]>();
  for (const d of deps) {
    const arr = graph.get(d.fromTaskId) ?? [];
    arr.push(d.toTaskId);
    graph.set(d.fromTaskId, arr);
  }
  const arr = graph.get(fromTaskId) ?? [];
  arr.push(toTaskId);
  graph.set(fromTaskId, arr);

  const visited = new Set<string>();
  const stack = [toTaskId];
  while (stack.length > 0) {
    const cur = stack.pop()!;
    if (cur === fromTaskId) return true;
    if (visited.has(cur)) continue;
    visited.add(cur);
    for (const next of graph.get(cur) ?? []) stack.push(next);
  }
  return false;
}

export function detectDependencyCycles(eventId: string): string[][] {
  const deps = listDependencies({ eventId });
  const cycles: string[][] = [];
  const graph = new Map<string, string[]>();
  for (const d of deps) {
    const arr = graph.get(d.fromTaskId) ?? [];
    arr.push(d.toTaskId);
    graph.set(d.fromTaskId, arr);
  }
  const visited = new Set<string>();
  const stack = new Set<string>();

  function dfs(node: string, path: string[]): void {
    if (stack.has(node)) {
      const idx = path.indexOf(node);
      if (idx >= 0) cycles.push(path.slice(idx).concat(node));
      return;
    }
    if (visited.has(node)) return;
    visited.add(node);
    stack.add(node);
    for (const next of graph.get(node) ?? []) dfs(next, [...path, node]);
    stack.delete(node);
  }

  for (const t of listTasks({ eventId })) dfs(t.taskId, []);
  return cycles;
}

export function getPrerequisiteTaskIds(taskId: string): string[] {
  const task = getTaskById(taskId);
  if (!task) return [];
  return listDependencies({ eventId: task.eventId, toTaskId: taskId }).map((d) => d.fromTaskId);
}
