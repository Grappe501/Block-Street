"use client";

import { useEffect } from "react";
import Link from "next/link";

type Card = {
  share_slug: string;
  display_name: string;
  preferred_name: string;
  home_place_name: string | null;
};

export function RedirectShareClient({ card, referralCookie }: { card: Card; referralCookie: string }) {
  useEffect(() => {
    document.cookie = `${referralCookie}=${encodeURIComponent(card.share_slug)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }, [card.share_slug, referralCookie]);

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <p className="text-sm font-medium text-brand-700">You&apos;re invited</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Join {card.preferred_name} on ASYON</h1>
      <p className="mt-3 text-lg text-slate-600">
        {card.display_name} wants you in Arkansas youth organizing
        {card.home_place_name ? (
          <>
            {" "}
            · home: <span className="font-semibold text-slate-900">{card.home_place_name}</span>
          </>
        ) : null}
        .
      </p>
      <p className="mt-6 text-sm text-slate-600">
        Ask {card.preferred_name} for an invite link, or sign in if you already have one. Your visit is attributed to their share
        link when you register.
      </p>
      <div className="mt-8 space-y-3">
        <Link
          href="/start"
          className="block rounded-xl bg-brand-700 px-4 py-4 text-center font-semibold text-white hover:bg-brand-800"
        >
          I have an invite — continue
        </Link>
        <Link
          href="/directory"
          className="block rounded-xl border border-slate-200 bg-white px-4 py-4 text-center font-semibold text-slate-900 hover:border-brand-400"
        >
          Explore the directory
        </Link>
      </div>
    </div>
  );
}
