"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { LanguageToggle } from "@/components/identity/LanguageToggle";

function errorMessage(data: unknown): string {
  if (!data || typeof data !== "object") return "Activation failed";
  const d = data as { error?: unknown; message?: string };
  if (typeof d.error === "string") return d.error;
  if (d.error && typeof d.error === "object" && "message" in d.error) {
    return String((d.error as { message: string }).message);
  }
  if (typeof d.message === "string") return d.message;
  return "Activation failed";
}

export default function InviteTokenPage() {
  const router = useRouter();
  const routeParams = useParams();
  const token = typeof routeParams.token === "string" ? routeParams.token : "";
  const [gateMessage, setGateMessage] = useState("");
  const [decision, setDecision] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Record<string, unknown> | null>(null);
  const [canProceed, setCanProceed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [publicName, setPublicName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.authenticated && d?.profile?.user_id) {
          setSessionUserId(String(d.profile.user_id));
          setSessionEmail(String(d.profile.primary_email ?? ""));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/v1/invitations/wave1/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "acceptance_start", token }),
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) {
          setError(errorMessage(d));
          return;
        }
        const gate = d.data?.gate ?? d.gate;
        if (!gate) {
          setError("This invitation is invalid, expired, or has already been used.");
          return;
        }
        setGateMessage(gate.message);
        setDecision(gate.activation_decision ?? null);
        setCanProceed(gate.activation_decision === "proceed");
        const inv = d.data?.invitation ?? d.invitation;
        setInvitation(inv ?? null);
        if (inv?.recipient_contact_reference) setEmail(String(inv.recipient_contact_reference));
        if (inv?.intended_recipient_name) setPublicName(String(inv.intended_recipient_name));
      })
      .catch(() => setError("Unable to verify invitation."));
  }, [token]);

  async function accept(payload: Record<string, unknown>) {
    setLoading(true);
    setError("");
    const referredBy = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bs_referred_by="))
      ?.split("=")[1];
    const res = await fetch("/api/v1/invitations/wave1/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "accept",
        token,
        referred_by: referredBy ? decodeURIComponent(referredBy) : undefined,
        ...payload,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(errorMessage(data));
      return;
    }
    if (data.data?.requires_existing_human_confirmation) {
      setError(
        data.data.message ??
          "An existing identity was found. Sign in with that account, then accept again.",
      );
      return;
    }
    const next = (data.data?.next ?? data.next ?? "/choose-place") as string;
    router.push(next);
  }

  async function acceptNewHuman(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !confirmed) return;
    await accept({
      email,
      password,
      public_name: publicName,
      preferred_short_name: preferredName || undefined,
    });
  }

  async function acceptSignedIn() {
    if (!token || !sessionUserId || !sessionEmail) return;
    await accept({
      email: sessionEmail,
      password: "unused-link-path",
      public_name: publicName || sessionEmail.split("@")[0] || "Member",
      link_existing_user_id: sessionUserId,
    });
  }

  const friendlyGate =
    decision === "proceed"
      ? "This invitation looks good. Create your account to continue."
      : gateMessage;

  return (
    <AuthPageShell title="Accept your invitation" subtitle="Three quick steps: confirm it’s you, set a password, continue.">
      <div className="mb-4 flex justify-end">
        <LanguageToggle />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      {friendlyGate && !error && <p className="text-sm text-blue-900">{friendlyGate}</p>}

      {decision === "already_accepted" && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-semibold">This invitation is already active.</p>
          <Link href="/login?next=/choose-place" className="mt-2 inline-block underline">
            Sign in to continue →
          </Link>
        </div>
      )}

      {decision === "identity_review_required" && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Sign in needed</p>
          <p className="mt-1">
            An account already matches this email. Sign in, then return to this link — or ask your host for a fresh
            invite if the email is wrong.
          </p>
          <Link href={`/login?next=/invite/${token}`} className="mt-2 inline-block font-semibold underline">
            Sign in, then accept →
          </Link>
        </div>
      )}

      {invitation && (
        <div className="mt-4 space-y-1 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-950">
          <p>
            <strong>{String(invitation.intended_recipient_name ?? "Invited guest")}</strong>
          </p>
          <p className="text-xs text-blue-900">{String(invitation.recipient_contact_reference ?? "")}</p>
        </div>
      )}

      {canProceed && token && sessionUserId && (
        <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm">
          <p className="font-semibold text-brand-950">Signed in as {sessionEmail}</p>
          <p className="mt-1 text-brand-900">Accept this invitation onto your existing account.</p>
          <button
            type="button"
            disabled={loading}
            onClick={() => void acceptSignedIn()}
            className="mt-3 w-full rounded-lg bg-brand-700 px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Accepting…" : "Accept with my signed-in account"}
          </button>
        </div>
      )}

      {canProceed && token && !sessionUserId && (
        <form onSubmit={acceptNewHuman} className="mt-4 space-y-4 text-sm text-blue-950">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              required
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1"
            />
            <span>Confirm this invitation is intended for me.</span>
          </label>

          <label className="block font-medium">
            Your name
            <input
              required
              className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2"
              value={publicName}
              onChange={(e) => setPublicName(e.target.value)}
              placeholder="How people know you"
            />
          </label>
          <label className="block font-medium">
            Short name (optional)
            <input
              className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2"
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
              placeholder="What to show on your board"
            />
          </label>
          <label className="block font-medium">
            Email
            <input
              type="email"
              required
              readOnly
              className="mt-1 w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2"
              value={email}
            />
          </label>
          <label className="block font-medium">
            Create a password
            <input
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !confirmed}
            className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account and continue"}
          </button>
          <p className="text-center text-xs text-blue-700">
            Already have an account?{" "}
            <Link href={`/login?next=/invite/${token}`} className="underline">
              Sign in first
            </Link>
          </p>
        </form>
      )}

      {!gateMessage && !error && <p className="text-sm text-blue-800">Verifying invitation…</p>}
    </AuthPageShell>
  );
}
