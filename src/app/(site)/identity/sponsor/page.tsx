"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IdentityShell } from "@/components/identity/IdentityShell";
import { useIdentityLocale } from "@/components/identity/LanguageToggle";

export default function SponsorDashboardPage() {
  const { t } = useIdentityLocale();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/v1/sponsors/me").then((r) => r.json()).then((d) => setData(d.data ?? null));
  }, []);

  const privilege = data?.privilege as Record<string, unknown> | undefined;

  async function sendInvitation(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/v1/identity-trust/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        invite_reason: reason,
        sponsor_agreement_accepted: true,
        institution_id: "inst-block-street",
        organization_id: "org-block-street",
        intended_role: "volunteer",
      }),
    });
    const d = await res.json();
    setMessage(res.ok ? "Invitation sent to one Human." : d.error?.message ?? "Failed");
  }

  return (
    <IdentityShell title={t("sponsor.title")} subtitle="One invitation at a time — bulk invitations are not permitted.">
      {privilege && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded border p-3 text-center">
            <p className="text-xs text-slate-600">Privilege</p>
            <p className="text-lg font-bold">{String(privilege.status)}</p>
          </div>
          <div className="rounded border p-3 text-center">
            <p className="text-xs text-slate-600">Active limit</p>
            <p className="text-lg font-bold">
              {String(privilege.active_invitations)} / {String(privilege.active_invitation_limit)}
            </p>
          </div>
        </div>
      )}

      <p className="text-sm text-slate-600">
        Before inviting, you affirm that you personally know the individual or have directly verified their identity.
        You are responsible for the integrity of the invitation — not their future behavior.
      </p>

      <form onSubmit={sendInvitation} className="space-y-3 rounded border p-4 text-sm">
        <p className="font-semibold">{t("sponsor.invite")}</p>
        <label className="block">
          Human email
          <input type="email" required className="mt-1 w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          How you know this person (private)
          <textarea required className="mt-1 w-full rounded border px-3 py-2" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <label className="flex items-start gap-2 text-xs">
          <input type="checkbox" required className="mt-1" />
          I accept sponsor responsibility for this invitation.
        </label>
        <button type="submit" className="w-full rounded bg-indigo-700 px-4 py-3 text-white sm:w-auto">
          {t("sponsor.invite")}
        </button>
        {message && <p role="status">{message}</p>}
      </form>

      <Link href="/identity/invitations" className="text-sm text-indigo-700 underline">View sent invitations</Link>
    </IdentityShell>
  );
}
