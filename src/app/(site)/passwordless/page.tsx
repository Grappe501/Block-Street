"use client";

import { useState } from "react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function PasswordlessPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/passwordless/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setSent(true);
    if (data.dev_token) setDevToken(data.dev_token);
  }

  return (
    <AuthPageShell title="Passwordless sign-in" subtitle="We will send a secure, time-limited sign-in link">
      {sent ? (
        <div className="space-y-3 text-sm text-blue-900">
          <p>If an account exists for this email, a secure sign-in link has been prepared.</p>
          {devToken && (
            <p className="rounded bg-amber-50 p-2 text-xs">
              Dev token: <code className="break-all">{devToken}</code>
              <br />
              <a href={`/passwordless/verify?token=${devToken}`} className="underline">Use link</a>
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-blue-950">
            Email
            <input type="email" required className="mt-1 w-full rounded border border-blue-200 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button type="submit" className="w-full rounded bg-blue-700 px-4 py-2 text-white">Send sign-in link</button>
        </form>
      )}
    </AuthPageShell>
  );
}
