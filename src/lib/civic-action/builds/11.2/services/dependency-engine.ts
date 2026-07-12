/**
 * CAE-11.2-W3 — Execution dependency engine
 */
import { readStoreSlice } from "./repository";
import { EXECUTION_STORE_KEYS } from "../data-model";
import type { ExecutionDependencyRecord } from "../data-model";

export interface DependencyEvaluation {
  blocked: boolean;
  reason?: string;
  blocking_entity_id?: string;
}

export function evaluateBlockingDependencies(
  entityId: string,
  entityType: string
): DependencyEvaluation {
  const deps = readStoreSlice<ExecutionDependencyRecord>(EXECUTION_STORE_KEYS.dependencies);
  const blocking = deps.filter(
    (d) =>
      d.source_entity_id === entityId &&
      d.source_entity_type === entityType &&
      d.dependency_type === "requires"
  );

  for (const dep of blocking) {
    const incomplete = isDependencyTargetIncomplete(dep);
    if (incomplete) {
      return {
        blocked: true,
        reason: `Requires ${dep.target_entity_type} ${dep.target_entity_id} which is incomplete`,
        blocking_entity_id: dep.target_entity_id,
      };
    }
  }
  return { blocked: false };
}

function isDependencyTargetIncomplete(dep: ExecutionDependencyRecord): boolean {
  const missions = readStoreSlice<{ canonical_id: string; lifecycle_state: string }>(EXECUTION_STORE_KEYS.missions);
  const tasks = readStoreSlice<{ canonical_id: string; lifecycle_state: string }>(EXECUTION_STORE_KEYS.tasks);
  const objectives = readStoreSlice<{ canonical_id: string; lifecycle_state: string }>(EXECUTION_STORE_KEYS.objectives);

  const lookup = [...missions, ...tasks, ...objectives].find((e) => e.canonical_id === dep.target_entity_id);
  if (!lookup) return true;
  return !["completed", "archived"].includes(lookup.lifecycle_state);
}

export function detectCircularExecutionDependency(
  sourceId: string,
  targetId: string,
  existing: ExecutionDependencyRecord[]
): boolean {
  const graph = new Map<string, string[]>();
  for (const d of existing) {
    const list = graph.get(d.source_entity_id) ?? [];
    list.push(d.target_entity_id);
    graph.set(d.source_entity_id, list);
  }
  const list = graph.get(sourceId) ?? [];
  list.push(targetId);
  graph.set(sourceId, list);

  const visited = new Set<string>();
  const stack = new Set<string>();

  function dfs(node: string): boolean {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;
    visited.add(node);
    stack.add(node);
    for (const next of graph.get(node) ?? []) {
      if (dfs(next)) return true;
    }
    stack.delete(node);
    return false;
  }
  return dfs(sourceId);
}

/** MissionDependencyService */
export const MissionDependencyService = {
  evaluate: evaluateBlockingDependencies,
  detectCycle: detectCircularExecutionDependency,
};
