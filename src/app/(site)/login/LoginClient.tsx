"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("We could not sign you in. Check your email and password.");
      return;
    }
    const next = searchParams.get("next") ?? "/network";
    router.push(next);
  }

  const next = searchParams.get("next") ?? "/network";
  const inviteReturn = next.startsWith("/invite/");

  return (
    <AuthPageShell
      title="Sign in"
      subtitle={inviteReturn ? "Sign in, then we’ll return you to your invitation." : "Welcome back — continue to your board."}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-800" role="alert">{error}</p>}
        <label className="block text-sm font-medium text-blue-950">
          Email
          <input type="email" required autoComplete="email" className="mt-1 w-full rounded border border-blue-200 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-blue-950">
          Password
          <input type="password" required autoComplete="current-password" className="mt-1 w-full rounded border border-blue-200 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {inviteReturn ? (
          <p className="text-center text-xs text-blue-700">
            New here? Use your invitation link instead of creating a public account.
          </p>
        ) : (
          <p className="text-center text-xs text-blue-700">
            <a href="/forgot-password" className="underline">Forgot password</a>
            {" · "}
            <a href="/join" className="underline">I have an invitation</a>
          </p>
        )}
      </form>
    </AuthPageShell>
  );
}
