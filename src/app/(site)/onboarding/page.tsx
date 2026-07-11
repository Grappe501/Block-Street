"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function OnboardingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ display_name?: string; onboarding_status?: string } | null>(null);

  useEffect(() => {
    fetch("/api/identity/me").then((r) => r.json()).then((d) => setProfile(d.profile ?? null));
  }, []);

  async function complete() {
    await fetch("/api/identity/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboarding_status: "complete", terms_accepted_at: new Date().toISOString() }),
    });
    router.push("/admin");
  }

  return (
    <AuthPageShell title="Welcome" subtitle="Complete a few steps before entering the platform">
      <ol className="list-decimal space-y-2 pl-4 text-sm text-blue-900">
        <li>Identity verified</li>
        <li>Confirm display name: <strong>{profile?.display_name ?? "…"}</strong></li>
        <li>Review organization and workspace membership</li>
        <li>Accept terms and enter platform</li>
      </ol>
      <button type="button" onClick={complete} className="mt-4 w-full rounded bg-blue-700 px-4 py-2 text-white">Enter platform</button>
    </AuthPageShell>
  );
}
