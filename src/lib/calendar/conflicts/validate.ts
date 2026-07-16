import { listConflictItems, listConflictRecords } from "./store";
import { validateConflictResolutionTransitions } from "./resolve-status";
import { validateConflictTransitions } from "./status";

export function validateConflictStore(): string[] {
  const errors: string[] = [];
  errors.push(...validateConflictTransitions());
  errors.push(...validateConflictResolutionTransitions());
  const recordIds = new Set<string>();
  for (const r of listConflictRecords()) {
    if (recordIds.has(r.conflictId)) errors.push(`duplicate record ${r.conflictId}`);
    recordIds.add(r.conflictId);
    if (r.softBeta && r.durableAuthority) errors.push(`invalid authority ${r.conflictId}`);
  }
  const itemIds = new Set<string>();
  for (const i of listConflictItems()) {
    if (itemIds.has(i.itemId)) errors.push(`duplicate item ${i.itemId}`);
    itemIds.add(i.itemId);
    if (i.softBeta && i.durableAuthority) errors.push(`invalid item authority ${i.itemId}`);
  }
  return errors;
}
