"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Place = { kind: string; slug: string; name: string; county_slug?: string };

export default function AppHomePage() {
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [name, setName] = useState("there");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await fetch("/api/auth/session");
      if (!s.ok) {
        router.replace("/login?next=/app");
        return;
      }
      const sd = await s.json();
      setName(sd.profile?.preferred_name || sd.profile?.display_name || "there");
      const email = sd.profile?.primary_email as string | undefined;
      setIsAdmin(email === "grappe4arkansas@gmail.com" || email === "director@block-street.local");

      const p = await fetch("/api/launch/home-place");
      const pd = await p.json();
      if (!pd.place && !(email === "grappe4arkansas@gmail.com" || email === "director@block-street.local")) {
        router.replace("/choose-place");
        return;
      }
      setPlace(pd.place);
    })();
  }, [router]);

  const placeHref = place
    ? place.kind === "county"
      ? `/county/${place.slug}`
      : place.kind === "high-school"
        ? `/high-schools/${place.slug}`
        : place.kind === "private-school"
          ? `/private-schools/${place.slug}`
          : `/schools/${place.slug}`
    : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="text-sm font-medium text-brand-700">You&apos;re in</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Hi, {name}</h1>
      {place ? (
        <p className="mt-2 text-lg text-slate-600">
          Home: <span className="font-semibold text-slate-900">{place.name}</span>
        </p>
      ) : isAdmin ? (
        <p className="mt-2 text-slate-600">System administrator — start the invite chain when you&apos;re ready.</p>
      ) : null}

      <div className="mt-8 space-y-3">
        <Link
          href="/network"
          className="block rounded-xl bg-brand-700 px-4 py-4 text-center font-semibold text-white hover:bg-brand-800"
        >
          My Network
        </Link>
        <Link
          href="/july-14"
          className="block rounded-xl bg-indigo-700 px-4 py-4 text-center font-semibold text-white hover:bg-indigo-800"
        >
          Tonight — July 14
        </Link>
        {placeHref && (
          <Link
            href={placeHref}
            className="block rounded-xl border border-slate-200 bg-white px-4 py-4 text-center font-semibold text-slate-900 hover:border-brand-400"
          >
            Open my place
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/start"
            className="block rounded-xl border border-brand-300 bg-brand-50 px-4 py-4 text-center font-semibold text-brand-900 hover:bg-brand-100"
          >
            Invite someone (start the chain)
          </Link>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-slate-450 text-slate-500">
        We only show what you need right now. More opens as you grow in the network.
      </p>
    </div>
  );
}
