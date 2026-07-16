import { listCoreRecordItems } from "./store";
import { validateCoreRecordTransitions } from "./status";

export function validateCoreRecordStore(): string[] {
  const errors: string[] = [];
  errors.push(...validateCoreRecordTransitions());
  const ids = new Set<string>();
  for (const i of listCoreRecordItems()) {
    if (ids.has(i.itemId)) errors.push(`duplicate ${i.itemId}`);
    ids.add(i.itemId);
    if (i.softBeta && i.durableAuthority) errors.push(`invalid authority ${i.itemId}`);
  }
  return errors;
}
