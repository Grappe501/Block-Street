"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { copyTextToClipboard } from "@/lib/browser/copy-text";

export default function StartPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("Personally known — launching Block Street together");
  const [inviteUrl, setInviteUrl] = useState("");
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("grappe4arkansas@gmail.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(async (r) => {
      if (r.ok) {
        const d = await r.json();
        const em = d.profile?.primary_email as string | undefined;
        if (em === "grappe4arkansas@gmail.com" || em === "director@block-street.local") {
          setLoggedIn(true);
          setReady(true);
          return;
        }
      }
      setReady(true);
    });
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Login failed");
      return;
    }
    setLoggedIn(true);
  }

  async function createInvite(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInviteUrl("");
    setLoading(true);
    const res = await fetch("/api/launch/start-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, reason }),
    });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(d.error || "Invite failed");
      return;
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const path = d.accept_url?.startsWith("http") ? d.accept_url : `${origin}${d.accept_url}`;
    setInviteUrl(path);
    setCopyState("idle");
  }

  async function copyInviteLink() {
    if (!inviteUrl) return;
    const ok = await copyTextToClipboard(inviteUrl);
    setCopyState(ok ? "copied" : "failed");
    if (ok) {
      window.setTimeout(() => setCopyState("idle"), 2500);
    }
  }

  if (!ready) {
    return <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-500">Loading…</div>;
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Steve — start here</h1>
        <p className="mt-2 text-slate-600">
          Sign in as the system administrator to create your area and generate the first invitations.
        </p>
        <form onSubmit={login} className="mt-6 space-y-3">
          <label className="block text-sm">
            Email
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              type="password"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Your platform password"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Enter my area"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Start the chain</h1>
      <p className="mt-2 text-slate-600">
        Invite one Human at a time. They create their account, choose their school or county, then see only
        what they need — not the whole map forever.
      </p>

      <form onSubmit={createInvite} className="mt-6 space-y-3 rounded-xl border bg-white p-4">
        <label className="block text-sm">
          Their email
          <input
            type="email"
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Their name
          <input
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First and last name they are known by"
          />
        </label>
        <label className="block text-sm">
          How you know them (private)
          <textarea
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create invitation link"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {inviteUrl && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">Copy and send this link</p>
          <input
            readOnly
            value={inviteUrl}
            aria-label="Invitation link"
            className="mt-2 w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-900"
            onFocus={(e) => e.currentTarget.select()}
            onClick={(e) => e.currentTarget.select()}
          />
          <button
            type="button"
            className="mt-3 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            onClick={() => void copyInviteLink()}
          >
            {copyState === "copied" ? "Copied!" : "Copy link"}
          </button>
          {copyState === "failed" && (
            <p className="mt-2 text-sm text-amber-800" role="alert">
              Clipboard blocked — click the link field above and press Ctrl+C.
            </p>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/network" className="text-brand-700 underline">
          My network
        </Link>
        <Link href="/july-14" className="text-brand-700 underline">
          Tonight
        </Link>
        <button type="button" className="text-slate-500 underline" onClick={() => router.refresh()}>
          Refresh
        </button>
      </div>
    </div>
  );
}
