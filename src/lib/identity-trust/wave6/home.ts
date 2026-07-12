import { loadHumanIdentities, loadVerifications } from "../data";
import { loadIdentityCases, loadIdentityAppealRecords } from "../wave3/data";
import { listMyInstitutions } from "../wave4/memberships";
import type { IdentityHomeView } from "./types";
import { itlId, nowIso } from "../utils";
import { loadHumanHelpEvents, persistHumanHelpEvents } from "./data";

const ASSURANCE_EXPLANATIONS: Record<string, string> = {
  sponsored: "You have entered through a sponsor invitation. Independent verification may still be required.",
  verified: "The platform has received sufficient independent confirmation of your identity.",
  trusted: "You have established trusted standing within your institution.",
  federation_trusted: "You have federation-trusted standing with portable assurance recognized across institutions.",
  provisional: "Your identity is provisional while verification or local requirements are completed.",
};

export function getIdentityHome(humanId: string): IdentityHomeView | null {
  const identity = loadHumanIdentities().find((h) => h.user_id === humanId);
  if (!identity) return null;

  const memberships = listMyInstitutions(humanId);
  const verifications = loadVerifications().filter((v) => v.subject_user_id === humanId && v.independent);
  const cases = loadIdentityCases().filter(
    (c) => c.subject_human_id === humanId && !["closed", "archived"].includes(c.status)
  );
  const appeals = loadIdentityAppealRecords().filter(
    (a) => a.appellant_human_id === humanId && !["closed", "denied", "withdrawn"].includes(a.status)
  );

  const nextAction = computeNextAction(identity.trust_label, verifications.length, cases.length);

  return {
    human_id: humanId,
    global_human_id: identity.global_human_id,
    public_name: identity.public_name,
    assurance_state: identity.trust_label,
    assurance_explanation: ASSURANCE_EXPLANATIONS[identity.trust_label] ?? "Your identity status is being evaluated.",
    memberships: memberships.map((m) => ({
      institution_id: m.institution_id,
      status: m.membership_status,
      role: m.role,
      trust_state: m.institution_trust_state,
    })),
    next_action: nextAction,
    active_cases: cases.length,
    pending_appeals: appeals.length,
    verification_progress: {
      qualifying: verifications.length,
      required: 2,
      independent_required: identity.trust_label === "sponsored" || identity.trust_label === "pending_invitation",
    },
  };
}

function computeNextAction(
  trustLabel: string,
  verificationCount: number,
  openCases: number
): IdentityHomeView["next_action"] {
  if (openCases > 0) {
    return { action: "Respond to your open identity case before the deadline.", deadline: null, priority: "high" };
  }
  if (trustLabel === "sponsored" && verificationCount < 2) {
    return {
      action: "Ask one more person who knows you to verify your identity.",
      deadline: null,
      priority: "high",
    };
  }
  if (trustLabel === "provisional") {
    return { action: "Complete local verification requirements for your institution membership.", deadline: null, priority: "medium" };
  }
  return null;
}

export function getNextAction(humanId: string) {
  return getIdentityHome(humanId)?.next_action ?? null;
}

export function recordHumanHelpEvent(input: {
  human_id: string;
  workflow: string;
  help_type: string;
  point_of_confusion?: string;
}) {
  const event = {
    id: itlId("ihhe"),
    human_id: input.human_id,
    workflow: input.workflow,
    help_type: input.help_type,
    point_of_confusion: input.point_of_confusion ?? null,
    created_at: nowIso(),
  };
  const all = loadHumanHelpEvents();
  all.push(event);
  persistHumanHelpEvents(all);
  return event;
}

export function getIdentityTimeline(humanId: string) {
  const { loadIdentityLedgerEvents } = require("../wave2/data") as typeof import("../wave2/data");
  const events = loadIdentityLedgerEvents()
    .filter((e) => e.human_id === humanId || e.actor_human_id === humanId)
    .map((e) => ({
      event_type: e.event_type,
      occurred_at: e.occurred_at,
      summary: e.new_state ?? e.event_type,
      institution_id: e.institution_id,
    }));
  return events.sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
}
