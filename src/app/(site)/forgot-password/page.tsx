"use client";

import { useState } from "react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/auth/password/reset-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }

  return (
    <AuthPageShell title="Forgot password" subtitle="We will send reset instructions if an account exists">
      {sent ? (
        <p className="text-sm text-blue-900">If an account exists for this email, password reset instructions have been sent.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-blue-950">
            Email
            <input type="email" required className="mt-1 w-full rounded border border-blue-200 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button type="submit" className="w-full rounded bg-blue-700 px-4 py-2 text-white">Send reset instructions</button>
        </form>
      )}
    </AuthPageShell>
  );
}
