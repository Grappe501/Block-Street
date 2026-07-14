/**
 * Client-safe education contact policy (no filesystem).
 */

export type EducationContactRole =
  | "college_leader"
  | "director"
  | "operator"
  | "participant"
  | "anonymous";

export type ContactChannel =
  | "email_approved"
  | "phone_if_permitted"
  | "campaign_relay"
  | "social_if_approved"
  | "blocked";

const AUTHORIZED: EducationContactRole[] = ["college_leader", "director", "operator"];

export function canAccessEducationContactDirectory(role: EducationContactRole): boolean {
  return AUTHORIZED.includes(role);
}

export function contactModeForScope(scopeId: string, publicVisibility: boolean): ContactChannel {
  const isHighSchoolOrSecondary =
    scopeId.startsWith("high_school:") || scopeId.startsWith("private_charter:");

  if (isHighSchoolOrSecondary) return "campaign_relay";
  if (!publicVisibility) return "campaign_relay";
  return "email_approved";
}

export type EducationContactEntry = {
  person_id: string;
  display_name: string;
  institution_scope_id: string;
  participation_type: "volunteer" | "lead";
  public_visibility: boolean;
  contact_mode: ContactChannel;
  personal_contact_visible: boolean;
  consent_note: string;
};

export type ContactDirectoryResult = {
  allowed: boolean;
  reason: string;
  entries: EducationContactEntry[];
  high_school_privacy_enforced: boolean;
  bulk_messaging_allowed: boolean;
};
