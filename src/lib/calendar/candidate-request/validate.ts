import { listCandidateItems } from "./store";
import { validateCandidateTransitions } from "./status";

export function validateCandidateStore(): string[] {
  const errors: string[] = [];
  errors.push(...validateCandidateTransitions());
  const ids = new Set<string>();
  for (const i of listCandidateItems()) {
    if (ids.has(i.itemId)) errors.push(`duplicate ${i.itemId}`);
    ids.add(i.itemId);
    if (i.softBeta && i.durableAuthority) errors.push(`invalid authority ${i.itemId}`);
  }
  return errors;
}
