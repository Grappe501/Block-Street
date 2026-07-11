"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, display_name: displayName }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      return;
    }
    router.push("/onboarding");
  }

  return (
    <AuthPageShell title="Create account" subtitle="Join the platform with a verified identity">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-800" role="alert">{error}</p>}
        <label className="block text-sm font-medium text-blue-950">
          Display name
          <input required className="mt-1 w-full rounded border border-blue-200 px-3 py-2" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-blue-950">
          Email
          <input type="email" required className="mt-1 w-full rounded border border-blue-200 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-blue-950">
          Password
          <input type="password" required minLength={8} className="mt-1 w-full rounded border border-blue-200 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded bg-blue-700 px-4 py-2 text-white">{loading ? "Creating…" : "Create account"}</button>
        <p className="text-center text-xs text-blue-700"><a href="/login" className="underline">Already have an account?</a></p>
      </form>
    </AuthPageShell>
  );
}
