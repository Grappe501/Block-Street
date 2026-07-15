import { listFollowUpItems } from "./store";
import { validateFollowUpTransitions } from "./status";

export function validateFollowUpStore(): string[] {
  const errors: string[] = [];
  errors.push(...validateFollowUpTransitions());
  const ids = new Set<string>();
  for (const i of listFollowUpItems()) {
    if (ids.has(i.itemId)) errors.push(`duplicate ${i.itemId}`);
    ids.add(i.itemId);
    if (i.softBeta && i.durableAuthority) errors.push(`invalid authority ${i.itemId}`);
  }
  return errors;
}
