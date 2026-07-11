"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function InvitationAcceptClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [preview, setPreview] = useState<{ organization_name?: string; workspace_name?: string; email?: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/invitations/${token}`).then(async (res) => {
      if (!res.ok) {
        setError("This invitation is invalid, expired, or has already been used.");
        return;
      }
      const data = await res.json();
      setPreview(data.invitation);
    });
  }, [token]);

  async function accept() {
    if (!token) return;
    setLoading(true);
    const res = await fetch(`/api/invitations/${token}/accept`, { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Unable to accept invitation. Sign in with the invited email first.");
      return;
    }
    router.push("/onboarding");
  }

  return (
    <AuthPageShell title="Accept invitation" subtitle="Join your organization on Block Street">
      {error && <p className="text-sm text-red-800" role="alert">{error}</p>}
      {preview && (
        <div className="space-y-4 text-sm text-blue-900">
          <p>You are invited to <strong>{preview.organization_name}</strong>{preview.workspace_name ? ` · ${preview.workspace_name}` : ""}.</p>
          <p className="text-xs text-blue-700">Invitation sent to: {preview.email}</p>
          <p className="text-xs">Sign in with that email, then accept below.</p>
          <div className="flex gap-2">
            <a href={`/login?next=/invitations/accept?token=${token}`} className="rounded border border-blue-300 px-3 py-2 text-blue-800">Sign in</a>
            <button type="button" disabled={loading} onClick={accept} className="rounded bg-blue-700 px-3 py-2 text-white">{loading ? "Accepting…" : "Accept invitation"}</button>
          </div>
        </div>
      )}
      {!preview && !error && <p className="text-sm text-blue-800">Loading invitation…</p>}
    </AuthPageShell>
  );
}
