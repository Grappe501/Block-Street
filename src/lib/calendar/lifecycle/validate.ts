import { listLifecycleItems } from "./store";
import { validateLifecycleTransitions } from "./status";
import { validateOperationalTransitions } from "./transitions";

export function validateLifecycleStore(): string[] {
  const errors: string[] = [];
  errors.push(...validateLifecycleTransitions());
  errors.push(...validateOperationalTransitions());
  const ids = new Set<string>();
  for (const i of listLifecycleItems()) {
    if (ids.has(i.itemId)) errors.push(`duplicate ${i.itemId}`);
    ids.add(i.itemId);
    if (i.softBeta && i.durableAuthority) errors.push(`invalid authority ${i.itemId}`);
  }
  return errors;
}
