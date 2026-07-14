"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { LanguageToggle, useIdentityLocale } from "@/components/identity/LanguageToggle";

export default function InviteTokenPage() {
  const router = useRouter();
  const routeParams = useParams();
  const token = typeof routeParams.token === "string" ? routeParams.token : "";
  const { t } = useIdentityLocale();
  const [gateMessage, setGateMessage] = useState("");
  const [invitation, setInvitation] = useState<Record<string, unknown> | null>(null);
  const [canProceed, setCanProceed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [publicName, setPublicName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch("/api/v1/invitations/wave1/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "acceptance_start", token }),
    })
      .then((r) => r.json())
      .then((d) => {
        const gate = d.data?.gate ?? d.gate;
        if (!gate) {
          setError("This invitation is invalid, expired, or has already been used.");
          return;
        }
        setGateMessage(gate.message);
        setCanProceed(gate.activation_decision === "proceed" || gate.activation_decision === "identity_review_required");
        const inv = d.data?.invitation ?? d.invitation;
        setInvitation(inv ?? null);
        if (inv?.recipient_contact_reference) setEmail(inv.recipient_contact_reference);
        if (inv?.intended_recipient_name) setPublicName(inv.intended_recipient_name);
      })
      .catch(() => setError("Unable to verify invitation."));
  }, [token]);

  async function acceptNewHuman(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !confirmed) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/v1/invitations/wave1/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "accept",
        token,
        email,
        password,
        public_name: publicName,
        preferred_short_name: preferredName || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error?.message ?? data.error ?? "Activation failed");
      return;
    }
    router.push("/choose-place");
  }

  return (
    <AuthPageShell title={t("invite.title")} subtitle={invitation ? String(invitation.institution_id ?? "Institution invitation") : undefined}>
      <div className="mb-4 flex justify-end">
        <LanguageToggle />
      </div>

      {error && <p className="text-sm text-red-800" role="alert">{error}</p>}
      {gateMessage && <p className="text-sm text-blue-900">{gateMessage}</p>}

      {invitation && (
        <div className="mt-4 space-y-2 rounded border border-blue-100 bg-blue-50 p-3 text-xs text-blue-900">
          <p><strong>Sponsor:</strong> {String(invitation.sponsor_id ?? "—")}</p>
          <p><strong>Institution:</strong> {String(invitation.institution_id ?? "—")}</p>
          <p><strong>Role:</strong> {String(invitation.intended_role ?? "member")}</p>
          <p><strong>Expires:</strong> {invitation.expires_at ? new Date(String(invitation.expires_at)).toLocaleString() : "—"}</p>
        </div>
      )}

      {canProceed && token && (
        <form onSubmit={acceptNewHuman} className="mt-4 space-y-4 text-sm text-blue-950">
          <label className="flex items-start gap-2">
            <input type="checkbox" required checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" />
            <span>Confirm this invitation is intended for me.</span>
          </label>

          <p className="text-xs text-blue-800">{t("invite.public_name_hint")}</p>
          <label className="block font-medium">
            {t("invite.public_name")}
            <input required className="mt-1 w-full rounded border border-blue-200 px-3 py-2" value={publicName} onChange={(e) => setPublicName(e.target.value)} />
          </label>
          <label className="block font-medium">
            Preferred short name (optional)
            <input className="mt-1 w-full rounded border border-blue-200 px-3 py-2" value={preferredName} onChange={(e) => setPreferredName(e.target.value)} />
          </label>
          <label className="block font-medium">
            Email
            <input type="email" required readOnly className="mt-1 w-full rounded border border-blue-200 bg-blue-50 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block font-medium">
            Password
            <input type="password" required minLength={8} className="mt-1 w-full rounded border border-blue-200 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button type="submit" disabled={loading || !confirmed} className="w-full rounded bg-blue-700 px-4 py-3 text-white disabled:opacity-50">
            {loading ? "Activating…" : t("invite.activate")}
          </button>
          <p className="text-center text-xs text-blue-700">
            Already have an account?{" "}
            <Link href={`/login?next=/invite/${token}`} className="underline">Sign in first</Link>
          </p>
        </form>
      )}

      {!gateMessage && !error && <p className="text-sm text-blue-800">Verifying invitation…</p>}
    </AuthPageShell>
  );
}
