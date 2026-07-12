import { recordIdentityTrustAudit } from "./audit";
import { loadIdentityHistory, persistIdentityHistory } from "./data";
import type { IdentityEventType } from "./types";
import { generateGlobalHumanId, itlId, nowIso } from "./utils";

export function appendIdentityHistory(input: {
  global_human_id: string;
  user_id: string;
  event_type: IdentityEventType;
  actor_id: string;
  summary: string;
  details?: Record<string, unknown>;
}) {
  const entries = loadIdentityHistory();
  const entry = {
    id: itlId("ihist"),
    global_human_id: input.global_human_id,
    user_id: input.user_id,
    event_type: input.event_type,
    actor_id: input.actor_id,
    summary: input.summary,
    details: input.details ?? {},
    timestamp: nowIso(),
    immutable: true as const,
  };
  entries.push(entry);
  persistIdentityHistory(entries);

  recordIdentityTrustAudit({
    actor_id: input.actor_id,
    global_human_id: input.global_human_id,
    action: `history:${input.event_type}`,
    target_user_id: input.user_id,
    target_invitation_id: null,
    organization_id: null,
    institution_id: null,
    result: "success",
    metadata: { summary: input.summary },
  });

  return entry;
}

export function getIdentityTimeline(globalHumanId: string) {
  return loadIdentityHistory()
    .filter((e) => e.global_human_id === globalHumanId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export { generateGlobalHumanId };
