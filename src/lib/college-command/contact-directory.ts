/**
 * Education-system contact directory (V2-A.2 Workstream G).
 * Server-only — uses position store. UI must not import this from client components.
 */

import { loadPositionStore } from "../position-participation/store";
import {
  canAccessEducationContactDirectory,
  contactModeForScope,
  type ContactChannel,
  type ContactDirectoryResult,
  type EducationContactEntry,
  type EducationContactRole,
} from "./contact-policy";

export type { ContactChannel, ContactDirectoryResult, EducationContactEntry, EducationContactRole };
export { canAccessEducationContactDirectory, contactModeForScope };

export function listEducationContacts(input: {
  role: EducationContactRole;
  scopeId: string;
}): ContactDirectoryResult {
  if (!canAccessEducationContactDirectory(input.role)) {
    return {
      allowed: false,
      reason: "Unauthorized: College Leader, Director, or Operator role required.",
      entries: [],
      high_school_privacy_enforced: true,
      bulk_messaging_allowed: false,
    };
  }

  const store = loadPositionStore();
  const memberships = store.memberships.filter(
    (m) => m.scope_id === input.scopeId && m.status === "active",
  );

  const byPerson = new Map<string, EducationContactEntry>();
  for (const m of memberships) {
    const person =
      store.persons.find((p) => p.canonical_person_id === m.canonical_person_id) ??
      store.persons.find((p) => p.canonical_person_id === m.person_id);
    const mode = contactModeForScope(input.scopeId, m.public_visibility);
    const personalVisible = mode !== "campaign_relay" && mode !== "blocked";
    const display =
      m.display_name ||
      person?.display_name ||
      (m.public_visibility ? "Organizer" : "Member (relay contact)");

    byPerson.set(m.canonical_person_id, {
      person_id: m.canonical_person_id,
      display_name: display,
      institution_scope_id: input.scopeId,
      participation_type: m.participation_type,
      public_visibility: m.public_visibility,
      contact_mode: mode,
      personal_contact_visible: personalVisible,
      consent_note: personalVisible
        ? "Contact only through approved campaign channels; respect preferences."
        : "Personal contact withheld — use campaign-controlled relay until privacy review completes.",
    });
  }

  return {
    allowed: true,
    reason: "ok",
    entries: [...byPerson.values()],
    high_school_privacy_enforced: contactModeForScope(input.scopeId, true) === "campaign_relay",
    bulk_messaging_allowed: false,
  };
}

export function recordContactAttempt(_input: {
  actor_role: EducationContactRole;
  target_person_id: string;
  channel: ContactChannel;
  note?: string;
}): { recorded: boolean; storage_backend: "not_persisted"; message: string } {
  return {
    recorded: false,
    storage_backend: "not_persisted",
    message: "Contact attempts are not yet durably stored (see persistence audit).",
  };
}
