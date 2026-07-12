"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { LanguageToggle, useIdentityLocale } from "@/components/identity/LanguageToggle";
import { ModeBadge } from "@/components/identity/ModeBadge";
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
    <div className="mb-4 rounded border border-brand-200 bg-brand-50 p-3 text-sm text-brand-950">
      <p className="font-semibold">Signing up from {title}</p>
      <p className="mt-1 text-xs text-brand-800">
        Use your invitation token below, or sign in if you already have an account.
      </p>
    </div>
  );
}

function JoinIdentityContent() {
  const { t } = useIdentityLocale();
  const [token, setToken] = useState("");

  return (
    <AuthPageShell title={t("join.title")} subtitle={t("join.body")}>
      <div className="mb-4 flex justify-end">
        <LanguageToggle />
      </div>

      <Suspense fallback={null}>
        <JoinPlaceBanner />
      </Suspense>

      <p className="text-sm text-blue-900">{t("join.body")}</p>

      <div className="mt-6 space-y-3">
        <label className="block text-sm font-medium text-blue-950">
          {t("join.have_invitation")}
          <input
            type="text"
            placeholder="Paste invitation token"
            className="mt-1 w-full rounded border border-blue-200 px-3 py-2 text-sm"
            value={token}
            onChange={(e) => setToken(e.target.value.trim())}
            aria-label="Invitation token"
          />
        </label>
        {token ? (
          <Link
            href={`/invite/${encodeURIComponent(token)}`}
            className="block w-full rounded bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            {t("join.have_invitation")}
          </Link>
        ) : (
          <p className="text-xs text-blue-700">Enter your invitation token to continue.</p>
        )}

        <Link href="/login?next=/identity" className="block w-full rounded border border-blue-300 px-4 py-3 text-center text-sm font-medium text-blue-900">
          {t("join.sign_in")}
        </Link>

        <Link href="/support/identity" className="block text-center text-sm text-blue-800 underline">
          {t("join.support")}
        </Link>
      </div>

      <div className="mt-6 rounded border border-indigo-200 bg-indigo-50 p-3 text-sm">
        <Link href="/july-14" className="font-semibold text-indigo-900 hover:underline">
          {t("join.july14_entry")}
        </Link>
        <p className="mt-1 text-xs text-indigo-800">For invited members with an active Human identity.</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <ModeBadge mode="live" />
        <span className="text-blue-800">Invitation-only · No public registration</span>
      </div>

      <p className="mt-4 text-center text-xs text-blue-700">
        <Link href="/join/community" className="underline">County &amp; school pathways</Link>
      </p>
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
