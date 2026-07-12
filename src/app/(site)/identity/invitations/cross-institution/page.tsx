"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Invitation = {
  id: string;
  inviting_institution_id: string;
  intended_recipient_name: string;
  proposed_membership_type: string;
  proposed_role: string | null;
  status: string;
  portable_assurance_requested: boolean;
  local_verification_required: boolean;
};

export default function CrossInstitutionInvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [message, setMessage] = useState("");

  const load = () => {
    fetch("/api/v1/federation/invitations")
      .then((r) => r.json())
      .then((d) => setInvitations(d.data ?? []));
  };

  useEffect(() => {
    load();
  }, []);

  const accept = async (id: string) => {
    const res = await fetch("/api/v1/federation/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept", invitation_id: id }),
    });
    const d = await res.json();
    setMessage(res.ok ? "Membership created — no duplicate Human." : d.error?.message ?? "Failed");
    load();
  };

  const decline = async (id: string) => {
    await fetch("/api/v1/federation/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "decline", invitation_id: id }),
    });
    load();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Cross-institution invitations</h1>
      <p className="text-sm text-slate-600">
        Review proposed membership, assurance recognition, and local verification requirements before accepting.
      </p>

      <ul className="space-y-4">
        {invitations.map((inv) => (
          <li key={inv.id} className="rounded border border-slate-200 p-4">
            <p className="font-semibold">{inv.inviting_institution_id}</p>
            <p className="text-sm text-slate-600">
              {inv.proposed_membership_type}
              {inv.proposed_role ? ` · ${inv.proposed_role}` : ""}
            </p>
            <p className="text-xs text-slate-500">Status: {inv.status}</p>
            {inv.portable_assurance_requested && (
              <p className="text-xs text-indigo-700">Portable Verified assurance will be recognized (no private evidence shared).</p>
            )}
            {inv.local_verification_required && (
              <p className="text-xs text-amber-700">Local verification required before full access.</p>
            )}
            {(inv.status === "sent" || inv.status === "viewed") && (
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => accept(inv.id)} className="rounded bg-indigo-700 px-3 py-1.5 text-sm text-white">
                  Accept
                </button>
                <button type="button" onClick={() => decline(inv.id)} className="rounded border px-3 py-1.5 text-sm">
                  Decline
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {message && <p className="text-sm text-emerald-800">{message}</p>}

      <Link href="/identity/institutions" className="text-sm text-indigo-700 underline">
        Back to my institutions
      </Link>
    </div>
  );
}
