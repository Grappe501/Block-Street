"use client";

import { useState } from "react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function MfaSetupPage() {
  const [enrollment, setEnrollment] = useState<{ secret?: string; message?: string } | null>(null);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  async function enroll() {
    const res = await fetch("/api/auth/mfa/enroll", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const data = await res.json();
    setEnrollment(data);
  }

  async function verify() {
    const res = await fetch("/api/auth/mfa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) setVerified(true);
  }

  return (
    <AuthPageShell title="Multi-factor authentication" subtitle="Add an extra layer of security to your account">
      {!enrollment && <button type="button" onClick={enroll} className="rounded bg-blue-700 px-4 py-2 text-white">Begin MFA setup</button>}
      {enrollment?.secret && !verified && (
        <div className="space-y-3 text-sm">
          <p>Add this secret to your authenticator app:</p>
          <code className="block break-all rounded bg-blue-50 p-2 text-xs">{enrollment.secret}</code>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" className="w-full rounded border px-3 py-2" />
          <button type="button" onClick={verify} className="rounded bg-blue-700 px-4 py-2 text-white">Verify</button>
        </div>
      )}
      {verified && <p className="text-sm text-green-800">MFA is now enabled for your account.</p>}
    </AuthPageShell>
  );
}
