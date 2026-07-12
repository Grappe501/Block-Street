import { loadUsers } from "@/lib/auth/data";
import { loadHumanIdentities } from "../data";
import { loadWave1Flags, loadWave1Memberships } from "./data";

export const WAVE1_INVARIANTS = [
  { id: "ITL-W1-INV-001", rule: "No active account exists without a canonical Human record." },
  { id: "ITL-W1-INV-002", rule: "No new Human may enter active status without an accepted invitation, except founding-seed." },
  { id: "ITL-W1-INV-003", rule: "Every invitation has exactly one originating sponsor." },
  { id: "ITL-W1-INV-004", rule: "Every accepted invitation links to exactly one Human record." },
  { id: "ITL-W1-INV-005", rule: "Every active institution membership links to one Human record." },
  { id: "ITL-W1-INV-006", rule: "No authentication provider callback may independently create an active institution membership." },
  { id: "ITL-W1-INV-007", rule: "Every Human has one required public human name." },
  { id: "ITL-W1-INV-008", rule: "Every approved alias belongs to one Human and retains approval history." },
  { id: "ITL-W1-INV-009", rule: "Invitation lineage is append-only after acceptance." },
  { id: "ITL-W1-INV-010", rule: "Invitations cannot grant permissions beyond the inviter's authorized invitation scope." },
];

export function checkWave1Invariants(): { id: string; passed: boolean; detail: string }[] {
  const flags = loadWave1Flags();
  const humans = loadHumanIdentities();
  const users = loadUsers().filter((u) => u.account_status === "active");
  const memberships = loadWave1Memberships().filter((m) => m.status === "provisional" || m.status === "active");

  return [
    {
      id: "ITL-W1-INV-001",
      passed: users.every((u) => humans.some((h) => h.user_id === u.user_id)),
      detail: `${users.length} active users, ${humans.length} human records`,
    },
    {
      id: "ITL-W1-INV-002",
      passed: Boolean(flags.INVITATION_ONLY_ENTRY_REQUIRED && flags.PUBLIC_REGISTRATION_DISABLED),
      detail: `invitation-only: ${flags.INVITATION_ONLY_ENTRY_REQUIRED}`,
    },
    {
      id: "ITL-W1-INV-007",
      passed: humans.every((h) => h.public_name && h.public_name.length >= 2),
      detail: "All humans have public names",
    },
    {
      id: "ITL-W1-INV-005",
      passed: memberships.every((m) => humans.some((h) => h.user_id === m.human_id)),
      detail: `${memberships.length} memberships linked to humans`,
    },
  ];
}

export function assertInvitationOnlyEntry() {
  const flags = loadWave1Flags();
  if (flags.INVITATION_ONLY_ENTRY_REQUIRED && flags.PUBLIC_REGISTRATION_DISABLED) {
    throw new Error(
      "This platform is invitation-only. Your authentication was successful, but no active invitation is associated with this identity."
    );
  }
}
