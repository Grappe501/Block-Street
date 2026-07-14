"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { LanguageToggle } from "@/components/identity/LanguageToggle";
import { extractInviteToken } from "@/lib/auth/extract-invite-token";
import { resolveJoinPlace } from "@/lib/data";

function JoinPlaceBanner() {
  const searchParams = useSearchParams();
  const place = resolveJoinPlace(searchParams.get("county"), searchParams.get("school"));
  if (!place) return null;

  const title =
    place.kind === "school"
      ? `${place.school.shortName ?? place.school.name} · ${place.county.name} County`
      : `${place.county.name} County Hub`;

  return (
    <div className="mb-4 rounded-lg border border-brand-200 bg-brand-50 p-3 text-sm text-brand-950">
      <p className="font-semibold">Joining from {title}</p>
      <p className="mt-1 text-xs text-brand-800">Paste your invite link below, then continue.</p>
    </div>
  );
}

function JoinIdentityContent() {
  const router = useRouter();
  const [raw, setRaw] = useState("");
  const token = useMemo(() => extractInviteToken(raw), [raw]);

  function continueWithInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    router.push(`/invite/${encodeURIComponent(token)}`);
  }

  return (
    <AuthPageShell
      title="You were invited"
      subtitle="Paste your invitation link. We'll help you create your account and choose your school or county."
    >
      <div className="mb-4 flex justify-end">
        <LanguageToggle />
      </div>

      <Suspense fallback={null}>
        <JoinPlaceBanner />
      </Suspense>

      <form onSubmit={continueWithInvite} className="mt-2 space-y-4">
        <label className="block text-sm font-medium text-blue-950">
          Invitation link or code
          <input
            type="text"
            autoFocus
            placeholder="Paste the full link you received"
            className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-3 text-sm"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            aria-label="Invitation link or code"
          />
        </label>
        {raw && !token ? (
          <p className="text-xs text-amber-800" role="status">
            We couldn&apos;t find an invite code in that text. Paste the full link from your message.
          </p>
        ) : null}
        <button
          type="submit"
          disabled={!token}
          className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          Continue with invitation
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-blue-900">
        Already have an account?{" "}
        <Link href="/login?next=/network" className="font-semibold underline">
          Sign in
        </Link>
      </p>

      <details className="mt-8 rounded-lg border border-blue-100 bg-blue-50/60 p-3 text-xs text-blue-900">
        <summary className="cursor-pointer font-semibold">Need help?</summary>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>
            <Link href="/support/identity" className="underline">
              Identity support
            </Link>
          </li>
          <li>
            <Link href="/july-14" className="underline">
              July 14 meeting page
            </Link>
          </li>
          <li>Invitation-only soft beta — no public signup</li>
        </ul>
      </details>
    </AuthPageShell>
  );
}

export default function JoinIdentityPage() {
  return (
    <Suspense fallback={null}>
      <JoinIdentityContent />
    </Suspense>
  );
}
