import { listRsvpItems } from "./store";
import { validateRsvpTransitions } from "./status";

export function validateRsvpStore(): string[] {
  const errors: string[] = [];
  errors.push(...validateRsvpTransitions());
  const ids = new Set<string>();
  for (const i of listRsvpItems()) {
    if (ids.has(i.itemId)) errors.push(`duplicate ${i.itemId}`);
    ids.add(i.itemId);
    if (i.softBeta && i.durableAuthority) errors.push(`invalid authority ${i.itemId}`);
  }
  return errors;
}
