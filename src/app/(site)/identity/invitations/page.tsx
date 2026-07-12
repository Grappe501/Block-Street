"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyInvitationsPage() {
  const [invitations, setInvitations] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch("/api/v1/invitations/wave1")
      .then((r) => r.json())
      .then((d) => setInvitations(d.data ?? []));
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Link href="/identity" className="text-sm text-indigo-700 underline">
        ← Identity
      </Link>
      <h1 className="text-2xl font-bold text-slate-900">My invitations</h1>
      <p className="text-sm text-slate-600">Invitations you have sent as a sponsor.</p>
      <ul className="space-y-2">
        {invitations.map((inv) => (
          <li key={String(inv.id)} className="rounded border p-3 text-sm">
            <p className="font-semibold">{String(inv.intended_recipient_name)}</p>
            <p className="text-slate-600">{String(inv.recipient_contact_reference)} · {String(inv.status)}</p>
          </li>
        ))}
        {invitations.length === 0 && <li className="text-sm text-slate-500">No invitations sent yet.</li>}
      </ul>
    </div>
  );
}
