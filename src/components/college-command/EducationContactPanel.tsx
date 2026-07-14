"use client";

import { useMemo, useState } from "react";
import {
  canAccessEducationContactDirectory,
  contactModeForScope,
  type ContactDirectoryResult,
  type EducationContactRole,
} from "@/lib/college-command/contact-policy";

type Props = {
  /** Server-built snapshots keyed by scope id (no client fs). */
  snapshots: Record<string, ContactDirectoryResult>;
};

export function EducationContactPanel({ snapshots }: Props) {
  const scopeIds = Object.keys(snapshots);
  const [role, setRole] = useState<EducationContactRole>("college_leader");
  const [scopeId, setScopeId] = useState(scopeIds[0] ?? "school:henderson-state");

  const result = useMemo((): ContactDirectoryResult => {
    if (!canAccessEducationContactDirectory(role)) {
      return {
        allowed: false,
        reason: "Unauthorized: College Leader, Director, or Operator role required.",
        entries: [],
        high_school_privacy_enforced: true,
        bulk_messaging_allowed: false,
      };
    }
    const base = snapshots[scopeId] ?? {
      allowed: true,
      reason: "ok",
      entries: [],
      high_school_privacy_enforced: contactModeForScope(scopeId, true) === "campaign_relay",
      bulk_messaging_allowed: false,
    };
    return {
      ...base,
      high_school_privacy_enforced: contactModeForScope(scopeId, true) === "campaign_relay",
    };
  }, [role, scopeId, snapshots]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-bold text-slate-950">Education contact directory</h2>
      <p className="mt-1 text-xs text-slate-600">
        Permissioned organizing contacts only. Unrestricted bulk messaging is disabled. High-school /
        secondary contacts use campaign relay until age-safety review completes.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as EducationContactRole)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        >
          <option value="college_leader">College Leader</option>
          <option value="director">Director</option>
          <option value="operator">Operator</option>
          <option value="participant">Participant (denied)</option>
          <option value="anonymous">Anonymous (denied)</option>
        </select>
        <select
          value={scopeId}
          onChange={(e) => setScopeId(e.target.value)}
          className="min-w-[240px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        >
          {scopeIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>

      {!result.allowed ? (
        <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-950">
          {result.reason}
        </p>
      ) : (
        <>
          <p className="mt-3 text-xs text-slate-600">
            Privacy:{" "}
            {result.high_school_privacy_enforced ? "relay enforced for this scope type" : "approved channels"} ·
            Bulk messaging: {result.bulk_messaging_allowed ? "allowed" : "blocked"} · {result.entries.length}{" "}
            people
          </p>
          {result.entries.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No active memberships for this scope yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-slate-100 text-sm">
              {result.entries.map((e) => (
                <li key={e.person_id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <div>
                    <p className="font-medium text-slate-950">{e.display_name}</p>
                    <p className="text-xs text-slate-600">
                      {e.participation_type} · {e.contact_mode}
                      {e.personal_contact_visible ? "" : " · personal contact hidden"}
                    </p>
                    <p className="text-[11px] text-slate-500">{e.consent_note}</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800"
                    onClick={() => {
                      window.alert(
                        e.contact_mode === "campaign_relay"
                          ? "Campaign relay queued (personal details not exposed)."
                          : "Approved contact channel ready (not yet backed by durable attempt log).",
                      );
                    }}
                  >
                    Contact
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
