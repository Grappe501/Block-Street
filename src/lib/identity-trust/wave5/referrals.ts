import { itlId, nowIso } from "../utils";
import { loadSignalReferrals, persistSignalReferrals } from "./data";
import type { IdentityIntelligenceSignal, IdentitySignalReferral } from "./types";
import { PROHIBITED_AUTOMATIC_ACTIONS } from "./rules";

export function createReferral(input: {
  signal: IdentityIntelligenceSignal;
  referral_type: string;
  institution_id?: string;
  reason: string;
  recommended_actions: string[];
}): IdentitySignalReferral {
  const referral: IdentitySignalReferral = {
    id: itlId("isref"),
    signal_id: input.signal.id,
    referral_type: input.referral_type,
    institution_id: input.institution_id ?? null,
    priority: input.signal.priority,
    reason: input.reason,
    recommended_actions: input.recommended_actions,
    prohibited_actions: PROHIBITED_AUTOMATIC_ACTIONS,
    created_at: nowIso(),
    work_item_id: itlId("wi"),
    status: "open",
  };
  const all = loadSignalReferrals();
  all.push(referral);
  persistSignalReferrals(all);
  return referral;
}

export function routeSignalReferral(signal: IdentityIntelligenceSignal): IdentitySignalReferral | null {
  if (signal.severity === "SI-5") {
    const type =
      signal.signal_type.includes("authentication") || signal.signal_code.startsWith("AUTH")
        ? "security_review"
        : signal.signal_code.startsWith("CTX") || signal.signal_code.startsWith("FED")
          ? "federation_review"
          : "identity_governance_review";
    return createReferral({
      signal,
      referral_type: type,
      reason: signal.summary,
      recommended_actions: ["Human triage within SLA", "Review supporting features and counterevidence"],
    });
  }
  if (signal.severity === "SI-4" || signal.severity === "SI-3") {
    return createReferral({
      signal,
      referral_type: "operational_review",
      reason: signal.summary,
      recommended_actions: ["Review signal", "Mark benign, explained, or refer to governance"],
    });
  }
  return null;
}

export function listReferrals(filters?: { status?: string; signal_id?: string }) {
  let refs = loadSignalReferrals();
  if (filters?.status) refs = refs.filter((r) => r.status === filters.status);
  if (filters?.signal_id) refs = refs.filter((r) => r.signal_id === filters.signal_id);
  return refs;
}
