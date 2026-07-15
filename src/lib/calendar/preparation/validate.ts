import { listPreparationItems } from "./store";
import { validatePreparationTransitions } from "./status";

export function validatePreparationStore(): string[] {
  const errors: string[] = [];
  errors.push(...validatePreparationTransitions());
  const ids = new Set<string>();
  for (const i of listPreparationItems()) {
    if (ids.has(i.itemId)) errors.push(`duplicate ${i.itemId}`);
    ids.add(i.itemId);
    if (i.softBeta && i.durableAuthority) errors.push(`invalid authority ${i.itemId}`);
  }
  return errors;
}
