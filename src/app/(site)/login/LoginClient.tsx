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

  return (
    <AuthPageShell title="Sign in" subtitle="Verify our identity to continue">
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
        <button type="submit" disabled={loading} className="w-full rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-xs text-blue-700">
          <a href="/passwordless" className="underline">Email me a sign-in link</a>
          {" · "}
          <a href="/register" className="underline">Create account</a>
          {" · "}
          <a href="/forgot-password" className="underline">Forgot password</a>
        </p>
      </form>
    </AuthPageShell>
  );
}
