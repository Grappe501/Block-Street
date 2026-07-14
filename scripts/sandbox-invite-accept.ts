/**
 * Sandbox: create Wave1 invite + accept for a throwaway address.
 * npm run sandbox:invite-accept
 *
 * Does not hit production Netlify Blobs when run locally (seed path).
 */
import { randomBytes } from "crypto";
import { createWave1Invitation } from "../src/lib/identity-trust/wave1/engine";
import { completeWave1Activation, startWave1Acceptance } from "../src/lib/identity-trust/wave1/acceptance";
import { loadUsers } from "../src/lib/auth/data";

const sponsor =
  loadUsers().find((u) => u.primary_email === "grappe4arkansas@gmail.com") ??
  loadUsers().find((u) => u.primary_email === "director@block-street.local") ??
  loadUsers()[0];

if (!sponsor) {
  console.error("No sponsor user in seed — cannot sandbox invite.");
  process.exit(1);
}

const stamp = randomBytes(3).toString("hex");
const email = `sandbox.college.${stamp}@example.com`;
const name = `Sandbox College ${stamp}`;

console.log("sponsor", sponsor.primary_email, sponsor.user_id);
console.log("creating invite for", email);

const created = createWave1Invitation({
  sponsor_human_id: sponsor.user_id,
  institution_id: "inst-block-street",
  organization_unit_id: "org-block-street",
  intended_recipient_name: name,
  recipient_email: email,
  proposed_role_id: "member",
  invitation_purpose: "Sandbox invite accept test",
  relationship_basis: "other_directly_known",
  primary_attestation: true,
  secondary_attestation: true,
});

console.log("token", created.token);
console.log("accept path", `/invite/${created.token}`);

const start = startWave1Acceptance(created.token);
console.log("gate", start.gate.activation_decision, start.gate.message);

if (start.gate.activation_decision !== "proceed") {
  console.error("SANDBOX FAIL: gate did not proceed");
  process.exit(1);
}

const password = `Sandbox-${stamp}-Ok9`;
const activated = completeWave1Activation({
  token: created.token,
  email,
  password,
  public_name: name,
  preferred_short_name: "Sandbox",
});

console.log("activated user", activated.user_id ?? (activated as { human_id?: string }).human_id);
console.log("session", activated.session_id ? "issued" : "none");
console.log("next", activated.next);
console.log("SANDBOX PASS");
