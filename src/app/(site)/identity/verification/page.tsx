"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IdentityShell } from "@/components/identity/IdentityShell";
import { useIdentityLocale } from "@/components/identity/LanguageToggle";

export default function VerificationPage() {
  const { t } = useIdentityLocale();
  const [status, setStatus] = useState<Record<string, unknown> | null>(null);
  const [verifierId, setVerifierId] = useState("usr-001");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/v1/identity/me/trust").then((r) => r.json()).then((d) => setStatus(d.data?.trust ?? null));
  }, []);

  async function requestVerification(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/v1/identity/verification-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requested_verifier_human_id: verifierId,
        request_reason: reason || "Please confirm my identity",
        institution_id: "inst-block-street",
      }),
    });
    const data = await res.json();
    setMessage(res.ok ? "Verification request sent." : data.error?.message ?? "Request failed");
  }

  const trust = status as {
    assurance_state?: string;
    qualifying_confirmations?: number;
    required_confirmations?: number;
    independent_confirmations?: number;
    required_independent?: number;
    next_action?: string;
    public_badge?: string;
  } | null;

  return (
    <IdentityShell title={t("verification.title")} subtitle="Verification is not endorsement — it confirms you know this person.">
      {trust && (
        <div className="rounded border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950" role="status">
          <p className="font-semibold">Status: {trust.public_badge}</p>
          <p>Assurance: {trust.assurance_state}</p>
          <p>
            Confirmations: {trust.qualifying_confirmations} of {trust.required_confirmations} (independent:{" "}
            {trust.independent_confirmations} of {trust.required_independent})
          </p>
          <p className="mt-2">{trust.next_action}</p>
        </div>
      )}

      <form onSubmit={requestVerification} className="space-y-3 rounded border border-slate-200 p-4 text-sm">
        <p className="font-medium">{t("verification.request")}</p>
        <p className="text-xs text-slate-600">One independent Human who knows you must confirm your identity.</p>
        <label className="block">
          Verifier (Human ID)
          <input className="mt-1 w-full rounded border px-3 py-2" value={verifierId} onChange={(e) => setVerifierId(e.target.value)} required />
        </label>
        <label className="block">
          Reason (private)
          <input className="mt-1 w-full rounded border px-3 py-2" value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <button type="submit" className="w-full rounded bg-emerald-700 px-4 py-3 text-white sm:w-auto">
          {t("verification.request")}
        </button>
        {message && <p role="status">{message}</p>}
      </form>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/identity/verifications" className="text-emerald-800 underline">Verifier inbox</Link>
        <Link href="/identity" className="text-emerald-800 underline">Identity Home</Link>
      </div>
    </IdentityShell>
  );
}
