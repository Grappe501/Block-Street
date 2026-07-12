/**
 * CAE-11.1-W3 — Dependency graph engine
 */
import type { InitiativeDependencyRecord } from "../data-model";

export interface DependencyReadiness {
  initiative_id: string;
  ready: boolean;
  blocking_dependencies: InitiativeDependencyRecord[];
  satisfied_dependencies: InitiativeDependencyRecord[];
  warning_dependencies: InitiativeDependencyRecord[];
  evaluated_at: string;
}

export function detectCircularDependencyCycle(
  initiativeId: string,
  dependencies: InitiativeDependencyRecord[]
): string[] | null {
  const graph = new Map<string, string[]>();
  for (const d of dependencies) {
    if (d.target_type !== "initiative") continue;
    const list = graph.get(d.initiative_id) ?? [];
    list.push(d.target_id);
    graph.set(d.initiative_id, list);
  }

  const visited = new Set<string>();
  const stack = new Set<string>();
  const path: string[] = [];

  function dfs(node: string): boolean {
    if (stack.has(node)) {
      path.push(node);
      return true;
    }
    if (visited.has(node)) return false;
    visited.add(node);
    stack.add(node);
    for (const next of graph.get(node) ?? []) {
      if (dfs(next)) {
        path.unshift(node);
        return true;
      }
    }
    stack.delete(node);
    return false;
  }

  if (dfs(initiativeId)) return path;
  return null;
}

export function evaluateDependencyReadiness(
  initiativeId: string,
  dependencies: InitiativeDependencyRecord[],
  satisfiedTargetIds: Set<string> = new Set()
): DependencyReadiness {
  const mine = dependencies.filter((d) => d.initiative_id === initiativeId);
  const blocking = mine.filter((d) => d.blocks_activation && !satisfiedTargetIds.has(d.target_id));
  const satisfied = mine.filter((d) => satisfiedTargetIds.has(d.target_id));
  const warnings = mine.filter((d) => !d.blocks_activation && !satisfiedTargetIds.has(d.target_id));

  return {
    initiative_id: initiativeId,
    ready: blocking.length === 0 && detectCircularDependencyCycle(initiativeId, dependencies) === null,
    blocking_dependencies: blocking,
    satisfied_dependencies: satisfied,
    warning_dependencies: warnings,
    evaluated_at: new Date().toISOString(),
  };
}

export function validateNewDependency(
  initiativeId: string,
  targetType: string,
  targetId: string,
  existing: InitiativeDependencyRecord[]
): { valid: boolean; error?: string; cycle?: string[] } {
  if (targetType === "initiative" && targetId === initiativeId) {
    return { valid: false, error: "Self-dependency prohibited" };
  }
  const proposed = [
    ...existing,
    {
      initiative_dependency_id: "proposed",
      initiative_id: initiativeId,
      dependency_type: "requires" as const,
      target_type: targetType as InitiativeDependencyRecord["target_type"],
      target_id: targetId,
      description: "",
      blocks_activation: true,
      blocks_completion: false,
      created_at: "",
      created_by: "",
    },
  ];
  const cycle = detectCircularDependencyCycle(initiativeId, proposed);
  if (cycle) return { valid: false, error: "CIRCULAR_DEPENDENCY_DETECTED", cycle };
  return { valid: true };
}
