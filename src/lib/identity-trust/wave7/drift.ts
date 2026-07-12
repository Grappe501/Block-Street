import { loadAuthFeatureFlags } from "../auth-flags";
import { loadFeatureFlags } from "../data";
import { itlId, nowIso } from "../utils";
import { loadDriftFindings, persistDriftFindings, loadWave7Flags } from "./data";
import type { IdentityConstitutionalDriftFinding } from "./types";

export function scanConstitutionalDrift(): IdentityConstitutionalDriftFinding[] {
  const findings: IdentityConstitutionalDriftFinding[] = [];
  const flags = loadFeatureFlags();
  const authFlags = loadAuthFeatureFlags();
  const w7Flags = loadWave7Flags();
  const existing = loadDriftFindings();

  const checks: { type: string; description: string; severity: string; drifted: boolean }[] = [
    {
      type: "public_signup",
      description: "Public registration path detected",
      severity: "critical",
      drifted: authFlags.AUTH_SELF_REGISTRATION_ENABLED,
    },
    {
      type: "invitation_bypass",
      description: "Invitation-only mode disabled",
      severity: "critical",
      drifted: !flags.ITL_INVITATION_ONLY_MODE,
    },
    {
      type: "production_without_cert",
      description: "IDENTITY_PRODUCTION_CERTIFIED without certification framework",
      severity: "critical",
      drifted: Boolean(w7Flags.IDENTITY_PRODUCTION_CERTIFIED) && !Boolean(w7Flags.IDENTITY_CERTIFICATION_FRAMEWORK_ENABLED),
    },
    {
      type: "drift_monitor_disabled",
      description: "Constitutional drift monitor disabled",
      severity: "high",
      drifted: !Boolean(w7Flags.IDENTITY_CONSTITUTIONAL_DRIFT_MONITOR_ENABLED),
    },
  ];

  for (const check of checks) {
    if (!check.drifted) continue;
    const duplicate = existing.find((f) => f.drift_type === check.type && f.status === "open");
    if (duplicate) {
      findings.push(duplicate);
      continue;
    }
    const finding: IdentityConstitutionalDriftFinding = {
      id: itlId("icdf"),
      drift_type: check.type,
      description: check.description,
      severity: check.severity,
      detected_at: nowIso(),
      status: "open",
    };
    findings.push(finding);
  }

  if (findings.length > 0) {
    const merged = [...existing.filter((f) => !findings.some((n) => n.id === f.id)), ...findings.filter((f) => !existing.some((e) => e.id === f.id))];
    persistDriftFindings(merged);
  }

  return findings;
}

export function listDriftFindings(status?: IdentityConstitutionalDriftFinding["status"]) {
  let findings = loadDriftFindings();
  if (status) findings = findings.filter((f) => f.status === status);
  return findings;
}

export function resolveDriftFinding(findingId: string) {
  const findings = loadDriftFindings();
  const idx = findings.findIndex((f) => f.id === findingId);
  if (idx < 0) throw new Error("Drift finding not found");
  findings[idx] = { ...findings[idx], status: "resolved" };
  persistDriftFindings(findings);
  return findings[idx];
}

export function hasOpenDriftFindings() {
  return listDriftFindings("open").length > 0;
}
