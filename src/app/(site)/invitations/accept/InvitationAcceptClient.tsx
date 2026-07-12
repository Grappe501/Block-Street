"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function InvitationAcceptClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [gateMessage, setGateMessage] = useState("");
  const [canProceed, setCanProceed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [publicName, setPublicName] = useState("");
  const [preferredName, setPreferredName] = useState("");

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
        const inv = d.data?.invitation;
        if (inv?.recipient_contact_reference) setEmail(inv.recipient_contact_reference);
        if (inv?.intended_recipient_name) setPublicName(inv.intended_recipient_name);
      })
      .catch(() => setError("Unable to verify invitation."));
  }, [token]);

  async function acceptNewHuman(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
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
    if (data.data?.requires_existing_human_confirmation) {
      setError(data.data.message);
      return;
    }
    router.push("/onboarding");
  }

  return (
    <AuthPageShell title="Accept invitation" subtitle="Declare your public human identity">
      {error && (
        <p className="text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      {gateMessage && <p className="text-sm text-blue-900">{gateMessage}</p>}

      {canProceed && token && (
        <form onSubmit={acceptNewHuman} className="mt-4 space-y-4 text-sm text-blue-950">
          <p className="text-xs text-blue-800">
            Use the name you are publicly known by — not a username or slogan.
          </p>
          <label className="block font-medium">
            Public name
            <input
              required
              className="mt-1 w-full rounded border border-blue-200 px-3 py-2"
              value={publicName}
              onChange={(e) => setPublicName(e.target.value)}
            />
          </label>
          <label className="block font-medium">
            Preferred short name (optional)
            <input
              className="mt-1 w-full rounded border border-blue-200 px-3 py-2"
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
            />
          </label>
          <label className="block font-medium">
            Email
            <input
              type="email"
              required
              readOnly
              className="mt-1 w-full rounded border border-blue-200 bg-blue-50 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block font-medium">
            Password
            <input
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded border border-blue-200 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" disabled={loading} className="w-full rounded bg-blue-700 px-4 py-2 text-white">
            {loading ? "Activating…" : "Activate identity"}
          </button>
          <p className="text-center text-xs text-blue-700">
            Already have an account?{" "}
            <a href={`/login?next=/invitations/accept?token=${token}`} className="underline">
              Sign in first
            </a>
          </p>
        </form>
      )}

      {!gateMessage && !error && <p className="text-sm text-blue-800">Verifying invitation…</p>}
    </AuthPageShell>
  );
}
