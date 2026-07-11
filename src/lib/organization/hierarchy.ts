import { loadUnits } from "./data";
import type { OrganizationalUnit, StructureNode } from "./types";

export function getUnit(unitId: string) {
  return loadUnits().find((u) => u.id === unitId) ?? null;
}

export function listInstitutionUnits(institutionId: string) {
  return loadUnits().filter((u) => u.institution_id === institutionId && u.status !== "archived");
}

export function getAncestors(unitId: string): OrganizationalUnit[] {
  const units = loadUnits();
  const ancestors: OrganizationalUnit[] = [];
  let current = units.find((u) => u.id === unitId);
  while (current?.parent_unit_id) {
    const parent = units.find((u) => u.id === current!.parent_unit_id);
    if (!parent) break;
    ancestors.push(parent);
    current = parent;
  }
  return ancestors;
}

export function getDescendants(unitId: string): OrganizationalUnit[] {
  const units = loadUnits();
  const result: OrganizationalUnit[] = [];
  const walk = (id: string) => {
    for (const child of units.filter((u) => u.parent_unit_id === id)) {
      result.push(child);
      walk(child.id);
    }
  };
  walk(unitId);
  return result;
}

export function wouldCreateCycle(unitId: string, newParentId: string | null): boolean {
  if (!newParentId) return false;
  if (unitId === newParentId) return true;
  const descendants = getDescendants(unitId);
  return descendants.some((d) => d.id === newParentId);
}

export function buildStructureTree(institutionId: string): StructureNode[] {
  const units = listInstitutionUnits(institutionId);
  const build = (parentId: string | null, depth: number): StructureNode[] =>
    units
      .filter((u) => u.parent_unit_id === parentId)
      .map((unit) => ({
        unit,
        depth,
        children: build(unit.id, depth + 1),
      }));
  return build(null, 0);
}

export function validateParentChildType(parentType: string | null, childType: string, unitTypes: Array<{ key: string; allowed_parent_types: string[] }>) {
  const typeDef = unitTypes.find((t) => t.key === childType);
  if (!typeDef) return false;
  if (!parentType) return typeDef.allowed_parent_types.includes("institution");
  return typeDef.allowed_parent_types.includes(parentType);
}
