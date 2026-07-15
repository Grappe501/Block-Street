import { listVerificationItems } from "./store";
import { validateVerificationTransitions } from "./status";

export function validateVerificationStore(): string[] {
  const errors: string[] = [];
  errors.push(...validateVerificationTransitions());
  const ids = new Set<string>();
  for (const i of listVerificationItems()) {
    if (ids.has(i.itemId)) errors.push(`duplicate ${i.itemId}`);
    ids.add(i.itemId);
    if (i.softBeta && i.durableAuthority) errors.push(`invalid authority ${i.itemId}`);
  }
  return errors;
}
